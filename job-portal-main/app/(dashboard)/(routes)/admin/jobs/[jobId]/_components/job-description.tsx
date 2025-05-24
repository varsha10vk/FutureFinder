'use client'

import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface JobDescriptionProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  description: z.string().min(1)
});

const JobDescription = ({ initialData, jobId }: JobDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [rollName, setRollName] = useState("")
  const [skills, setSkills] = useState("")
  const [aiValue, setAiValue] = useState("")
  const [isPrompting, setIsPrompting] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || ""
    },
  })

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  const hanldePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `Could you please draft a job requirements document for the postion of ${rollName}? The job description should include roles & responsibilities, key features and details about the role. The required skills should include proficiency in ${skills}. Additionaly, you can list any optional skills related to job. Thanks!`

     await getGenerativeAIResponse(customPrompt).then((data) => {
      data = data.replace(/^'|'$/g,"");
      let cleanedText = data.replace(/[\*\#]/g,"")
      setAiValue(cleanedText)
      setIsPrompting(false);
     })
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!")
    }
  }

  const onCopy = () => {
    navigator.clipboard.writeText(aiValue)
    toast.success("Copied to Clipboard")
  }

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Description
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <> Cancel </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* display the description if not editing  */}

      {!isEditing &&(
        <div className={cn("text-sm mt-2", !initialData.description && "text-neutral-500 italic")}>
          {!initialData.description && "No Description"}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}

        </div>
      )}

      {/* on editing mode display the input  */}
      {isEditing && <>
        <div className="flex items-center gap-2 my-2">

          <Input 
          type="text" 
          placeholder="e.g Full-stack Developer" 
          value={rollName} 
          onChange={(e) => setRollName(e.target.value)}
          className="w-full p-2 rounded-md" 
          />

          <Input 
          type="text" 
          placeholder="Required Skill Sets" 
          value={skills} 
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-2 rounded-md" 
          />

          {isPrompting ? <>
            <Button>
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          </> : <>
            <Button onClick={hanldePromptGeneration}>
              <Lightbulb className="h-4 w-4" />
            </Button>
          </>}
        </div>
        <p className="text-xs text-muted-foreground text-right">
          *Note: Professional name & Required Skills delimetted by comma.
        </p>
        {aiValue && (
          <div className="w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
            {aiValue}
            <Button className="absolute  top-3 right-3 z-10" variant={"outline"}size={"icon"}  onClick={onCopy} >
<Copy className=" w-4 h-4"/>
            </Button>
          </div>
        
        )}
        <Form {...form}>
          <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field}/>
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
      </>

      }
    </div>
  )
}

export default JobDescription