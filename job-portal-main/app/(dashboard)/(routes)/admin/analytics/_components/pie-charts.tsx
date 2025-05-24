"use client";

import React from 'react';
import Box from "@/components/box";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Remove server-side imports as we'll pass data as props
interface DashboardProps {
  totalJobs: number;
  userJobs: number;
  totalCompanies: number;
  userCompanies: number;
  jobsByMonth: { name: string; value: number }[];
  companiesByMonth: { name: string; value: number }[];
}

const DashboardAnalyticsPage: React.FC<DashboardProps> = ({
  totalJobs,
  userJobs,
  totalCompanies,
  userCompanies,
  jobsByMonth,
  companiesByMonth
}) => {
  const COLORS = ['#8B4FD5', '#D3B8F7', '#E6D6F7', '#9C5EFF', '#C7A4FF', '#DBC5FF', '#7A3EAD', '#B084D3', '#D1B5E8', '#5A2E82', '#8E5CAD', '#B58ED1'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p className="font-bold">{payload[0].name}</p>
          <p>Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const PieChartComponent = ({ data, title }: { data: any[], title: string }) => (
    <Card className="col-span-2 h-[350px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center items-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box className="flex-col items-start p-4">
      <div className="flex flex-col items-start">
        <h2 className="font-sans tracking-wider font-bold text-2xl">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Overview of your account
        </p>
      </div>
      <Separator className="my-4" />
      
      <div className="grid gap-4 grid-cols-4">
        {/* Total Jobs */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-muted-foreground">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6" /><path d="M23 11h-6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              Jobs created by you: {userJobs}
            </p>
          </CardContent>
        </Card>

        {/* Total Companies */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-muted-foreground">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              Companies created by you: {userCompanies}
            </p>
          </CardContent>
        </Card>


        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies Created By You</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-muted-foreground">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCompanies}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs Created by You!</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-muted-foreground">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userJobs}</div>
          </CardContent>
        </Card>

        {/* Jobs Created by User Pie Chart */}
        <PieChartComponent 
          data={jobsByMonth} 
          title="Jobs Created by User This Year" 
        />

        {/* Companies Created by User Pie Chart */}
        <PieChartComponent 
          data={companiesByMonth} 
          title="Companies Created by User This Year" 
        />
      </div>
    </Box>
  );
};

export default DashboardAnalyticsPage;