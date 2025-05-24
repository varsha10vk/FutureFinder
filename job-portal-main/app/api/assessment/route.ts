import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            hobbies,
            interests,
            strengths,
            areasForImprovement,
            currentRole,
            careerGoals,
            preferredLocation,
            preferredIndustry,
            skillAndQualifications,
            workExperience,
        } = await req.json();

        const createAssessment = await db.assessment.create({
            data: {
                userId,
                hobbies,
                interests,
                strengths,
                areasForImprovement,
                currentRole,
                careerGoals,
                preferredLocation,
                preferredIndustry,
                skillAndQualifications,
                workExperience,
            }
        });

        return NextResponse.json(createAssessment);

    } catch (error) {
        console.log(`[ASSESSMENT_POST]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const GET = async (req: Request) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const assessments = await db.assessment.findMany({
            where: { userId }
        });

        return NextResponse.json(assessments);

    } catch (error) {
        console.log(`[ASSESSMENT_GET]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};