"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

// Zod validation schema
const assessmentSchema = z.object({
  hobbies: z.string().array().min(1, "Please add at least one hobby"),
  interests: z.string().array().min(1, "Please add at least one interest"),
  strengths: z.string().array().min(1, "Please add at least one strength"),
  areasForImprovement: z.string().array().min(1, "Please add at least one area for improvement"),
  currentRole: z.string().min(2, "Current role is required"),
  careerGoals: z.string().min(10, "Please provide more details about your career goals"),
  preferredLocation: z.string().min(2, "Preferred location is required"),
  preferredIndustry: z.string().min(2, "Preferred industry is required"),
  skillAndQualifications: z.string().array().min(1, "Please add at least one skill or qualification"),
  workExperience: z.string().min(10, "Please provide details about your work experience")
});

// Type for the API response
interface AssessmentResult {
  recommendations?: string[];
  matchPercentage?: number;
  suggestedRoles?: string[];
}

// Dynamic Array Input Component
const DynamicArrayInput = ({
  control,
  name,
  label,
  placeholder
}: {
  control: any;
  name: string;
  label: string;
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const values = field.value as string[];

        const addItem = () => {
          if (inputValue.trim()) {
            const newValues = [...values, inputValue.trim()];
            field.onChange(newValues);
            setInputValue('');
          }
        };

        const removeItem = (indexToRemove: number) => {
          const newValues = values.filter((_, index) => index !== indexToRemove);
          field.onChange(newValues);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addItem();
          }
        };

        return (
          <FormItem>
            <FormLabel className="text-gray-700 font-semibold">{label}</FormLabel>
            <div className="flex space-x-2">
              <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={addItem}
                disabled={!inputValue.trim()}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </div>

            {values.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {values.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-blue-100 text-blue-800 rounded-full pl-3 pr-1 py-1 text-sm"
                  >
                    {item}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-5 w-5 p-0 hover:bg-red-100"
                      onClick={() => removeItem(index)}
                    >
                      <X className="h-3 w-3 text-blue-600 hover:text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <FormMessage className="text-red-500 mt-1" />
          </FormItem>
        );
      }}
    />
  );
};

export default function CareerAssessmentForm() {
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      hobbies: [],
      interests: [],
      strengths: [],
      areasForImprovement: [],
      currentRole: '',
      careerGoals: '',
      preferredLocation: '',
      preferredIndustry: '',
      skillAndQualifications: [],
      workExperience: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof assessmentSchema>) => {
    setIsSubmitting(true);
    try {
      // Submit to internal API only
      await axios.post('/api/assessment', values);
      toast.success('Assessment submitted successfully!');
      router.push('/assessment/suggestion-page');
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to submit assessment';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
      console.error('Assessment submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-2xl border-2 border-gray-100">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
        Career Assessment
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <DynamicArrayInput
              control={form.control}
              name="hobbies"
              label="Hobbies"
              placeholder="Enter a hobby (e.g., Photography, Hiking)"
            />

            <DynamicArrayInput
              control={form.control}
              name="interests"
              label="Interests"
              placeholder="Enter an interest (e.g., Machine Learning, Sustainability)"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <DynamicArrayInput
              control={form.control}
              name="strengths"
              label="Strengths"
              placeholder="Enter a strength (e.g., Problem-solving, Communication)"
            />

            <DynamicArrayInput
              control={form.control}
              name="areasForImprovement"
              label="Areas for Improvement"
              placeholder="Enter an area to improve (e.g., Public Speaking, Time Management)"
            />
          </div>

          <DynamicArrayInput
            control={form.control}
            name="skillAndQualifications"
            label="Skills & Qualifications"
            placeholder="Enter a skill or qualification (e.g., Python, Project Management)"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="currentRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Current Role</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Software Engineer, Marketing Manager..." 
                      {...field} 
                      className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Preferred Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="San Francisco, Remote, New York..." 
                      {...field} 
                      className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 mt-1" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="careerGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">Career Goals</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your career aspirations, where you see yourself in 5 years, and what drives your professional growth..." 
                    {...field} 
                    className="min-h-[120px] transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="preferredIndustry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Preferred Industry</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Technology, Healthcare, Renewable Energy..." 
                      {...field} 
                      className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Work Experience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Highlight key roles, achievements, and professional journey..." 
                      {...field} 
                      className="min-h-[120px] transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 mt-1" />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-bold py-3 rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : (
              'Submit Assessment'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}