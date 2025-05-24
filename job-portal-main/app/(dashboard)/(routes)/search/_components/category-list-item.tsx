"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryListItemProps {
  label: string;
  value: string;
}

const CategoryListItem = ({ label, value }: CategoryListItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const serachParams = useSearchParams();

  const currentCategoryId = serachParams.get("categoryId");
  const currentTitle = serachParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };
  return (
    <Button
      type="button"
      onClick={onClick}
      variant={"outline"}
      className={cn(
        "whitespace-nowrap text-sm tracking-wider text-muted-foreground border px-2 py-[2px] rounded-md hover:bg-blue-700 hover:text-white transition cursor-pointer hover:shadow-md",
        isSelected && "bg-blue-700 text-white shadow-sm"
      )}
    >
      {label}
    </Button>
  );
};

export default CategoryListItem;
