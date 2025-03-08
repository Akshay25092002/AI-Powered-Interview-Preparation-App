import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoaderPage from "./LoaderPage";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import QuestionSection from "@/components/QuestionSection";
import { BASE_URL } from "@/BaseURL";

const MockInterviewPage = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //console.log(interview._id);

  const navigate = useNavigate();

  useEffect(() => {
    // Example: Fetch interview data if needed
    const fetchInterview = async () => {
      if (interviewId) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/auth/getinterview?id=${interviewId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();

          if (data) {
            setInterview({
              id: data._id, // Assuming MongoDB uses `_id`
              ...data,
            });
          }
        } catch (error) {
          console.error("Error fetching interview:", error);
        }
      }
    };
    fetchInterview();
    //console.log("Fetching interview with ID:", interviewId);
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }

  if (!interview) {
    navigate("/generate", { replace: true });
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <CustomBreadCrumb
        breadCrumbPage="Start"
        breadCrumpItems={[
          { label: "Mock Interviews", link: "/generate" },
          {
            label: interview?.position || "",
            link: `/generate/interviews/${interviewId}`,
          },
        ]}
      />

      <div className="w-full">
        <Alert className="bg-sky-100 border-sky-200 p-4 rounded-lg">
          <Lightbulb className="h-5 w-5 text-sky-600" />
          <div>
            <AlertTitle className="text-sky-800 font-semibold">
              Important Information
            </AlertTitle>
            <AlertDescription className="text-sm text-sky-700 mt-1">
              Please enable your webcam and microphone to start the AI-Powered
              Mock Interview. The Interview consists of five questions You'll
              receive a personalized report based on your response at the end.{" "}
              <br />
              <br />
              <span className="font-medium">Note:</span> Your video is{" "}
              <strong>never recorded</strong>. You can disable your webcam at
              any time.
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {interview?.questions && interview?.questions.length > 0 && (
        <div className="mt-4 w-full flex flex-col items-start gap-4">
          <QuestionSection questions={interview?.questions} />
        </div>
      )}
    </div>
  );
};

export default MockInterviewPage;
