
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export const PATCH = async (req: Request, {params} : {params : {companyId : string}}) => {
    try {
        const {userId} = await auth();
        const {companyId} = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if(!companyId){
            return new NextResponse("companyId is missing", {status: 401})
        }

        const company = await db.company.findUnique({
            where:{
                id: companyId
            }
        })
        if(!company){
            return new NextResponse("Collge not found", {status: 401})
        }

        const updatedData = {
            followers : company?.followers ? {push: userId} : [userId]
        }

        const updatedcompany =  await db.company.update({
            where : {
                id : companyId,
                userId
            },
            data: updatedData,
        })


        return NextResponse.json(updatedcompany);

    } catch (error) {
        console.log(`[COMPANY_PATCH]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}