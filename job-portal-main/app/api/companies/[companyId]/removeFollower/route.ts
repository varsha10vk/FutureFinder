import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { companyId: string } }) => {
    try {
        const { userId } = await auth();
        const { companyId } = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!companyId) {
            return new NextResponse("companyId is missing", { status: 400 });
        }

        const company = await db.company.findUnique({
            where: {
                id: companyId
            }
        });

        if (!company) {
            return new NextResponse("Company not found", { status: 404 });
        }

        // Remove the current user from the followers array
        const updatedFollowers = company.followers?.filter(followerId => followerId !== userId) || [];

        const updatedCompany = await db.company.update({
            where: {
                id: companyId
            },
            data: {
                followers: updatedFollowers
            }
        });

        return NextResponse.json(updatedCompany);

    } catch (error) {
        console.log(`[COMPANY_REMOVE_FOLLOWER]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}