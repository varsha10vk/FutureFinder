"use client";
import { Compass, Home, List, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SidebarRouteItems from "./sidebar-route-items";
import Box from "@/components/box";
import { Separator } from "@/components/ui/separator";
import DateFilter from "./date-filter";
import CheckBoxContainer from "./check-box-container";
import qs from "query-string";

const adminRoutes = [
  {
    icons: List,
    label: "Jobs",
    href: "/admin/jobs",
  },
  {
    icons: List,
    label: "Companies",
    href: "/admin/companies",
  },
  {
    icons: List,
    label: "Analytics",
    href: "/admin/analytics",
  },
];

const guestRoutes = [
  {
    icons: Home,
    label: "Home",
    href: "/home",
  },
  {
    icons: Compass,
    label: "Search",
    href: "/search",
  },
  {
    icons: User,
    label: "Profile",
    href: "/profile",
  },
  {
    icons: User,
    label: "Saved Jobs",
    href: "/savedJobs",
  },
];

const shiftTimingsData = [
  {
    value: "full-time",
    label: "Full Time",
  },
  {
    value: "part-time",
    label: "Part Time",
  },
  {
    value: "contract",
    label: "Contract",
  },
];

const workingModesData = [
  {
    value: "remote",
    label: "Remote",
  },
  {
    value: "hybrid",
    label: "Hybrid",
  },
  {
    value: "office",
    label: "Office",
  },
];

const experienceData = [
  {
    value: "0",
    label: "Fresher",
  },
  {
    value: "2",
    label: "0-2 years",
  },
  {
    value: "3",
    label: "2-4 years",
  },
  {
    value: "5",
    label: "5+ years",
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPage = pathname?.startsWith("/admin");
  const isSearchPage = pathname?.startsWith("/search");

  const routes = isAdminPage ? adminRoutes : guestRoutes;
  const handleShiftTimingChange = (shiftTimings: any[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      shiftTiming: shiftTimings,
    };
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updatedQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
  };

  const handleWorkingMode = (workingModes: any[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      workMode: workingModes,
    };
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updatedQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: "comma",
      }
    );
    router.push(url);
  };

  const handleExperience = (experiences: any[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      yearsOfExperience: experiences,
    };
    
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updatedQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: "comma",
      }
    );
    router.push(url);
  };
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarRouteItems
          key={route.href}
          icon={route.icons}
          label={route.label}
          href={route.href}
        />
      ))}

      {isSearchPage && (
        <Box className="px-4 py-4 items-start justify-start space-y-4 flex-col">
          {/* filters section */}

          {/* Date filter */}
          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
            Filters
          </h2>
          <DateFilter />

          <Separator />

          {/* Working Schedule */}
          <h2 className="text-lg text-muted-foreground tracking-wide">
            Working Schedule
          </h2>
          <CheckBoxContainer
            data={shiftTimingsData}
            onChange={handleShiftTimingChange}
          />

          <Separator />

          {/* working  mode */}
          <h2 className="text-lg text-muted-foreground tracking-wide">
            Working Mode
          </h2>
          <CheckBoxContainer
            data={workingModesData}
            onChange={handleWorkingMode}
          />

          <Separator />

          {/* Experience   */}
          <h2 className="text-lg text-muted-foreground tracking-wide">
            Experience
          </h2>
          <CheckBoxContainer
            data={experienceData}
            onChange={handleExperience}
          />
        </Box>
      )}
    </div>
  );
};

export default SidebarRoutes;
