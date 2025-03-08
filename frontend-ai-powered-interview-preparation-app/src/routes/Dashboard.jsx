import Headings from "@/components/Headings";
import InterviewPin from "@/components/InterviewPin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/clerk-react";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!userId) return; // Ensure user is authenticated
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3000/api/auth/getinterviews?id=${userId}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching interviews: ${response.status}`);
        }

        const data = await response.json();
        setInterviews(data); // Store interviews from API
      } catch (error) {
        console.error("Error fetching interviews:", error);
        toast.error("Error fetching data", {
          description: "Something went wrong. Try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [userId]);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        {/* Heading Section */}
        <Headings
          title="Dashboard"
          description="Here, Just start your AI Mock interview"
        />

        <Link to={"/generate/create"}>
          <Button size={"sm"}>
            <Plus /> Add New
          </Button>
        </Link>
      </div>

      <Separator className="my-8" />
      {/* Content Section */}

      <div className="md:grid md:grid-cols-3 gap-3 py-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 md:h-32 rounded-md" />
          ))
        ) : interviews.length > 0 ? (
          interviews.map((interview) => (
            <InterviewPin key={interview._id} interview={interview} />
          ))
        ) : (
          <div className="md:col-span-3 w-full flex flex-grow items-center justify-center h-96 flex-col">
            <img
              src="/assets/svg/not-found.svg"
              className="w-44 h-44 object-contain"
              alt=""
            />

            <h2 className="text-lg font-semibold text-muted-foreground">
              No Data Found
            </h2>

            <p className="w-full md:w-96 text-center text-sm text-neutral-400 mt-4">
              There is no available data to show. Please add some new mock
              interviews
            </p>

            <Link to={"/generate/create"} className="mt-4">
              <Button size={"sm"}>
                <Plus className="min-w-5 min-h-5 mr-1" />
                Add New
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
