'use client'

import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Pencil, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ContactFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  contact: z.string().min(1, { message: "Full name is required" })
});

const ContactForm = ({ initialData, userId }: ContactFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      contact: initialData?.contact || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/user/${userId}`, values);
      toast.success("Contact Updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <Box>
      {!isEditing && (
        <div className={cn("text-lg mt-2 flex items-center gap-2", !initialData?.contact && "text-neutral-500 italic")}>
          <UserCircle className="h-4 w-4 mr-2" />
          {initialData?.contact || "No Contact "}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form className="flex items-center gap-2 flex-1" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <Input
                      type="tel"
                      disabled={isSubmitting}
                      placeholder="e.g. 1234567890"
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

      <Button onClick={toggleEditing} variant="ghost">
        {isEditing ? (
          <>Cancel</>
        ) : (
          <>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </>
        )}
      </Button>
    </Box>
  );
}

export default ContactForm;