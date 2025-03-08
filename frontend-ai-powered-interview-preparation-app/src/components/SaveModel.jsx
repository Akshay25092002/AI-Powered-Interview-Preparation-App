import React from "react";
import Model from "./Model";
import { Button } from "./ui/button";

const SaveModel = ({ isOpen, onClose, onConfirm, loading }) => {
  return (
    <Model
      title={"Are you sure?"}
      description="This action can't be undone, you can't edit or re-answer this"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={"outline"} onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-800"
          onClick={onConfirm}
        >
          Continue
        </Button>
      </div>
    </Model>
  );
};

export default SaveModel;
