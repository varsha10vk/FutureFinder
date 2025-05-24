'use client'

import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Pencil, Code, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface SkillsFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  skills: z.string().min(1, { message: "At least one skill is required" })
});

const SkillsForm = ({ initialData, userId }: SkillsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState<string[]>(initialData?.skills ? initialData.skills.split(',') : []);
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      skills: initialData?.skills || ""
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async () => {
    try {
      const values = { skills: skills.join(',') };
      await axios.patch(`/api/user/${userId}`, values);
      toast.success("Skills Updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong" + error);
    }
  }

  const toggleEditing = () => setIsEditing((current) => !current);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const skill = inputValue.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <Box>
      {!isEditing && (
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-4 w-4" />
            <span className={cn("text-lg", !skills.length && "text-neutral-500 italic")}>
              {skills.length === 0 && "No Skills Added"}
            </span>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div 
                  key={skill}
                  className="bg-slate-200 text-slate-700 rounded-full px-3 py-1 text-sm"
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {isEditing && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              disabled={isSubmitting}
              placeholder="Type a skill and press Enter"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button 
              type="button" 
              onClick={addSkill}
              disabled={!inputValue.trim()}
            >
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div 
                key={skill}
                className="bg-slate-200 text-slate-700 rounded-full px-3 py-1 text-sm flex items-center gap-1"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-slate-500 hover:text-slate-700 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-x-2">
            <Button 
              onClick={onSubmit} 
              disabled={isSubmitting || skills.length === 0}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      <Button onClick={toggleEditing} variant="ghost" className="mt-4">
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

export default SkillsForm;