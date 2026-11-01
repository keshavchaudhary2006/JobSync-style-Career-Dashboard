'use client';

import React, { useState } from 'react';
import { JobApplication, JobStatus } from '../types/job';
import { COLUMNS } from '../data/mockJobs';
import JobCard from './JobCard';

interface KanbanBoardProps {
  jobs: JobApplication[];
  onStatusChange: (jobId: string, newStatus: JobStatus) => Promise<void>;
  onDelete: (jobId: string) => Promise<void>;
  onOpenAddModal: (status?: JobStatus) => void;
}

export default function KanbanBoard({
  jobs,
  onStatusChange,
  onDelete,
  onOpenAddModal,
}: KanbanBoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Filter jobs by company name or job title
  const filteredJobs = jobs.filter(
    (job) =>
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Board Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search active applications..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Mode Toggle & Total Counter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
            Showing <strong className="text-slate-900 dark:text-white">{filteredJobs.length}</strong> of {jobs.length} jobs
          </span>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <span>Board</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-5 overflow-x-auto pb-6 items-start snap-x">
          {COLUMNS.map((column) => {
            const columnJobs = filteredJobs.filter((job) => job.status === column.id);

            return (
              <div
                key={column.id}
                className={`flex-shrink-0 w-80 rounded-2xl bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-t-4 ${column.color} flex flex-col max-h-[calc(100vh-250px)] snap-start`}
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 tracking-wide">
                      {column.title}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${column.badgeBg} ${column.badgeText}`}
                  >
                    {columnJobs.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-3 space-y-3 overflow-y-auto flex-1 min-h-[140px]">
                  {columnJobs.length > 0 ? (
                    columnJobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        onStatusChange={onStatusChange}
                        onDelete={onDelete}
                      />
                    ))
                  ) : (
                    <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs text-center p-3">
                      <span>No jobs in {column.title}</span>
                    </div>
                  )}
                </div>

                {/* Column Footer: Quick Add Action */}
                <div className="p-2 border-t border-slate-200/60 dark:border-slate-800">
                  <button
                    onClick={() => onOpenAddModal(column.id)}
                    className="w-full py-1.5 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add to {column.title}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST TABLE VIEW ALTERNATIVE */
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Applied</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {job.companyName}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {job.jobTitle}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={job.status}
                          onChange={(e) => onStatusChange(job._id, e.target.value as JobStatus)}
                          className="text-xs font-semibold py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                        >
                          {COLUMNS.map((col) => (
                            <option key={col.id} value={col.id}>
                              {col.title}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {job.dateApplied
                          ? new Date(job.dateApplied).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDelete(job._id)}
                          className="text-slate-400 hover:text-rose-600 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
