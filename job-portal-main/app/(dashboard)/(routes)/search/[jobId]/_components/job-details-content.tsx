"use client";
import { Banner } from "@/components/banner";
import Box from "@/components/box";
import CustomBreadCrum from "@/components/custom-breadcrumb";
import { Preview } from "@/components/preview";
import { ApplyModal } from "@/components/ui/appy-modal";
import { Button } from "@/components/ui/button";
import { Company, Job, UserProfile } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface JobDetailsContentProps {
  job: Job & { company: Company | null };
  jobId: string;
  userProfile: UserProfile | null;
}
const JobDetailsContent = ({
  job,
  jobId,
  userProfile,
}: JobDetailsContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onApplied = async () => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/user/${userProfile?.userId}/appliedJobs`, jobId);

      //send mail
      await axios.post("/api/thankyou",{
        fullName: userProfile?.fullName,
        email : userProfile?.email ,
      })


    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("Something wen wrong...!");
    } finally {
      setOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <>
      <ApplyModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onApplied}
        loading={isLoading}
        userProfile={userProfile}
      />

      {userProfile &&
        userProfile?.appliedJobs?.some(
          (appliedJobs) => appliedJobs.jobId === jobId
        ) && (
          <Banner
            variant={"success"}
            label="Thankyou! for applying. Your Application has been received and we're reviewing it carefully. we will be in touch soon with an update."
          />
        )}
      <Box className="mt-4">
        <CustomBreadCrum
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumPage={job?.title !== undefined ? job.title : ""}
        />
      </Box>

      {/* job cover image */}

      <Box className="mt-4">
        <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
          {job?.imageUrl ? (
            <Image
              alt={job.title}
              fill
              className="object-cover w-full h-full"
              src={job?.imageUrl}
            />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
              <h2 className="text-3xl font-semibold tracking-wider"></h2>
            </div>
          )}
        </div>
      </Box>

      {/* title */}
      <Box className="mt-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-600">
            {job.title}
          </h2>
          <Link href={`/companies/${job.companyId}`}>
            <div className="flex items-center gap-2 mt-1">
              {job?.company?.logo && (
                <Image
                  alt={job?.company?.name}
                  width={25}
                  height={25}
                  src={job?.company?.logo}
                />
              )}
              <p className="text-muted-foreground text-sm font-semibold">
                {job?.company?.name}
              </p>
            </div>
          </Link>
        </div>

        <div>
          {userProfile ? (
            <>
              {!userProfile.appliedJobs.some(
                (appliedJob) => appliedJob.jobId === jobId
              ) ? (
                <Button
                  className="text-sm bg-blue-700 hover:bg-blue-900 hover:shadow-sm"
                  onClick={() => setOpen(true)}
                >
                  Apply
                </Button>
              ) : (
                <Button
                  className="text-sm bg-blue-700 hover:bg-blue-900 text-white hover:shadow-sm"
                  variant={"outline"}
                >
                  Already Applied
                </Button>
              )}
            </>
          ) : (
            <Link href={"/user"}>
              <Button className="text-sm px-8 bg-blue-700 hover:bg-blue-900 hover:shadow-sm">
                Update Profile
              </Button>
            </Link>
          )}
        </div>
      </Box>

      {/* description */}

      <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
        <h2 className="text-lg font-semibold"> Description </h2>
        <p className="font-sans"> {job?.short_description}</p>
      </Box>

      {job?.description && (
        <Box>
          <Preview value={job?.description} />
        </Box>
      )}
    </>
  );
};

export default JobDetailsContent;
