import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { columns } from './_components/columns'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import {format} from "date-fns"

import  {JobsColumns} from './_components/columns' 

const page = async () => {


  const {userId} = await auth()

  if(!userId){
    return redirect("/")
  }

  const jobs = await db.job.findMany({
    where:{
      userId
    },
    include: {
      category: true,
      company: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const formattedJobs: JobsColumns[] = jobs.map((job) => ({
    id: job.id,
    title : job.title,
    company : job.company ? job.company?.name : "N/A",
    category : job.category ? job.category?.name : "N/A",
    isPublished : job.isPublished,
    createdAt : job.createdAt ? format(job.createdAt.toLocaleString(), "MMMM do, yyyy") : "N/A",
  }));

  

  return (
    <div className='p-6 '>
      <div className='flex items-end justify-end'>
        <Link href={"/admin/create"}>
          <Button>
            <Plus className='h-5 w-5 mr-2'/>
             New Job
          </Button>
        </Link>
      </div>

      {/* DataTable - List of Jobs */}
      <div className='mt-6'>
        <DataTable columns={columns} data={formattedJobs} searchKey="title"/>
      </div>
    </div>
  )
}

export default page