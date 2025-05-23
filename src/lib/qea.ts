
import type { Job } from '@/types/job';

export interface UserQeaPreferences {
  workLifeBalanceRating: number;
  learningPrograms: boolean;
  flexibleHours: boolean;
  hasMentorship: boolean;
}

const WEIGHTS = {
  WORK_LIFE_BALANCE: 0.3,
  LEARNING_PROGRAMS: 0.25,
  FLEXIBLE_HOURS: 0.20,
  HAS_MENTORSHIP: 0.25,
};
// Total weight sum = 1.0

const MAX_WORK_LIFE_BALANCE_RATING = 5; // Assuming rating is 0-5

export function calculateQEA(job: Job, preferences?: UserQeaPreferences): number {
  let qeaScore = 0;

  if (preferences) {
    // Calculate score based on how well the job matches user preferences
    if (job.workLifeBalanceRating !== undefined && job.workLifeBalanceRating !== null) {
      // Higher matchScore is better (1 if perfect match, 0 if max difference for WLB)
      const wlbDifference = Math.abs(job.workLifeBalanceRating - preferences.workLifeBalanceRating);
      const wlbMatchScore = Math.max(0, 1 - (wlbDifference / MAX_WORK_LIFE_BALANCE_RATING));
      qeaScore += wlbMatchScore * WEIGHTS.WORK_LIFE_BALANCE;
    }
    // For boolean attributes, score if the job's attribute matches the user's preference
    if (job.learningPrograms === preferences.learningPrograms) {
      qeaScore += WEIGHTS.LEARNING_PROGRAMS;
    } else if (preferences.learningPrograms === false && job.learningPrograms === true) {
      // If user prefers NO learning programs, but job has them, no penalty but no points.
      // Or one could argue for a slight penalty if it's a strong negative preference.
      // For simplicity, only reward direct matches for 'true' preferences or non-clashes.
      // If user wants false, and job provides false, that's a match.
    }


    if (job.flexibleHours === preferences.flexibleHours) {
      qeaScore += WEIGHTS.FLEXIBLE_HOURS;
    }

    if (job.hasMentorship === preferences.hasMentorship) {
      qeaScore += WEIGHTS.HAS_MENTORSHIP;
    }
  } else {
    // Original generic QEA calculation (assumes higher/true is generally better)
    if (job.workLifeBalanceRating !== undefined && job.workLifeBalanceRating !== null) {
      const normalizedWLB = Math.max(0, Math.min(job.workLifeBalanceRating, MAX_WORK_LIFE_BALANCE_RATING)) / MAX_WORK_LIFE_BALANCE_RATING;
      qeaScore += normalizedWLB * WEIGHTS.WORK_LIFE_BALANCE;
    }
    if (job.learningPrograms === true) {
      qeaScore += WEIGHTS.LEARNING_PROGRAMS;
    }
    if (job.flexibleHours === true) {
      qeaScore += WEIGHTS.FLEXIBLE_HOURS;
    }
    if (job.hasMentorship === true) {
      qeaScore += WEIGHTS.HAS_MENTORSHIP;
    }
  }

  // Score is between 0 and 1. Convert to 0-100 scale.
  return parseFloat((qeaScore * 100).toFixed(1));
}
