"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { JobCardItem } from '@/components/job-card-item';
import { Assessment } from '@prisma/client';
import { Card } from '@/components/ui/card';

interface Analysis {
  career_goals: string;
  improvement_areas: string;
  personalized_insights: string;
  strengths: string;
  timestamp: string;
}

interface Job {
  Address: any;
  City: string;
  Company: string;
  "Created.At": string;
  "Education.Required": string;
  "Employment.Type": string;
  Industry: any;
  "Job.Description": string;
  "Job.ID": number;
  Label: number;
  Latitude: number;
  "Listing.End": string;
  "Listing.Start": string;
  Longitude: number;
  Position: string;
  Provider: number;
  Requirements: any;
  Salary: any;
  Slug: string;
  "State.Code": string;
  "State.Name": string;
  Status: string;
  TextFeatures: string;
  Title: string;
  "Updated.At": string;
}

interface JobRecommendation {
  job: Job;
  match_confidence: number;
  similarity: number;
}

interface ApiResponse {
  analysis: Analysis;
  recommendations: JobRecommendation[];
  user_profile: {
    areasForImprovement: string;
    careerGoals: string;
    currentRole: string;
    hobbies: string;
    interests: string;
    preferredIndustry: string;
    preferredLocation: string;
    skillnQualifications: string;
    strengths: string;
    workExperience: string;
  };
}

export default function SuggestionPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const handleResponseData = async (responseData: any) => {
    try {
      // If response is already an object, use it directly
      if (typeof responseData === 'object' && responseData !== null) {
        setResult(responseData);
        return;
      }

      // If it's a string, preprocess it to handle NaN and then parse
      if (typeof responseData === 'string') {
        // Replace NaN with null in the string
        const cleanedData = responseData.replace(/:\s*NaN/g, ': null');
        const parsedData = JSON.parse(cleanedData);
        setResult(parsedData);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      toast.error('Error parsing response data');
    }
  };

  useEffect(() => {
    const fetchAssessmentAndGetSuggestions = async () => {
      try {
        const { data: assessments } = await axios.get<Assessment[]>('/api/assessment');
        const latestAssessment = assessments[assessments.length - 1];

        if (!latestAssessment) {
          throw new Error('No assessment found');
        }

        const response = await axios.post(
          //change api and add test-results to your api
          'https://4ca1-34-125-199-136.ngrok-free.app/test-results',
          {
            hobbies: latestAssessment.hobbies.join(','),
            interests: latestAssessment.interests.join(','),
            strengths: latestAssessment.strengths.join(','),
            areasForImprovement: latestAssessment.areasForImprovement.join(','),
            currentRole: latestAssessment.currentRole,
            careerGoals: latestAssessment.careerGoals,
            preferredLocation: latestAssessment.preferredLocation,
            preferredIndustry: latestAssessment.preferredIndustry,
            skillnQualifications: latestAssessment.skillAndQualifications.join(','),
            workExperience: latestAssessment.workExperience
          },
          {
            // Add transformResponse to handle NaN values
            transformResponse: [(data) => {
              try {
                return typeof data === 'string' 
                  ? JSON.parse(data.replace(/:\s*NaN/g, ': null'))
                  : data;
              } catch (error) {
                return data;
              }
            }]
          }
        );

        await handleResponseData(response.data);
      } catch (error) {
        console.error('Failed to get suggestions:', error);
        toast.error('Failed to load suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentAndGetSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-500">Failed to load suggestions</h1>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Career Assessment Results</h1>

      {/* Analysis Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Career Analysis</h2>
          <div className="space-y-4">
            {Object.entries(result?.analysis || {}).map(([key, value]) => (
              key !== 'timestamp' && (
                <div key={key}>
                  <h3 className="font-medium text-gray-700 capitalize">
                    {key.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-gray-600 whitespace-pre-line">{value || 'Not specified'}</p>
                </div>
              )
            ))}
          </div>
        </Card>

        {/* User Profile Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-4">
            {Object.entries(result?.user_profile || {}).map(([key, value]) => (
              <div key={key}>
                <h3 className="font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-gray-600">{value || 'Not specified'}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Job Recommendations Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">
          Recommended Jobs ({result?.recommendations?.length || 0})
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result?.recommendations?.map((recommendation, index) => (
            <JobCardItem
              key={`job-${recommendation.job['Job.ID'] || index}`}
              job={{
                Company: recommendation.job.Company || 'N/A',
                Position: recommendation.job.Position || recommendation.job.Title || 'N/A',
                City: recommendation.job.City || 'N/A',
                State_Name: recommendation.job['State.Name'] || 'N/A',
                Employment_Type: recommendation.job['Employment.Type'] || 'Not specified',
                Job_Description: recommendation.job['Job.Description'] || 'No description available',
                Education_Required: recommendation.job['Education.Required'] || 'Not specified',
                Salary: recommendation.job.Salary?.toString() || 'Not specified',
                Requirements: Array.isArray(recommendation.job.Requirements)
                  ? recommendation.job.Requirements.join(', ')
                  : typeof recommendation.job.Requirements === 'string'
                  ? recommendation.job.Requirements
                  : 'Not specified'
              }}
              matchConfidence={Math.round(recommendation.match_confidence)}
              similarity={Math.round(recommendation.similarity)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}