import { Job } from "@prisma/client";
import PageContents from "../../../search/_components/page-contents"

interface JobContentPageProps{
  userId : string | null;
  jobs: Job[]
}

const JobtabContentPage = ({jobs, userId}: JobContentPageProps) => {
  return <PageContents jobs={jobs} userId={userId}/>
}

export default JobtabContentPage