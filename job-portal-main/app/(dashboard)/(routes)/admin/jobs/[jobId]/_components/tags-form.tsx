"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job Updates");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("something went wrong" + error);
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const hanldePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `Generate an array of top 10 keywords related to thejob professions "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list / array of keywords . Just return me the array alone`;

      // await getGenerativeAIResponse(customPrompt).then((data) => {
      //   if (Array.isArray(JSON.parse(data))){
      //    console.log("In Cliend Side " + JSON.parse(data))
      //    setJobTags((prevTags=> [...prevTags, ...JSON.parse(data)]))
      //   }
      //    setIsPrompting(false)
      //  })
      await getGenerativeAIResponse(customPrompt).then((data) => {
        // Log the raw response for debugging
        console.log("Raw response type:", typeof data);
        console.log(
          "Raw response (first 100 chars):",
          typeof data === "string" ? data.substring(0, 100) + "..." : data
        );

        // Initialize cleaned data with original
        let cleanedData = data;

        if (typeof data === "string") {
          // Check for common prefixes that need to be removed
          const prefixesToRemove = ["json", "javascript", "js"];

          for (const prefix of prefixesToRemove) {
            if (data.trim().startsWith(prefix)) {
              // Find the first '[' after the prefix
              const jsonStartIndex = data.indexOf("[", prefix.length);
              if (jsonStartIndex !== -1) {
                cleanedData = data.substring(jsonStartIndex);
                console.log(
                  "Removed prefix. Cleaned data starts with:",
                  cleanedData.substring(0, 50)
                );
                break;
              }
            }
          }

          // Look for array pattern if no prefix was found
          if (cleanedData === data && !data.trim().startsWith("[")) {
            const arrayStartIndex = data.indexOf("[");
            if (arrayStartIndex !== -1) {
              cleanedData = data.substring(arrayStartIndex);
              console.log(
                "Found array start. Cleaned data starts with:",
                cleanedData.substring(0, 50)
              );
            }
          }
        }

        try {
          const parsedData = JSON.parse(cleanedData);
          if (Array.isArray(parsedData)) {
            console.log(
              "Successfully parsed as array with length:",
              parsedData.length
            );
            setJobTags((prevTags) => [...prevTags, ...parsedData]);
          } else {
            console.log("Data is not an array:", parsedData);
          }
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError);
          console.log(
            "Could not parse cleaned data:",
            cleanedData.substring(0, 200)
          );

          // Last resort: try to find any JSON array in the string
          if (typeof data === "string") {
            const matches = data.match(/\[.*\]/s);
            if (matches && matches[0]) {
              try {
                const lastResortData = JSON.parse(matches[0]);
                if (Array.isArray(lastResortData)) {
                  console.log(
                    "Last resort parsing worked! Array length:",
                    lastResortData.length
                  );
                  setJobTags((prevTags) => [...prevTags, ...lastResortData]);
                }
              } catch (e) {
                console.error("Last resort parsing also failed");
              }
            }
          }

          toast.error("Had trouble processing the AI response");
        } finally {
          setIsPrompting(false);
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const handleTagRemove = (index: number) => {
    const updatedTags = [...jobTags];
    updatedTags.splice(index, 1);
    setJobTags(updatedTags);
  };
  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
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

      {/* display the tags if not editing  */}


        {!isEditing && <div className="flex items-center flex-wrap gap-2">
        {initialData.tags.length > 0 ? (
          initialData.tags.map((tag, index) => (
            <div className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100" key={index}>
                {tag}
            </div>
          ))
        ) : (
          <p> No Tags </p>
        )}
         </div>}

      {/* on editing mode display the input  */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <Input
              type="text"
              placeholder="e.g Full-stack Developer"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 rounded-md"
            />
            {isPrompting ? (
              <>
                <Button>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={hanldePromptGeneration}>
                  <Lightbulb className="h-4 w-4 " />
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            *Note: Professional name alone enough to generate tags.
          </p>

          <div className="flex items-end gap-2 flex-wrap">
            {jobTags.length > 0 ? (
              jobTags.map((tags, index) => (
                <div
                  key={index}
                  className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
                >
                  {tags}{" "}
                  {isEditing && (
                    <Button
                      variant={"ghost"}
                      className="p-0 h-auto"
                      onClick={() => handleTagRemove(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p> No Tags</p>
            )}
          </div>
          <div className="flex items-center gap-2 justify-end mt-4">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setJobTags([]);
                onSubmit({ tags: [] });
              }}
              disabled={isSubmitting}
            > Clear All</Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                onSubmit({ tags: jobTags });
              }}
            >Save</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TagsForm;
