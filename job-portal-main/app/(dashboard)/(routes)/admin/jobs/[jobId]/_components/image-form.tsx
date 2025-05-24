'use client'

import { FileUploader } from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useUploadThing } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ImageFormProps{
  initialData:Job
  jobId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {message : "imageUrl is required"},)
});

const ImageForm = ({initialData, jobId} : ImageFormProps) => {
    const [files, setFiles] = useState<File[]>([])
    const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        imageUrl: initialData?.imageUrl || ""
    }
  })
  const { startUpload } = useUploadThing('imageUploader')

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let uploadedImageUrl = values.imageUrl;
      if (files.length > 0) {
        const uploadedImages = await startUpload(files);
  
        if (!uploadedImages) {
          return;
        }
  
        uploadedImageUrl = uploadedImages[0].url;
      }
      await axios.patch(`/api/jobs/${jobId}`, { imageUrl: uploadedImageUrl });
      toast.success("Image Updated Successfully");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong" + error);
    }
  };
  

const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Thumbnail 
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

      {/* display the imageUrl if not editing  */}

      {!isEditing && (!initialData.imageUrl ? (<div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md"> <ImageIcon className="h-10 w-10 text-neutral-500 "/> </div>):(<div className="relative aspect-video mt-2">  
        <Image 
        alt="Cover Image"
        fill
        className="w-full h-full object-cover"
        src={initialData?.imageUrl}
        />
      </div>))}

      {/* on editing mode display the input  */}
      {isEditing && (
      <Form {...form}>
        <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUploader 
                      onFieldChange={field.onChange}
                      imageUrl={field.value}
                      setFiles={setFiles}
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

export default ImageForm
