"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  ChevronLeft, 
  ArrowRight,
  Building,
  School
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Define TypeScript types
type UserType = "workingProfessional" | "studentExploring" | "studentNoClarity" | null;
type StepType = "selectCategory" | "dashboard" | "careerLibrary";
type TabType = "tech" | "healthcare" | "business";
type CareerItemProps = {
  name: string;
};

// Define careers data
interface CareerCategory {
  title: string;
  description: string;
  careers: string[];
}

const CAREER_DATA: Record<TabType, CareerCategory> = {
  tech: {
    title: "Technology Careers",
    description: "Fast-growing field with diverse opportunities",
    careers: [
      "Software Developer",
      "Data Scientist",
      "UX/UI Designer",
      "Cybersecurity Analyst",
      "Cloud Architect", 
      "AI Specialist"
    ]
  },
  healthcare: {
    title: "Healthcare Careers",
    description: "Essential services with stable demand",
    careers: [
      "Physician",
      "Nurse Practitioner",
      "Physical Therapist",
      "Healthcare Administrator",
      "Medical Researcher",
      "Mental Health Counselor"
    ]
  },
  business: {
    title: "Business Careers",
    description: "Broad field with many specializations",
    careers: [
      "Marketing Manager",
      "Financial Analyst",
      "HR Specialist",
      "Management Consultant",
      "Operations Director",
      "Business Analyst"
    ]
  }
};

// Career item component
const CareerItem: React.FC<CareerItemProps> = ({ name }) => (
  <div className="p-3 bg-blue-50 rounded-md">
    <p className="font-medium text-blue-700">{name}</p>
  </div>
);

export default function CategorySelection(): JSX.Element {
  const [step, setStep] = useState<StepType>("selectCategory");
  const [userType, setUserType] = useState<UserType>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>("tech");
  const router = useRouter();

  const handleCategorySelect = (category: UserType): void => {
    setUserType(category);
    if (category === "workingProfessional") {
      setStep("dashboard");
    } else {
      setStep("careerLibrary");
    }
  };

  const handleWorkingProfessionalConfirm = (answer: boolean): void => {
    if (answer) {
      router.push("/assessment/begin-assessment");
    } else {
      router.push("/search");
    }
  };

  const handleCareerLibraryComplete = (): void => {
    router.push("/assessment/begin-assessment");
  };

  const handleBackButton = (): void => {
    setStep("selectCategory");
  };

  const renderUserTypeIcon = (type: UserType): JSX.Element | null => {
    switch(type) {
      case "workingProfessional":
        return <Briefcase className="text-blue-600 h-5 w-5" />;
      case "studentExploring":
      case "studentNoClarity":
        return <GraduationCap className="text-blue-600 h-5 w-5" />;
      default:
        return null;
    }
  };

  const userTypeLabels: Record<string, string> = {
    workingProfessional: "Working Professional",
    studentExploring: "Student Exploring Options",
    studentNoClarity: "Student Seeking Direction"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-white shadow-xl border-0">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Career Compass</CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                Personalized guidance for your professional journey
              </CardDescription>
            </div>
            {userType && (
              <Badge className="bg-white text-blue-600 hover:bg-white">
                <div className="flex items-center gap-1.5">
                  {renderUserTypeIcon(userType)}
                  <span>{userTypeLabels[userType]}</span>
                </div>
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pt-8 pb-6">
          {step === "selectCategory" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-800">Select Your Category</h2>
              <p className="text-gray-600 mb-4">Choose the option that best describes your current situation</p>
              
              <RadioGroup className="space-y-3">
                <div 
                  className="flex items-start space-x-3 p-3 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all" 
                  onClick={() => handleCategorySelect("workingProfessional")}
                >
                  <RadioGroupItem value="workingProfessional" id="workingProfessional" className="mt-1" />
                  <div className="flex gap-3">
                    <Briefcase className="text-blue-600 h-6 w-6 mt-0.5 flex-shrink-0" />
                    <div>
                      <Label htmlFor="workingProfessional" className="font-medium text-blue-800 text-lg cursor-pointer">Working Professional</Label>
                      <p className="text-gray-600 mt-1">I am currently employed and looking for career growth or a change in my professional path</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="flex items-start space-x-3 p-3 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all" 
                  onClick={() => handleCategorySelect("studentExploring")}
                >
                  <RadioGroupItem value="studentExploring" id="studentExploring" className="mt-1" />
                  <div className="flex gap-3">
                    <School className="text-blue-600 h-6 w-6 mt-0.5 flex-shrink-0" />
                    <div>
                      <Label htmlFor="studentExploring" className="font-medium text-blue-800 text-lg cursor-pointer">Student Exploring Options</Label>
                      <p className="text-gray-600 mt-1">I have some career ideas but need guidance to make informed decisions</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="flex items-start space-x-3 p-3 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all" 
                  onClick={() => handleCategorySelect("studentNoClarity")}
                >
                  <RadioGroupItem value="studentNoClarity" id="studentNoClarity" className="mt-1" />
                  <div className="flex gap-3">
                    <GraduationCap className="text-blue-600 h-6 w-6 mt-0.5 flex-shrink-0" />
                    <div>
                      <Label htmlFor="studentNoClarity" className="font-medium text-blue-800 text-lg cursor-pointer">Student Seeking Direction</Label>
                      <p className="text-gray-600 mt-1">I&apos;m uncertain about my career path and need help discovering suitable options</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-800">Professional Dashboard</h2>
              <p className="text-gray-600">Welcome to your personalized career dashboard. Let&apos;s determine your next steps.</p>
              
              <Alert className="bg-blue-50 border-blue-200 mt-4">
                <AlertTitle className="text-blue-800 font-medium">What would you like to do?</AlertTitle>
                <AlertDescription className="text-gray-700 mt-1">
                  Would you like to take a career assessment to get personalized recommendations, or directly explore job opportunities?
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Button 
                  variant="outline" 
                  className="py-6 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                  onClick={() => handleWorkingProfessionalConfirm(true)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Take Assessment</span>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="py-6 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                  onClick={() => handleWorkingProfessionalConfirm(false)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Explore Jobs</span>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {step === "careerLibrary" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="text-blue-600 h-5 w-5" />
                <h2 className="text-xl font-semibold text-blue-800">Career Library</h2>
              </div>
              <p className="text-gray-600">Explore different career paths to find what interests you. Browse through industries to learn more.</p>
              
              <Tabs 
                defaultValue="tech" 
                value={selectedTab}
                onValueChange={(value) => setSelectedTab(value as TabType)}
                className="mt-6"
              >
                <TabsList className="grid grid-cols-3 w-full bg-blue-50">
                  <TabsTrigger value="tech" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Technology</TabsTrigger>
                  <TabsTrigger value="healthcare" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Healthcare</TabsTrigger>
                  <TabsTrigger value="business" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Business</TabsTrigger>
                </TabsList>
                
                {Object.entries(CAREER_DATA).map(([key, category]) => (
                  <TabsContent key={key} value={key} className="p-5 bg-white border border-blue-100 rounded-md mt-2">
                    <h3 className="font-medium text-blue-800 text-lg">{category.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 mb-3">{category.description}</p>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {category.careers.map((career) => (
                        <CareerItem key={career} name={career} />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t p-6 flex justify-between gap-4">
          {step !== "selectCategory" && (
            <Button 
              variant="outline" 
              className="border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
              onClick={handleBackButton}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          
          {step === "careerLibrary" && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700 flex-1 flex items-center justify-center gap-2" 
              onClick={handleCareerLibraryComplete}
            >
              Continue to Assessment
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          
          {step === "selectCategory" && (
            <div className="w-full text-center text-sm text-gray-500">
              <p>Select a category to begin your career journey</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}