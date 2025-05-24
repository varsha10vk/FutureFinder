export interface AssessmentResult {
  recommendations?: string[];
  matchPercentage?: number;
  suggestedRoles?: string[];
}

export interface Assessment {
  id: string;
  userId: string;
  hobbies: string[];
  interests: string[];
  strengths: string[];
  areasForImprovement: string[];
  currentRole: string;
  careerGoals: string;
  preferredLocation: string;
  preferredIndustry: string;
  skillAndQualifications: string[];
  workExperience: string;
  createdAt: Date;
  updatedAt: Date;
}
