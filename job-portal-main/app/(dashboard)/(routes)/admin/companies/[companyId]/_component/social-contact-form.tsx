"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { Globe, LinkedinIcon, Mail, MapPin, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CompanySocialFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  mail: z.string().min(1, { message: "*Mail is required" }),
  website: z.string().min(1, { message: "*Website is required" }),
  linkedin: z.string().min(1, { message: "*Linkedin is required" }),
  address_line_1: z.string().min(1, { message: "*Address_line_1 is required" }),
  address_line_2: z.string().min(1, { message: "*Address_line_2 is required" }),
  city: z.string().min(1, { message: "*City is required" }),
  state: z.string().min(1, { message: "*State is required" }),
  zipcode: z.string().min(1, { message: "*Zipcode is required" }),
});

const CompanySocialForm = ({
  initialData,
  companyId,
}: CompanySocialFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mail: initialData?.mail || "",
      website: initialData?.website || "",
      linkedin: initialData?.linkedin || "",
      address_line_1: initialData?.address_line_1 || "",
      address_line_2: initialData?.address_line_2 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipcode: initialData?.zipcode || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company Updates");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("something went wrong" + error );
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company&apos;s Social
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

      {/* display the name if not editing  */}

      {!isEditing && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3">
              {initialData.mail && (
                <div className="text-sm text-neutral-500 flex items-center truncate ">
                  <Mail className="w-3 h-3 mr-2" />
                  {initialData.mail}
                </div>
              )}

              {initialData.linkedin && (
                <div className="text-sm text-neutral-500 flex items-center truncate ">
                  <LinkedinIcon className="w-3 h-3 mr-2" />
                  {initialData.linkedin}
                </div>
              )}

              {initialData.website && (
                <div className="text-sm text-neutral-500 flex items-center truncate ">
                  <Globe className="w-3 h-3 mr-2" />
                  {initialData.website}
                </div>
              )}
            </div>
            
            <div className="col-span-3">
              {initialData.address_line_1  && (
                <div className="flex items-center gap-2 justify-start">
                  <MapPin className="w-3 h-3 " />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {initialData.address_line_1}, {initialData.address_line_2}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {initialData.city},{initialData.state} -{" "}
                      {initialData.zipcode}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* on editing mode display the input  */}
      {isEditing && (
        <Form {...form}>
          <form
            className="space-y-4 mt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={isSubmitting}
                      placeholder="Mail : 'sample@mail.com'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Website Link: 'https://companylive.live'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="LinkedIn Link: 'https://linkedin.com/in/usernname'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Address Line 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Address Line 2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="City"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="State"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Zipcode"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CompanySocialForm;
