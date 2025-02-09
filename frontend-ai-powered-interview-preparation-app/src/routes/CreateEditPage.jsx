import FormMockInterview from "@/components/FormMockInterview";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CreateEditPage = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    // Example: Fetch interview data if needed
    console.log("Fetching interview with ID:", interviewId);
  }, [interviewId]);

  return (
    <div className="my-4 flex-col w-full">
      <FormMockInterview initialData={interview} />
    </div>
  );
};

export default CreateEditPage;
