"use client";

import { useState, useEffect } from "react";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import { Problem } from "@/utils/types/problem";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";

type WorkspaceProps = {
  problem: Problem;
  contestId?: string; // contestId is optional
};

const Workspace: React.FC<WorkspaceProps> = ({ problem, contestId }) => {
  const { width, height } = useWindowSize();
  const [success, setSuccess] = useState(false);
  const [solved, setSolved] = useState(false);

  // Debug: log the contestId to ensure it is passed correctly.
  useEffect(() => {
    console.log("Workspace received contestId:", contestId);
  }, [contestId]);

  return (
    <div className="flex w-full h-[calc(100vh-62px)] overflow-hidden">
      <ProblemDescription problem={problem} _solved={solved} />
      <div className="bg-dark-fill-2 w-[55%]">
        <Playground
          problem={problem}
          contestId={contestId} // pass contestId to Playground
          setSuccess={setSuccess}
          setSolved={setSolved}
        />
        {success && (
          <Confetti
            gravity={0.3}
            tweenDuration={4000}
            width={width - 1}
            height={height - 1}
          />
        )}
      </div>
    </div>
  );
};

export default Workspace;
