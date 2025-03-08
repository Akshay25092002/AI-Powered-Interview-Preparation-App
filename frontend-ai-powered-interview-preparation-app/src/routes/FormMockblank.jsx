import { BASE_URL } from "@/BaseURL";
import FormMockInterview from "@/components/FormMockInterview";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CreateEditPage = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);

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
              ...data(),
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchInterview();
    //console.log("Fetching interview with ID:", interviewId);
  }, [interviewId]);

  return (
    <div className="my-4 flex-col w-full">
      <FormMockInterview initialData={interview} />
    </div>
  );
};

export default CreateEditPage;
