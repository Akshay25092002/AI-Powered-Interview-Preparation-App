import {
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { TooltipButton } from "./TooltipButton";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import SaveModel from "./SaveModel";

const RecordAnswer = ({ question, isWebcam, setIsWebcam }) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (userAnswer?.length < 30) {
        toast.error("Error", {
          description: "You're answer should be more than 30 characters",
        });

        return;
      }

      //ai result
      const aiResult = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );

      //console.log(aiResult);
      setAiResult(aiResult);
    } else {
      startSpeechToText();
    }
  };

  //cleanAiResponse from FormMock INTERVIEW:
  const cleanJsonResponse = (responseText) => {
    // Step 1: Trim any surrounding whitespace
    let cleanText = responseText.trim();

    // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
    cleanText = cleanText.replace(/(json|```|`)/g, "");

    // Step 4: Parse the clean JSON text into an array of objects
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + error?.message);
    }
  };

  const generateResult = async (qst, qstAns, userAns) => {
    setIsAiGenerating(true);
    const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
      Return the result in JSON format with the fields "ratings" (number) and "feedback" (string).
    `;

    try {
      const aiResult = await chatSession.sendMessage(prompt);
      const parsedResult = cleanJsonResponse(aiResult.response.text());
      return parsedResult;
    } catch (error) {
      console.log(error);
      toast("Error", {
        description: "An error occurred while generating feedback.",
      });
      return { ratings: 0, feedback: "Unable to generate feedback" };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    stopSpeechToText();
    startSpeechToText();
  };

  const saveUserAnswer = async () => {
    setLoading(true);

    if (!aiResult) return;

    try {
      const currentQuestion = question.question;

      // ✅ Check if the user has already answered this question
      const checkResponse = await fetch(
        `http://localhost:3000/api/auth/answer/check?userId=${userId}&question=${encodeURIComponent(
          currentQuestion
        )}`
      );

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        console.log("User has already answered this question.");
        toast.info("Already Answered", {
          description: "You have already answered this question",
        });
        return;
      }

      // ✅ Save the user's answer
      const response = await fetch(
        "http://localhost:3000/api/auth/answer/save",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interviewIdRef: interviewId,
            question: currentQuestion,
            correct_ans: question.answer,
            user_ans: userAnswer,
            feedback: aiResult.feedback,
            rating: aiResult.ratings,
            userId,
            //createdAt: new Date().toISOString(), // Timestamp
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save the answer.");
      }

      toast("Saved", { description: "Your answer has been saved." });

      // ✅ Reset user input and stop speech recognition
      setUserAnswer("");
      stopSpeechToText();
    } catch (error) {
      console.error("Error saving answer:", error);
      toast("Error", {
        description: "An error occurred while saving your answer.",
      });
    } finally {
      setLoading(false);
      setOpen(!open); // ✅ Toggle modal state = setOpen((prev) => !prev)
    }
  };

  useEffect(() => {
    const combineTranscripts = results
      .filter((result) => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");

    setUserAnswer(combineTranscripts);
  }, [results]);

  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      {/* save model */}
      <SaveModel
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />

      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
        {isWebcam ? (
          <Webcam
            onUserMedia={() => setIsWebcam(true)}
            onUserMediaError={() => setIsWebcam(false)}
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <TooltipButton
          content={isWebcam ? "Turn Off" : "Turn On"}
          icon={
            isWebcam ? (
              <VideoOff className="min-w-5 min-h-5" />
            ) : (
              <Video className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setIsWebcam(!isWebcam)}
        />

        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={
            isRecording ? (
              <CircleStop className="min-w-5 min-h-5" />
            ) : (
              <Mic className="min-w-5 min-h-5" />
            )
          }
          onClick={recordUserAnswer}
        />

        <TooltipButton
          content="Record Again"
          icon={<RefreshCw className="min-w-5 min-h-5" />}
          onClick={recordNewAnswer}
        />

        <TooltipButton
          content="Save Result"
          icon={
            isAiGenerating ? (
              <Loader className="min-w-5 min-h-5" />
            ) : (
              <Save className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setOpen(!open)}
          disbaled={!aiResult}
        />
      </div>

      <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
        <h2 className="text-lg font-semibold"> Your Answer:</h2>

        <p className="text-sm mt-2 text-gray-700 whitespace-normal">
          {userAnswer || "Start recording to see your answer here"}
        </p>

        {interimResult && (
          <p className="text-sm text-gray-500 mt-2">
            <strong>Current Speech:</strong>
            {interimResult}
          </p>
        )}
      </div>
    </div>
  );
};

export default RecordAnswer;
