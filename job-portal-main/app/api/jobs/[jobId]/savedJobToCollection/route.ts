import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
    req: Request,
    { params }: { params: { jobId: string } }
) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { jobId } = params;

        if (!jobId) {
            return new NextResponse("Job ID is missing", { status: 400 });
        }

        // Find the job first
        const existingJob = await db.job.findUnique({
            where: { id: jobId }
        });

        if (!existingJob) {
            return new NextResponse("Job not found", { status: 404 });
        }

        // Update the job by adding the user to savedUsers
        const updatedJob = await db.job.update({
            where: { id: jobId },
            data: {
                savedUsers: {
                    push: userId
                }
            }
        });

        return NextResponse.json(updatedJob, { status: 200 });
    } catch (error) {
        console.error(`[SAVE_JOB_ERROR]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};