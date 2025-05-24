'use client'

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface YearsOfExpFormProps{
  initialData: Job;
  jobId: string;
}

const options =[
  {
    value: "0",
    label: "Freshers",
  },
  {
    value: "2",
    label: "0-2 Years",
  },
  {
    value: "3",
    label: "2-4 years",
  },
  {
    value: "5",
    label:"5+ years"
  }
]


const formSchema = z.object({
  yearsOfExperience: z.string().min(1)
});

const YearsOfExpForm = ({initialData, jobId} : YearsOfExpFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: initialData?.yearsOfExperience || ""
    },
  })

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values)
      toast.success("Job Updates")
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("something went wrong")
    }
  }

const toggleEditing = () => setIsEditing((current) => !current);

const seletedOption = options.find(option => option.value === initialData.yearsOfExperience)

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Years of Experince 
      <Button onClick={toggleEditing} variant={"ghost"}>
        {isEditing ? (
          <> Cancel </>
        ): (
          <>
          <Pencil className="w-4 h-4 mr-2"/>
          Edit
          </>
        )}
      </Button>
      </div>

      {/* display the yearsOfExperience if not editing  */}

      {!isEditing && <p className={cn("text-sm mt-2",!initialData?.yearsOfExperience && "text-neutral-500 italic")}>{seletedOption?.label || "No Experience Added"}</p>}

      {/* on editing mode display the input  */}
      {isEditing && (
      <Form {...form}>
        <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField 
          control={form.control}
          name="yearsOfExperience"
          render={({field}) => (
            <FormItem>
              <FormControl>
               <Combobox 
               options= { options }
               heading= "Experience"
               {...field}
               />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />

          <div className="flex items-center gap-x-2">
            <Button disabled={!isValid || isSubmitting} type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
      )}
    </div>
  )
}

export default YearsOfExpForm