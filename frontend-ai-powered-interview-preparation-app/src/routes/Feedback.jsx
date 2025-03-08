import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoaderPage from "./LoaderPage";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import Headings from "@/components/Headings";
import InterviewPin from "@/components/InterviewPin";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CircleCheck, Star } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/BaseURL";

const Feedback = () => {
  const [interview, setInterview] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeed, setActiveFeed] = useState("");

  const { userId } = useAuth();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/auth/getinterview?id=${interviewId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (data) {
          setInterview({
            id: data._id, // Assuming MongoDB uses `_id`
            ...data,
          });
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
      }
    };

    const fetchFeedbacks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/api/auth/answers/get?userId=${userId}&interviewIdRef=${interviewId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch feedbacks.");
        }

        const userAnswerData = await response.json();
        console.log(userAnswerData);

        const interviewData = userAnswerData.map((doc) => ({
          ansId: doc._id,
          ...doc,
        }));

        setFeedbacks(interviewData);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        toast("Error", {
          description: "Something went wrong, please try again later...",
        });
      } finally {
        setIsLoading(false); // ✅ Corrected setIsLoading
      }
    };

    // ✅ Calling the functions properly
    fetchInterview();
    fetchFeedbacks();
  }, [interviewId, userId, navigate]);

  //calculate the ratings out of 10.
  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";

    const totalRating = feedbacks.reduce(
      (prevRes, feedback) => prevRes + feedback.rating,
      0
    );
    return (totalRating / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }
  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <div className="flex items-center justify-between w-full gap-2">
        <CustomBreadCrumb
          breadCrumbPage={"Feedback"}
          breadCrumpItems={[
            { label: "Mock Interviews", link: "/generate" },
            {
              label: `${interview?.position}`,
              link: `/generate/interview/${interview?._id}`,
            },
          ]}
        />
      </div>

      <Headings
        title="Congratulations !"
        description="Your personalized feedback is now availabel. Dive into see you strength, area for improvement, tips to help you to ace your next interview. "
      />

      <p className="text-base text-muted-foreground">
        Your overall interview ratings :{" "}
        <span className="text-emerald-500 font-semibold text-xl">
          {overAllRating} / 10
        </span>
      </p>

      {interview && <InterviewPin interview={interview} onMockPage />}

      <Headings title="Interview Feedback" isSubHeading />

      {feedbacks && (
        <Accordion type="single" collapsible className="space-y-6">
          {feedbacks.map((feed) => (
            <AccordionItem
              key={feed._id}
              value={feed._id}
              className="border rounded-lg shadow-md"
            >
              <AccordionTrigger
                onClick={() => setActiveFeed(feed._id)}
                className={cn(
                  "px-5 py-3 flex items-center justify-center text-base rounded-t-lg transition-colors hover:no-underline",
                  activeFeed === feed._id
                    ? "bg-gradient-to-r from-purple-50 to-blue-50"
                    : "hover:bg-gray-50"
                )}
              >
                <span>{feed.question}</span>
              </AccordionTrigger>

              <AccordionContent>
                {/* Rating */}
                <div className="text-lg font-semibold to-gray-700">
                  <Star className="inline mr-4 text-yellow-400" />
                  Rating : {feed.rating}
                </div>

                {/* Expected by AI Answer */}
                <Card className="border-none space-y-3 p-4 bg-green-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-green-600" />
                    Expected Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.correct_ans}
                  </CardDescription>
                </Card>

                {/* Your Answer */}
                <Card className="border-none space-y-3 p-4 bg-yellow-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-yellow-600" />
                    Your Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.user_ans}
                  </CardDescription>
                </Card>

                {/* Feedback */}
                <Card className="border-none space-y-3 p-4 bg-red-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-red-600" />
                    Feedback
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.feedback}
                  </CardDescription>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default Feedback;
