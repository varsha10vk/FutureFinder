import { Card } from "@/components/ui/card";

interface JobCardItemProps {
  job: {
    Company: string;
    Position: string;
    City: string;
    State_Name: string;
    Employment_Type: string;
    Job_Description: string;
    Education_Required?: string;
    Salary?: string;
    Requirements?: string;
  };
  matchConfidence: number;
  similarity: number;
}

export const JobCardItem = ({ job, matchConfidence, similarity }: JobCardItemProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{job.Position}</h3>
          <p className="text-gray-600">{job.Company}</p>
          <p className="text-gray-500 text-sm">
            {job.City}, {job.State_Name}
          </p>
        </div>
        <div className="ml-4 text-right">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {job.Employment_Type}
          </div>
          <div className="mt-2 flex flex-col">
            <span className="text-sm font-medium text-green-600">{matchConfidence}% Match</span>
            <span className="text-sm text-blue-600">{similarity}% Similarity</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 line-clamp-3 mb-4 whitespace-pre-line">{job.Job_Description}</p>
      
      <div className="space-y-2 text-sm text-gray-600">
        {Object.entries(job).map(([key, value]) => (
          key !== 'Job_Description' && 
          key !== 'Position' && 
          key !== 'Company' && 
          key !== 'City' && 
          key !== 'State_Name' && 
          key !== 'Employment_Type' && 
          value && 
          value !== 'Not specified' && (
            <div key={key}>
              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}: </span>
              {value}
            </div>
          )
        ))}
      </div>
    </Card>
  );
}