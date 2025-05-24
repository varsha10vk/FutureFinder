"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Define the AssessmentResult interface
interface AssessmentResult {
  suggestedRoles: string[];
  matchPercentage: number;
  careerRecommendations: string[];
  skillGaps: string[];
  developmentPaths: string[];
}

export default function SuggestionPage() {
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve assessment result from localStorage
    const storedResult = localStorage.getItem('assessmentResult');
    
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setAssessmentResult(parsedResult);
      } catch (error) {
        console.error('Error parsing assessment result:', error);
        // Redirect back to assessment if parsing fails
        router.push('/assessment');
      }
    } else {
      // If no result is found, redirect back to assessment
      router.push('/assessment');
    }
  }, [router]);

  if (!assessmentResult) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading assessment results...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Career Assessment Results</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Suggested Roles Card */}
        <Card>
          <CardHeader>
            <CardTitle>Suggested Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {assessmentResult.suggestedRoles.map((role, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded">
                  {role}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Match Percentage Card */}
        <Card>
          <CardHeader>
            <CardTitle>Career Alignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-6xl font-bold text-blue-600">
                {assessmentResult.matchPercentage}%
              </p>
              <p className="text-gray-600">Match to Recommended Paths</p>
            </div>
          </CardContent>
        </Card>

        {/* Career Recommendations Card */}
        <Card>
          <CardHeader>
            <CardTitle>Career Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {assessmentResult.careerRecommendations.map((recommendation, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">✓</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Skill Gaps Card */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Development Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {assessmentResult.skillGaps.length > 0 ? (
                assessmentResult.skillGaps.map((skill, index) => (
                  <li key={index} className="bg-yellow-50 p-2 rounded">
                    {skill}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No specific skill gaps identified</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Development Paths Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Development Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {assessmentResult.developmentPaths.length > 0 ? (
                assessmentResult.developmentPaths.map((path, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2">➜</span>
                    {path}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No specific development paths recommended</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <Button 
          onClick={() => router.push('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Return to Dashboard
        </Button>
        <Button 
          variant="outline"
          onClick={() => router.push('/assessment')}
        >
          Retake Assessment
        </Button>
      </div>
    </div>
  );
}