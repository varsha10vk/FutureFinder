'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface TitleFormProps{
  initialData:{
    title: string;
  };
  jobId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {message : "Title is required"},)
});

const TitleForm = ({initialData, jobId} : TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values)
      toast.success("Job Updates")
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("something went wrong" + error)
    }
  }

const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Title
      <Button onClick={toggleEditing} variant={"ghost"}>
        {isEditing ? (
          <> Cancel </>
        ): (
          <>
          <Pencil className="w-4 h-4 mr-2"/>
          Edit Title
          </>
        )}
      </Button>
      </div>

      {/* display the title if not editing  */}

      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}

      {/* on editing mode display the input  */}
      {isEditing && (
      <Form {...form}>
        <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField 
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input
                disabled={isSubmitting}
                placeholder="e.g Full-stack developer"
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

export default TitleForm