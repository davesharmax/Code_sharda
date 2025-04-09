"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Workspace from "@/components/Workspace/Workspace";
import { Problem } from "@/utils/types/problem";
import useHasMounted from "@/hooks/useHasMounted";

const ContestProblemPage = () => {
  const hasMounted = useHasMounted();
  const params = useParams() as { contestId: string; pid: string };
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const problemRef = doc(firestore, "problems", params.pid);
        const docSnap = await getDoc(problemRef);
        if (docSnap.exists()) {
          setProblem({ id: docSnap.id, ...(docSnap.data() as Problem) });
        } else {
          setError("Problem not found.");
        }
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError("Failed to load problem.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [params.pid]);

  if (!hasMounted) return null;
  if (loading) return <div className="text-white text-center mt-6">Loading problem...</div>;
  if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;
  if (!problem) return null;

  return <Workspace problem={problem} />;
};

export default ContestProblemPage;
