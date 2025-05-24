import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Preview } from "@/components/preview";
import JobtabContentPage from "./job-tab-content";
import { Company, Job } from "@prisma/client";

interface TabContentSectionProps{
 userId : string | null;
 company : Company;
 jobs: Job[]
}
const TabContentSection = ({
  userId,
  company,
  jobs,
}: TabContentSectionProps) => {
  return (
    <div className="w-full my-4 mt-12">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent shadow-none">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent text-base font-sans tracking-wide"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="joinus"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent text-base font-sans tracking-wide"
          >
            Why Join Us?
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent text-base font-sans tracking-wide"
          >
            Events
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {company.overview ? <Preview value={company.overview}/> : ""}
        </TabsContent>
        <TabsContent value="joinus">
          {company.whyJoinUs ? <Preview value={company.whyJoinUs || ""}/> : ""}
        </TabsContent>
        <TabsContent value="events">
         <JobtabContentPage jobs={jobs} userId={userId} />
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default TabContentSection;
