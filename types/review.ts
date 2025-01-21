export interface Review {
  type: string;
  id?: number;
  discussion_date: string;
  achievements: string;
  challenges: string;
  goals: string;
  skills: string;
  comments: string;
  assessee?: string;
  assessor?: string;
  rating?: string;
}
