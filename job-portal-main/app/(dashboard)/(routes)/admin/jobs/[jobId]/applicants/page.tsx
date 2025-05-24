import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ApplicantsColumns, columns } from "./_components/columns";
import { format } from "date-fns";
import Box from "@/components/box";
import { DataTable } from "@/components/ui/data-table";
import CustomBreadCrum from "@/components/custom-breadcrumb";

const JobApplicantsPage = async ({params} : {params : {jobId: string}}) => {

    const {userId} = await auth();

    const job = await db.job.findUnique({
        where:{
            id: params.jobId,
            userId : userId as string,
        }
    })
    if (!job) {
        redirect("/admin/jobs");
    }

    let profiles = await db.userProfile.findMany({
        include: {
          appliedJobs: true
        }
      })

    const jobs = await db.job.findMany({
        where:{
            userId : userId as string,
        },
        include:{
            company: true,
            category: true,
        },
        orderBy:{
            createdAt: "desc"
        }
    })


    const filteredProfiles = profiles && profiles.filter((profile) => profile.appliedJobs.some(
        (appliedJob) => appliedJob.jobId === params.jobId
    ))

    const formattedProfile : ApplicantsColumns[]= filteredProfiles.map(profile =>({
        id: profile.userId,
        fullName : profile.fullName ? profile.fullName: "",
        email: profile.email ? profile.email: "",
        contact: profile.contact ? profile.contact: "",
        appliedAt : profile.appliedJobs.find((job)=> job.jobId === params.jobId)?.appliedAt?format(new Date(
            profile.appliedJobs.find((job)=> job.jobId === params.jobId)?.appliedAt ?? ""
        ),
        "MMMM do, yyyy"
    ): "",
    }))
    return ( 
        <div className="flex-col p-4 md:p-8 items-center justify-center flex"> 
        <Box> 
        <CustomBreadCrum
        breadCrumPage="Applicants" 
        breadCrumbItem={[ 
        { link: "/admin/jobs", label: "Jobs" }, 
        { link: "/admin/jobs", label: `${job? job.title: ""}`}, 
        ]} 
        /> 
        </Box> 
        <div className="mt-6 w-full"> 
        <DataTable 
        columns={columns} 
        data={formattedProfile} 
        searchKey="fullName" 
        /> 
        </div> 
        </div> 
        );
};

export default JobApplicantsPage;
