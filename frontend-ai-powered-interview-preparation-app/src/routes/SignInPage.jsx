import { SignIn } from "@clerk/clerk-react";
import React from "react";

const SignInPage = () => {
  return <SignIn path="/signin" />;
};

export default SignInPage;
