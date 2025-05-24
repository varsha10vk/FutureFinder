
'use client';

import { Category } from "@prisma/client";
import CategoryListItem from "./category-list-item";


interface CategoryListProps {
    categories: Category[]
}


const CategoryList = ({categories} : CategoryListProps) => {
  return (

    //need to install scrollbar
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2 scrollbar-none">
        {
          categories.map((category) => (
            <CategoryListItem key={category.id} label={category.name}  value={category.id}/>
          ))
        }
    </div>
  )
}

export default CategoryList