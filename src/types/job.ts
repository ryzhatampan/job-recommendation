
export interface CareerPath {
  nextRole: string;
  timeframe: string;
  salaryIncrease: number;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  workType: string; // "remote", "hybrid", "on-site"
  salary: number;
  requiredSkills: string[];
  industry: string;
  description: string;
  workLifeBalanceRating: number; // e.g., 3.4 out of 5
  careerPath?: CareerPath; // Optional as per example
  benefits: string[];
  workCulture: string; // e.g., "startup", "corporate"
  learningPrograms: boolean;
  hasMentorship: boolean;
  flexibleHours: boolean;
  agePreference?: [number, number]; // Optional as per example, e.g. [25, 43]
  qeaScore?: number; // To be calculated
}

export interface JobListResponse {
  jobs: Job[];
}
