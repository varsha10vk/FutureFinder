import Box from "@/components/box";
import CustomBreadCrum from "@/components/custom-breadcrumb";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import NameForm from "./_components/name-form";
import { db } from "@/lib/db";
import EmailForm from "./_components/email-form";
import ContactForm from "./_components/contact-form";
import SkillsForm from "./_components/skills-form";
import { DataTable } from "@/components/ui/data-table";
import { AppliedJobsColumns, columns } from "./_components/column";
import { format } from "date-fns";
import React from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { truncate } from "lodash";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";

const ProfilePage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  let profile = await db.userProfile.findUnique({
    where: {
      userId,
    },
    // include :{
    //   resumes:{
    //     orderBy:{
    //       createdAt: "desc"
    //     }
    //   }
    // }
  });

  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const filteredAppliedJobs =
    profile && profile?.appliedJobs.length > 0
      ? jobs
          .filter((job) =>
            profile.appliedJobs.some(
              (appliedJob) => appliedJob.jobId === job.id
            )
          )
          .map((job) => ({
            ...job,
            appliedAt: profile.appliedJobs.find(
              (appliedJob) => appliedJob.jobId === job.id
            )?.appliedAt,
          }))
      : [];

  const formattedJobs: AppliedJobsColumns[] = filteredAppliedJobs.map(
    (job) => ({
      id: job.id,
      title: job.title,
      company: job.company ? job.company.name : "",
      category: job.category ? job.category?.name : "",
      appliedAt: job.appliedAt
        ? format(new Date(job.appliedAt), "MMMM do,yyyy")
        : "",
    })
  );

  const followedCompany = await db.company.findMany({
    where: {
      followers: {
        has: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col p-4 md:p-8 items-center  justify-centerflex">
      <Box>
        <CustomBreadCrum breadCrumPage="My Profile" />
      </Box>

      <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
        {user && user.hasImage && (
          <div className="aspect-square w-24 h-24 rounded-full shadow-md relative overflow-hidden">
            <Image
              fill
              className="object-cover"
              alt="User Profile Image"
              src={user.imageUrl}
            />
          </div>
        )}

        <NameForm initialData={profile} userId={userId} />
        <EmailForm initialData={profile} userId={userId} />
        <ContactForm initialData={profile} userId={userId} />
        <SkillsForm initialData={profile} userId={userId} />
      </Box>

      <div className="flex flex-col items-center justify-center mt-12 p-8 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4 p-3 bg-primary/10 rounded-full">
        <ArrowRight className="w-6 h-6 text-primary" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Ready for your Assessment?</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Take the next step in your journey by completing our comprehensive assessment.
      </p>
      <Link href="/assessment">
        <Button className="px-6 py-6 text-lg group bg-blue-600" size="lg">
          Start Assessment
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>


      {/* applied job list */}
      <Box className="flex-col items-start justify-start mt-12">
        <h2 className="text-2xl text-muted-foreground font-semibold">
          Applied Jobs
        </h2>
        <div className="w-full mt-6">
          <DataTable
            columns={columns}
            searchKey="company"
            data={formattedJobs}
          />
        </div>
      </Box>

      <Box className="flex-col items-start justify-start mt-12">
        <h2 className="text-2xl text-muted-foreground font-semibold">
          Followed Companies
        </h2>

        <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-2">
          {followedCompany.length === 0 ? (
            <p> No Company</p>
          ) : (
            <React.Fragment>
              {followedCompany.map((com) => (
                <Card className="p-3 space-y-2 relative" key={com.id}>
                  
                  <div className="w-full flex items-center justify-end">
                  <Link href={`companies/${com.id}`}>
                    <Button variant={"ghost"} size={"icon"}>
                      <Eye className="w-4 h-4"/>
                    </Button>
                  </Link>
                  </div>
                  
                  {com.logo && (
                    <div className="w-full h-24 flex items-center justify-center relative overflow-hidden">
                      <Image
                        fill
                        alt="Logo"
                        src={com.logo}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}

                  <CardTitle className="text-lg">{com?.name}</CardTitle>
                  {com.description && (
                    <CardDescription>
                      {truncate(com.description, {
                        length: 80,
                        omission: "...",
                      })}
                    </CardDescription>
                  )}
                </Card>
              ))}
            </React.Fragment>
          )}
        </div>
      </Box>
    </div>
  );
};

export default ProfilePage;
