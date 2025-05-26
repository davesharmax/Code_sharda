// pages/contests/[contestId]/[pid].tsx
"use client";

import React from "react";
import Workspace from "@/components/Workspace/Workspace";
import useHasMounted from "@/hooks/useHasMounted";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";

type Props = {
  problem: Problem;
  contestId: string;
};

const ContestProblemPage: React.FC<Props> = ({ problem, contestId }) => {
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-dark-layer-1 p-6">
      <Workspace problem={problem} contestId={contestId} />
    </div>
  );
};

export default ContestProblemPage;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { pid, contestId } = context.params as {
    pid: string;
    contestId: string;
  };

  const problem = problems[pid];

  if (!problem) {
    return { notFound: true };
  }

  return {
    props: {
      problem,
      contestId,
    },
  };
};
