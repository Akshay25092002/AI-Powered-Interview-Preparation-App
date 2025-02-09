import Headings from "@/components/Headings";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
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
    </>
  );
};

export default Dashboard;
