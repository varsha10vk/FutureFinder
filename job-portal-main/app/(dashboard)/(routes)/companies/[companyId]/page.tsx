
import Box from "@/components/box";
import CustomBreadCrum from "@/components/custom-breadcrumb";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import Image from "next/image";
import { redirect } from "next/navigation";
import ComapnyDetailsContentPage from "./_components/company-details-content";

const CompanyDetailsPage = async ({ params, } : {params : {companyId: string}}) =>{

  const { userId } = await auth();

  const company = await db.company.findUnique({
    where:{
      id: params.companyId
    }
  })

  if(!company || !userId){
    redirect("/")
  }

const jobs = await db.job.findMany({
  where:{
    companyId: params.companyId,
  },
  include:{
    company: true,
  },
  orderBy:{
    createdAt: "desc",
  }
})

  return (
    <div className="flex flex-col items-center">
      <Box className="mt-4 flex justify-center items-center gap-2 mb-4 px-2">
        <CustomBreadCrum 
          breadCrumbItem={[{label: "Company Details", link: "/search"}]}
          breadCrumPage={company?.name !== undefined ? company.name : ""}
        />
      </Box>

      {company?.coverImage && (
        <div className="w-full items-center justify-center overflow-hidden relative h-80 -z-10">
          <Image 
          alt={company?.name}
          src={company?.coverImage}
          fill
          className="w-full h-full object-cover"
          />
        </div>
      )}

      <ComapnyDetailsContentPage jobs={jobs} company={company} userId={userId}/>
    </div>
  );
};

export default CompanyDetailsPage
