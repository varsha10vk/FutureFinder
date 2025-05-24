import { getJobs } from "@/actions/get-jobs";
import SearchContainer from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import CategoryList from "./_components/category-list";
import PageContents from "./_components/page-contents";


interface SearchPageProps {
    searchParams:{
        title: string;
        categoryId: string;
        createdAtFilter: string;
        shiftTiming: string;
        yearsOfExperience: string;
        workMode: string;
    }
}

const SearchPage = async ({searchParams}: SearchPageProps) => {
    const categories = await await db.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });



    const {userId} = await auth();

    const jobs = await getJobs({...searchParams});
    
    console.log(jobs);
  return (
    <>
    <div  className="px-6 pt-6 block md:hidden md:mb-8">
        <SearchContainer />
    </div>

    <div className="p-6">
        {/* categories */}
            <CategoryList categories={categories} />
        {/* applied filters */}

        {/* page content */}
        <PageContents jobs={jobs} userId={userId}/>
    </div>
    </>
  )
}

export default SearchPage