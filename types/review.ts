export interface Review {
  type: string;
  id?: number;
  discussion_date: string;
  achievements: string;
  challenges: string;
  goals: string;
  skills: string;
  comments: string;
  assessee?: Assessee;
  rating?: string;
  assessor?: Assessor;
}

interface Assessee {
  employee_id?: string;
  keka_id?: string;
  email?: string;
  name?: string;
  profile_pic?: string;
  managers?: string[];
}

interface Assessor {
  employee_id?: string;
  keka_id?: string;
  email?: string;
  name?: string;
  profile_pic?: string;
  managers?: string[];
}
