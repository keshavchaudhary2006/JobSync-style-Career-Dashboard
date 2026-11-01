export type JobStatus = 'Wishlist' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
  _id: string;
  companyName: string;
  jobTitle: string;
  status: JobStatus;
  dateApplied: string;
  jobUrl?: string;
  notes?: string;
  location?: string;
  salary?: string;
}

export interface ColumnDefinition {
  id: JobStatus;
  title: string;
  color: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
}
