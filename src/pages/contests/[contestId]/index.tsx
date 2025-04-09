"use client";

import { useState, useEffect } from "react";
import { firestore, auth } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";

interface Contest {
  id: string;
  name: string;
  startTime: string;
  duration: number;
  problemIds: string[];
}

interface Problem {
  id: string;
  name: string;
  difficulty?: string;
  category?: string;
  status?: string;
  // Add any additional fields as needed
}

const ContestDetailsPage = () => {
  const params = useParams() as { contestId: string };
  const [contest, setContest] = useState<Contest | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchContest = async () => {
      setErrorMsg(null);
      try {
        const contestRef = doc(firestore, "contests", params.contestId);
        const contestSnap = await getDoc(contestRef);
        if (contestSnap.exists()) {
          const contestData = { id: contestSnap.id, ...(contestSnap.data() as Contest) };
          setContest(contestData);

          // Determine contest active status
          const startDate = new Date(contestData.startTime);
          const endDate = new Date(startDate.getTime() + contestData.duration * 60000);
          const currentTime = new Date();
          setIsActive(currentTime >= startDate && currentTime <= endDate);

          // If contest has started, fetch contest problems
          if (currentTime >= startDate) {
            await fetchProblems(contestData.problemIds);
          }
        } else {
          setErrorMsg("Contest not found.");
        }
      } catch (error) {
        console.error("Error fetching contest:", error);
        setErrorMsg("Error fetching contest details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchProblems = async (problemIds: string[]) => {
      try {
        // Fetch from your problems collection (adjust the collection name if needed)
        const problemsRef = collection(firestore, "problems");
        const querySnapshot = await getDocs(problemsRef);
        const allProblems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Problem),
        }));
        // Filter only the problems that match the contest's problemIds
        const filtered = allProblems.filter((p) => problemIds.includes(p.id));
        setProblems(filtered);
      } catch (error) {
        console.error("Error fetching problems:", error);
        setErrorMsg("Error fetching contest problems.");
      }
    };

    if (user) {
      fetchContest();
    } else {
      setErrorMsg("You must be logged in to view contest details.");
      setLoading(false);
    }
  }, [params.contestId, user]);

  if (loading) return <div className="text-white text-center mt-6">Loading contest details...</div>;
  if (errorMsg) return <div className="text-red-500 text-center mt-6">{errorMsg}</div>;

  return (
    <div className="px-48 p-6 bg-dark-layer-1 w-full min-h-screen text-white">
      {contest && (
        <>
          <h2 className="text-3xl font-bold text-center mb-6">{contest.name}</h2>
          <p className="text-gray-400 mb-4">
            Start Time: {new Date(contest.startTime).toLocaleString()} | Duration: {contest.duration} min
          </p>
          {isActive ? (
            <>
              <h3 className="text-xl font-semibold mb-4">Contest Problems</h3>
              {problems.length > 0 ? (
                <div className="space-y-4">
                  {problems.map((problem) => (
                    <Link key={problem.id} href={`/contests/${contest.id}/${problem.id}`}>
                      <div className="cursor-pointer p-4 bg-dark-layer-2 rounded shadow border border-gray-700 hover:bg-dark-fill-2 transition">
                        <div className="flex justify-between items-center">
                          <h4 className="text-gray-400 text-lg font-bold">{problem.name}</h4>
                          <span className="text-brand-orange">Solve →</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                          {problem.difficulty && <span>{problem.difficulty} | </span>}
                          {problem.category && <span>{problem.category}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No contest problems found.</p>
              )}
            </>
          ) : (
            <>
              <p className="mb-4">The contest is no longer active.</p>
              <Link href={`/contests/${contest.id}/leaderboard`}>
                <button className="px-4 py-2 bg-brand-orange text-white rounded hover:bg-orange-500">
                  View Leaderboard
                </button>
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ContestDetailsPage;
