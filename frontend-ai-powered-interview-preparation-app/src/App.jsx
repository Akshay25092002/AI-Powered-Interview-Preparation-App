import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import Home from "@/routes/Home";
import AuthLayout from "@/layouts/AuthLayout";
import SignInPage from "@/routes/SignInPage";
import SignUpPage from "@/routes/SignUpPage";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import LoaderPage from "@/routes/LoaderPage";
import MainLayout from "@/layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/*authenticaton Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signin/*" element={<SignInPage />} />
          <Route path="/signup/*" element={<SignUpPage />} />
        </Route>

        {/*Protected Routes */}
        <Route
          element={
            <ProtectedLayout>
              <MainLayout />
            </ProtectedLayout>
          }
        >
          <Route element={<LoaderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
