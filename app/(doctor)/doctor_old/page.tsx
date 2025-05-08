import DoctorDashboardOld from '@/components/doctor-page-old';
import { getAllAnamnesisReports } from '@/lib/db/queries';
import { cache } from 'react';

// Cache the data fetching function for 3 seconds
const getReports = cache(async () => {
  // Add revalidation time - 3 seconds
  const reports = await getAllAnamnesisReports({
    limit: 100,
    startingAfter: null,
    endingBefore: null,
  });

  // Return the reports data
  return reports;
});

export const revalidate = 3; // Revalidate this page every 3 seconds

export default async function DoctorPage() {
  // Get reports server-side
  const reportsData = await getReports();

  // Pass the data to client component
  return <DoctorDashboardOld initialReports={reportsData.reports} />;
}
