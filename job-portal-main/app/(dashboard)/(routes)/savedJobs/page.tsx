import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/box";
import CustomBreadCrum from "@/components/custom-breadcrumb";
import SearchContainer from "@/components/search-container";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageContents from "../search/_components/page-contents";

interface SearchProps {
  searchParams:{
      title: string;
      categoryId: string;
      createdAtFilter: string;
      shiftTiming: string;
      yearsOfExperience: string;
      workMode: string;
  }
}

const SavedJobsPage = async ({searchParams} : SearchProps) => {

  const {userId} = await auth();

  if(!userId){
    redirect("/")
  }

  const jobs = await getJobs({...searchParams, savedJobs:true});

  return (
    <div className="flex-col">
      <Box className="mt-4 items-center justify-center gap-2 mb-4 px-2">
        <CustomBreadCrum
        breadCrumPage="Saved Jobs"
        // breadCrumbItem={[]}
        />
      </Box>

      <Box className=" w-full h-44 bg-blue-600/20 justify-center">
        <h2 className="font-sans uppercase text-3xl tracking-wider font-bold">
          Saved Jobs
        </h2>
      </Box>
      <div className="px-6 pt-6 md:mb-0">
      <SearchContainer />
      </div>

      <div className="p-4">
        <PageContents jobs={jobs} userId={userId}/>
      </div>
    </div>
  )
}

export default SavedJobsPage