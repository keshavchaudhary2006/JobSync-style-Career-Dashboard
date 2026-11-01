import { JobApplication, ColumnDefinition } from '../types/job';

export const COLUMNS: ColumnDefinition[] = [
  {
    id: 'Wishlist',
    title: 'Wishlist',
    color: 'border-t-purple-500',
    dotColor: 'bg-purple-500',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/40',
    badgeText: 'text-purple-700 dark:text-purple-300'
  },
  {
    id: 'Applied',
    title: 'Applied',
    color: 'border-t-blue-500',
    dotColor: 'bg-blue-500',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/40',
    badgeText: 'text-blue-700 dark:text-blue-300'
  },
  {
    id: 'Interview',
    title: 'Interview',
    color: 'border-t-amber-500',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
    badgeText: 'text-amber-700 dark:text-amber-300'
  },
  {
    id: 'Offer',
    title: 'Offer',
    color: 'border-t-emerald-500',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300'
  },
  {
    id: 'Rejected',
    title: 'Rejected',
    color: 'border-t-rose-500',
    dotColor: 'bg-rose-500',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/40',
    badgeText: 'text-rose-700 dark:text-rose-300'
  }
];

export const INITIAL_MOCK_JOBS: JobApplication[] = [
  {
    _id: 'job-1',
    companyName: 'Linear',
    jobTitle: 'Senior Frontend Engineer',
    status: 'Offer',
    dateApplied: '2026-10-14',
    jobUrl: 'https://linear.app/careers',
    notes: 'Written offer received: \$175k base + equity. Decision needed by Friday.',
    location: 'Remote',
    salary: '\$165k - \$185k'
  },
  {
    _id: 'job-2',
    companyName: 'Stripe',
    jobTitle: 'Full Stack Engineer (Billing)',
    status: 'Interview',
    dateApplied: '2026-10-20',
    jobUrl: 'https://stripe.com/jobs',
    notes: 'Technical system design interview scheduled for Thursday 2 PM EST.',
    location: 'San Francisco, CA (Hybrid)',
    salary: '\$170k - \$195k'
  },
  {
    _id: 'job-3',
    companyName: 'Vercel',
    jobTitle: 'Developer Experience Engineer',
    status: 'Interview',
    dateApplied: '2026-10-22',
    jobUrl: 'https://vercel.com/careers',
    notes: 'Completed hiring manager screen. Next is live coding assignment.',
    location: 'Remote',
    salary: '\$150k - \$170k'
  },
  {
    _id: 'job-4',
    companyName: 'Supabase',
    jobTitle: 'Backend Engineer (Node/Go)',
    status: 'Applied',
    dateApplied: '2026-10-28',
    jobUrl: 'https://supabase.com/careers',
    notes: 'Submitted via employee referral from Dave.',
    location: 'Remote (Global)',
    salary: '\$140k - \$160k'
  },
  {
    _id: 'job-5',
    companyName: 'Datadog',
    jobTitle: 'Platform Software Engineer',
    status: 'Applied',
    dateApplied: '2026-10-29',
    jobUrl: 'https://datadoghq.com/careers',
    notes: 'Completed automated HackerRank assessment.',
    location: 'New York, NY',
    salary: '\$160k - \$180k'
  },
  {
    _id: 'job-6',
    companyName: 'Airbnb',
    jobTitle: 'Staff UI Engineer',
    status: 'Wishlist',
    dateApplied: '2026-11-01',
    jobUrl: 'https://careers.airbnb.com',
    notes: 'Networking with recruiter on LinkedIn before applying.',
    location: 'Remote (US)',
    salary: '\$190k - \$220k'
  },
  {
    _id: 'job-7',
    companyName: 'Figma',
    jobTitle: 'Design Systems Engineer',
    status: 'Wishlist',
    dateApplied: '2026-11-01',
    jobUrl: 'https://figma.com/careers',
    notes: 'Polishing portfolio cases featuring interactive canvas prototypes.',
    location: 'San Francisco, CA',
    salary: '\$175k - \$200k'
  },
  {
    _id: 'job-8',
    companyName: 'Spotify',
    jobTitle: 'Web Infrastructure Engineer',
    status: 'Rejected',
    dateApplied: '2026-10-10',
    jobUrl: 'https://spotifyjobs.com',
    notes: 'Passed 2 rounds. Position closed internally due to headcount shift.',
    location: 'Remote',
    salary: '\$155k - \$175k'
  }
];
