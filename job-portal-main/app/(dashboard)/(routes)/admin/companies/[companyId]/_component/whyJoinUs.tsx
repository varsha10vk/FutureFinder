'use client'

import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface WhyJoinUsProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  whyJoinUs: z.string().min(1)
});

const WhyJoinUs = ({ initialData, companyId }: WhyJoinUsProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [rollName, setRollName] = useState("")
  const [aiValue, setAiValue] = useState("")
  const [isPrompting, setIsPrompting] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whyJoinUs: initialData?.whyJoinUs || ""
    },
  })

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values)
      toast.success("Company Updates")
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
      const customPrompt = `Create a compelling "Why Join Us" content for ${rollName} company. Highlight the unique opportunities, benefits and experiences that ${rollName} offers to its employees. Emphasize the platform's value proposition, such as access to a vast music library, personalised recommendation, exclusive content, community features, and career opportunites for the musicians and creators. Tailor the content to attract potential user and illustrate why ${rollName} stands out among other music streaming platforms.`
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
        Why Join Us?
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

      {/* display the whyJoinUs if not editing  */}

      {!isEditing &&(
        <div className={cn("text-sm mt-2", !initialData.whyJoinUs && "text-neutral-500 italic")}>
          {!initialData.whyJoinUs && "No Details!"}
          {initialData.whyJoinUs && (
            <Preview value={initialData.whyJoinUs} />
          )}

        </div>
      )}

      {/* on editing mode display the input  */}
      {isEditing && <>
        <div className="flex items-center gap-2 my-2">

          <Input 
          type="text" 
          placeholder="e.g Microsoft, Google " 
          value={rollName} 
          onChange={(e) => setRollName(e.target.value)}
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
          *Note: Type the company name overhere to generate the whyJoinUs content.
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
              name="whyJoinUs"
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

export default WhyJoinUs