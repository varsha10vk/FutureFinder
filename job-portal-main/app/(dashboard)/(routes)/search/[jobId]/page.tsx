import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import JobDetailsContent from "./_components/job-details-content";
import { UserProfile } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { getJobs } from "@/actions/get-jobs";

import PageContents from "../_components/page-contents";
import Box from "@/components/box";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const { userId } = await auth();

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
    },
    include: {
      company: true,
    },
  });

  if (!job) {
    redirect("/search");
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId: userId as string,
    },
  });

  const jobs = await getJobs({});

  const filterredJobs = jobs.filter(
    j => j.id !== job?.id && j.categoryId === job?.categoryId
  );

  return (
    <div className="flex-col p-4 md:p-8">
      <JobDetailsContent job={job} jobId={job.id} userProfile={profile} />

      {filterredJobs && filterredJobs.length > 0 && (
        <>
          <Separator />
          <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
            <h2 className="text-lg font-semibold"> Related Jobs</h2>
          </Box>

          <PageContents jobs={filterredJobs} userId={userId}/>
        </>
      )} 
    </div>
  );
};

export default JobDetailsPage;
