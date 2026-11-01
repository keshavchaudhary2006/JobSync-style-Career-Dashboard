import { JobApplication, JobStatus } from '../types/job';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/jobs';

export interface CreateJobInput {
  companyName: string;
  jobTitle: string;
  status: JobStatus;
  dateApplied?: string;
  jobUrl?: string;
  notes?: string;
}

export interface UpdateJobInput {
  companyName?: string;
  jobTitle?: string;
  status?: JobStatus;
  dateApplied?: string;
  jobUrl?: string;
  notes?: string;
}

/**
 * Fetch all job applications from the Express API
 */
export async function fetchJobs(): Promise<JobApplication[]> {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Always fetch fresh data in development
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch jobs (${response.status})`);
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * Create a new job application
 */
export async function createJob(data: CreateJobInput): Promise<JobApplication> {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create job (${response.status})`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Update an existing job application by ID
 */
export async function updateJob(
  id: string,
  updates: UpdateJobInput
): Promise<JobApplication> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update job (${response.status})`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Delete a job application by ID
 */
export async function deleteJob(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete job (${response.status})`);
  }
}
