
'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Home } from "lucide-react";
  
  
interface CustomBreadCrumProps {
    breadCrumPage : string;
    breadCrumbItem? : {link : string; label: string }[],
}

const CustomBreadCrum = ({breadCrumPage, breadCrumbItem}: CustomBreadCrumProps) => {
  return (
    <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/" className="flex items-center justify-center"><Home className="w-4 h-3 mr-2"/> Home</BreadcrumbLink>
      </BreadcrumbItem>

      {breadCrumbItem && (
        <>
            {breadCrumbItem.map((item, i) => (
                <>
                <BreadcrumbSeparator key={i}/>
                <BreadcrumbItem>
                <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
                </BreadcrumbItem>
                </>
            ))}
        </>
      )}
      <BreadcrumbSeparator />
      <BreadcrumbItem>
       <BreadcrumbPage>
       {breadCrumPage}
       </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
  
  )
}
 
export default CustomBreadCrum 