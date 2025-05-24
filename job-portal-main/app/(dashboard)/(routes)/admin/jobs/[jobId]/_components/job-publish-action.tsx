"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface JobPublishActionProps {
  disable: boolean;
  jobId: string;
  isPublished: boolean;
}

const JobPublishAction = ({
  jobId,
  disable,
  isPublished,
}: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
const router = useRouter();

  const onClick = async () => {
    try {
    setIsLoading(true);
    if(isPublished){
        await axios.patch(`/api/jobs/${jobId}/unpublish`);
        toast.success("Job Un-published successfully");
    }else{
        await axios.patch(`/api/jobs/${jobId}/publish`);
        toast.success("Job published successfully");
    }
    router.refresh();
    } catch (error) {
        toast.error("Failed to publish job");
        console.log((error as Error)?.message);
    }finally{
        setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
        setIsLoading(true);
        await axios.delete(`/api/jobs/${jobId}`);
        toast.success("Job deleted successfully");
        router.push("/admin/jobs");
        router.refresh();
        } catch (error) {
            toast.error("Failed to delete job");
            console.log((error as Error)?.message);
        }finally{
            setIsLoading(false);
        }
  };

  return (
    <div className="flex items-center gap-x-3">
      <Button
        variant={"outline"}
        onClick={onClick}
        disabled={isLoading || disable}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <Button
        variant={"destructive"}
        size={"icon"}
        disabled={isLoading}
        onClick={onDelete}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default JobPublishAction;
