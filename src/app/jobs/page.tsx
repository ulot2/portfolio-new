import JobsDashboard from "./JobsDashboard";

// The middleware verifies the session before this ever renders, and
// /api/jobs checks it again before returning a single role.
export default function JobsPage() {
  return <JobsDashboard />;
}
