import { BASE_URL } from "@/BaseURL";
import LoaderPage from "@/routes/LoaderPage";
import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthHandler = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // only if it signin and only if its have user data
    const storeUserData = async () => {
      if (isSignedIn && user) {
        setLoading(true);
        try {
          const userSnap = await fetch(
            `${BASE_URL}/api/auth/getuser?id=${user.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          let response = null;
          if (userSnap.ok && userSnap.headers.get("content-length") !== "0") {
            response = await userSnap.json();
          }

          //const response = await userSnap.json();
          if (!response || Object.keys(response).length === 0) {
            const userData = await fetch(`${BASE_URL}/api/auth/adduser`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: user.id,
                name: user.fullName || user.firstName || "Anonymous",
                email: user.primaryEmailAddress?.emailAddress || "N/A",
                imageUrl: user.imageUrl,
              }),
            });
            const json = await userData.json();
            console.log("New user added:", json);
          }
          console.log("Fetched user data:", response);
        } catch (error) {
          console.log("error on stroring the user data: ", error);
        } finally {
          setLoading(false);
        }
      }
    };
    storeUserData();
  }, [isSignedIn, user, pathname, navigate]);

  if (loading) {
    return <LoaderPage />;
  }
  return null;
};

export default AuthHandler;
