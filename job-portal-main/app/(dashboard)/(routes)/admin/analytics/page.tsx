import { 
    getTotalJobs, 
    getTotalJobCreatedByUser, 
    getTotalCompanies, 
    getTotalCompanyCreatedByUser,
    getPieGraphJobCreatedByUser,
    getPieGraphCompanyCreatedByUser
  } from "@/actions/get-overiew-analytics";
  import DashboardAnalyticsPage from "./_components/pie-charts";
import { auth } from "@clerk/nextjs/server";

  export default async function DashboardPage() {
    const { userId } = await auth();
  
    // Fetch dashboard metrics
    const totalJobs = await getTotalJobs();
    const userJobs = await getTotalJobCreatedByUser(userId);
    const totalCompanies = await getTotalCompanies();
    const userCompanies = await getTotalCompanyCreatedByUser(userId);
  
    // Fetch jobs and companies by month
    const jobsByMonth = await getPieGraphJobCreatedByUser(userId);
    const companiesByMonth = await getPieGraphCompanyCreatedByUser(userId);
  
    return (
      <DashboardAnalyticsPage 
        totalJobs={totalJobs}
        userJobs={userJobs}
        totalCompanies={totalCompanies}
        userCompanies={userCompanies}
        jobsByMonth={jobsByMonth}
        companiesByMonth={companiesByMonth}
      />
    );
  }