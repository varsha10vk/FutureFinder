import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  shiftTiming?: string;
  yearsOfExperience?: string;
  workMode?: string;
  savedJobs?: boolean;
};


export const getJobs = async ({
    title,
    categoryId,
    createdAtFilter,
    shiftTiming,
    yearsOfExperience,
    workMode,
    savedJobs,
}: GetJobs) : Promise<Job[]> => {

const {userId} = await auth();

try {
    let query : any = {
        where: {
            isPublished: true,
        },
        include :{
            company: true,
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    }

    if(typeof title !== "undefined" || typeof categoryId !== "undefined"){
        query.where ={
            AND : [
                typeof title !== "undefined" && {
                    title : {
                        contains : title,
                        mode : "insensitive"
                    }
                },
                typeof categoryId !== "undefined" && {
                    categoryId : {
                        equals : categoryId
                    }
                }
            ].filter(Boolean)
        }
    }

    //check wheter craetedatFikter isprovided or not

    if(createdAtFilter){
        const currentDate = new Date();
        let startDate : Date;
        switch(createdAtFilter){
            case"today":
            startDate = new Date(currentDate);
            break;

            case "yesterday": 
            startDate = new Date(currentDate);
            startDate.setDate(startDate.getDate()-1);
            break;

            case "thisWeek": 
            startDate = new Date(currentDate);
            startDate.setDate(startDate.getDate()- currentDate.getDay());
            break;

            case "lastWeek": 
            startDate = new Date(currentDate);
            startDate.setDate(startDate.getDate()- currentDate.getDay() - 7);
            break;

            case "thisMonth": 
            startDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1
            )
            break;
            
            default:
            startDate = new Date(0);
        }

        //add the condition in query

        query.where.createdAt = {
            gte: startDate,
        }
    }

    //filter the data based on shift timing

    let formattedShiftTiming = shiftTiming?.split(',');

    if(formattedShiftTiming && formattedShiftTiming.length > 0){
        query.where.shiftTiming = {
            in: formattedShiftTiming,
        }
    }


    let formattedWorkingMode = workMode?.split(',');

    if(formattedWorkingMode && formattedWorkingMode.length > 0){
        query.where.workMode = {
            in: formattedWorkingMode,
        }
    }

    let formattedYOExperience = yearsOfExperience?.split(',');

    if(formattedYOExperience && formattedYOExperience.length > 0){
        query.where.yearsOfExperience = {
            in: formattedYOExperience,
        }
    }

    if(savedJobs){
        query.where.savedUsers = {
            has: userId,
        }
    }

    const jobs = await db.job.findMany(query);
    return jobs;

} catch (error) {
    console.log(`[GET_JOBS] : ${error}`);
    return [];
}

}