'use client';

import React, { useState, useEffect, useCallback } from 'react';
import StatCards from '@/components/StatCards';
import KanbanBoard from '@/components/KanbanBoard';
import AddJobModal from '@/components/AddJobModal';
import { JobApplication, JobStatus } from '@/types/job';
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
  CreateJobInput,
} from '@/lib/api';

export default function HomePage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerNotice, setBannerNotice] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<JobStatus>('Applied');

  // Show temporary banner feedback
  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setBannerNotice({ type, message });
    setTimeout(() => {
      setBannerNotice(null);
    }, 4000);
  };

  // ==========================================
  // 1. Fetch Job Applications (GET /api/jobs)
  // ==========================================
  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchJobs();
      setJobs(data);
    } catch (err: any) {
      console.error('[Error] Loading jobs failed:', err);
      setError(
        err.message || 'Could not connect to the backend API at http://localhost:5000'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // ==========================================
  // 2. Add New Job Application (POST /api/jobs)
  // ==========================================
  const handleAddJob = async (input: CreateJobInput) => {
    try {
      const newJob = await createJob(input);
      // Dynamically prepend new job into state
      setJobs((prevJobs) => [newJob, ...prevJobs]);
      showFeedback(`Successfully added application for ${newJob.companyName}!`);
    } catch (err: any) {
      showFeedback(err.message || 'Failed to add job application.', 'error');
      throw err; // Re-throw to inform modal form
    }
  };

  // ==========================================
  // 3. Update Job Status (PUT /api/jobs/:id)
  // ==========================================
  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    // 1. Snapshot previous state for rollback
    const previousJobs = [...jobs];

    // 2. Optimistic UI update
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
    );

    try {
      // 3. Persist update to Express API
      const updatedJob = await updateJob(jobId, { status: newStatus });
      // Ensure state is synced with server response
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j._id === jobId ? updatedJob : j))
      );
      showFeedback(`Updated status to "${newStatus}" for ${updatedJob.companyName}`);
    } catch (err: any) {
      // 4. Rollback state if server request failed
      setJobs(previousJobs);
      showFeedback(`Failed to update status: ${err.message}`, 'error');
    }
  };

  // ==========================================
  // 4. Delete Job Application (DELETE /api/jobs/:id)
  // ==========================================
  const handleDeleteJob = async (jobId: string) => {
    const jobToDelete = jobs.find((j) => j._id === jobId);
    const previousJobs = [...jobs];

    // 1. Optimistic removal from UI
    setJobs((prevJobs) => prevJobs.filter((j) => j._id !== jobId));

    try {
      // 2. Call backend DELETE endpoint
      await deleteJob(jobId);
      showFeedback(
        `Deleted application for ${jobToDelete ? jobToDelete.companyName : 'job'}.`
      );
    } catch (err: any) {
      // 3. Rollback on failure
      setJobs(previousJobs);
      showFeedback(`Failed to delete application: ${err.message}`, 'error');
    }
  };

  const handleOpenAddModal = (status: JobStatus = 'Applied') => {
    setModalDefaultStatus(status);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification Banner */}
      {bannerNotice && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold border transition-all animate-in fade-in slide-in-from-top-3 ${
            bannerNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800'
          }`}
        >
          {bannerNotice.type === 'success' ? (
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{bannerNotice.message}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              ⚡ Live Backend Synchronized
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Job Applications Board
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Connected directly to MongoDB. Drag, track, and update job progress in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenAddModal('Applied')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-semibold text-sm hover:bg-indigo-50 shadow-md transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Application</span>
            </button>
            <button
              onClick={loadJobs}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all"
              title="Refresh board"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="absolute -right-12 -top-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>

      {/* Backend Error / Connection Warning Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-bold">Unable to reach backend API</p>
              <p className="text-amber-700 dark:text-amber-300">
                {error}. Make sure the Express server is running on port 5000 (`npm run dev` in project root).
              </p>
            </div>
          </div>
          <button
            onClick={loadJobs}
            className="px-3 py-1.5 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100 font-semibold hover:bg-amber-300 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <section aria-label="Application Statistics">
        <StatCards jobs={jobs} />
      </section>

      {/* Kanban Board with Live Data */}
      <section aria-label="Job Application Pipeline">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Application Pipeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live data synchronized with MongoDB. Changes update in real-time.
            </p>
          </div>
        </div>

        {loading && jobs.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Fetching job applications from backend...</p>
          </div>
        ) : (
          <KanbanBoard
            jobs={jobs}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteJob}
            onOpenAddModal={handleOpenAddModal}
          />
        )}
      </section>

      {/* Add Job Application Modal Dialog */}
      <AddJobModal
        isOpen={isModalOpen}
        defaultStatus={modalDefaultStatus}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddJob}
      />
    </div>
  );
}
