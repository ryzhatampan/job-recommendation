
import type { Job } from '@/types/job';

const WEIGHTS = {
  WORK_LIFE_BALANCE: 0.3,
  LEARNING_PROGRAMS: 0.25,
  FLEXIBLE_HOURS: 0.20,
  HAS_MENTORSHIP: 0.25,
};
// Total weight sum = 1.0

const MAX_WORK_LIFE_BALANCE_RATING = 5; // Assuming rating is 0-5

export function calculateQEA(job: Job): number {
  let qeaScore = 0;

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

  // Score is between 0 and 1. Convert to 0-100 scale.
  return parseFloat((qeaScore * 100).toFixed(1));
}
