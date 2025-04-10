"use client";

import Workspace from "@/components/Workspace/Workspace";
import useHasMounted from "@/hooks/useHasMounted";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";

type ContestProblemPageProps = {
  problem: Problem;
};

const ContestProblemPage: React.FC<ContestProblemPageProps> = ({ problem }) => {
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  return (
    <div>
      <Workspace problem={problem} />
    </div>
  );
};

export default ContestProblemPage;

// Use fallback "blocking" so pages are generated on-demand
export const getStaticPaths: GetStaticPaths = async () => {
  // You can choose to pre-generate paths if you know the contest IDs.
  // For now, we'll return an empty paths array and let fallback: "blocking" handle it.
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { pid } = params as { pid: string };
  const problem = problems[pid];

  if (!problem) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      problem,
    },
  };
};
