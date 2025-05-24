"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import {
  BadgeCheck,
  Ban,
  Loader,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface CellActionProps {
  id: string;
  fullName: string;
  email: string;
}

const CellAction = ({ id, fullName, email }: CellActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRejection, setIsRejection] = useState(false);


  const sendRejected = async() =>{
    setIsLoading(true)

    try {
      await axios.post("/api/sendRejected", {email , fullName})
      toast.success("Successfully sent the mail");
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }
  const sendSelected =async() =>{
    setIsRejection(true)
    try {
      await axios.post("/api/sendSelected", {email , fullName})
      toast.success("Successfully sent the mail");
      setIsRejection(false)
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isLoading ? (
          <DropdownMenuItem className="flex items-center justify-center">
            <Loader className="w-4 h-4 animate-spin" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={sendSelected} className="flex items-center justify-center">
            <BadgeCheck className="w-4 h-4 " />
            Selected
          </DropdownMenuItem>
        )}

        {isRejection ? (
          <DropdownMenuItem className="flex items-center justify-center">
            <Loader className="w-4 h-4 animate-spin" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={sendRejected}  className="flex items-center justify-center">
            <Ban className="w-4 h-4" />
            Rejected
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellAction;
