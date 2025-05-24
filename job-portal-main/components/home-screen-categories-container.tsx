"use client";

import { Category } from "@prisma/client";
import Box from "./box";
import { Card } from "./ui/card";
import queryString from "query-string";
import { useRouter } from "next/navigation";

interface HomeScreenCategoriesProps {
  categories: Category[];
}

export const CategoryListItemCard = ({ data }: { data: Category }) => {

    const router = useRouter();
const handleClick = (category : string) =>{
    const href = queryString.stringifyUrl({
      url: "/search",
      query: {
        categoryId: category || undefined,
      }
      })
      router.push(href)
    }

  return (
    <Card className="flex items-center gap-2 p-2 text-muted-foreground hover:bg-muted transition-colors cursor-pointer" onClick={() => handleClick(data.id)}>
      {data.name}
    </Card>
  );
};

const HomeScreenCategories = ({ categories }: HomeScreenCategoriesProps) => {
  return (
    <Box className="flex-col mt-12">
      <div className="w-full flex flex-wrap items-center justify-centery gap-4">
        {categories.map((item) => (
          <CategoryListItemCard key={item.id} data={item} />
        ))}
      </div>
    </Box>
  );
};

export default HomeScreenCategories;
