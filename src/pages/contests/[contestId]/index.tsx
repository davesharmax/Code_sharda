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
}

const ContestDetailsPage = () => {
  const params = useParams() as { contestId: string };
  const [contest, setContest] = useState<Contest | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [user] = useAuthState(auth);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const fetchProblems = async (problemIds: string[]) => {
    try {
      const problemsRef = collection(firestore, "problems");
      const querySnapshot = await getDocs(problemsRef);
      const allProblems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Problem),
      }));
      const filtered = allProblems.filter((p) => problemIds.includes(p.id));
      setProblems(filtered);
    } catch (error) {
      console.error("Error fetching problems:", error);
      setErrorMsg("Error fetching contest problems.");
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchContest = async () => {
      setErrorMsg(null);
      try {
        const contestRef = doc(firestore, "contests", params.contestId);
        const contestSnap = await getDoc(contestRef);
        if (contestSnap.exists()) {
          const contestData = { id: contestSnap.id, ...(contestSnap.data() as Contest) };
          setContest(contestData);

          const startDate = new Date(contestData.startTime);
          const endDate = new Date(startDate.getTime() + contestData.duration * 60000);
          const updateStatus = () => {
            const now = new Date();
            if (now < startDate) {
              setIsActive(false);
              const diff = startDate.getTime() - now.getTime();
              setTimeLeft(`Starts in: ${formatTime(diff)}`);
            } else if (now >= startDate && now <= endDate) {
              setIsActive(true);
              const diff = endDate.getTime() - now.getTime();
              setTimeLeft(`Ends in: ${formatTime(diff)}`);
              fetchProblems(contestData.problemIds);
            } else {
              setIsActive(false);
              setTimeLeft("Contest has ended.");
            }
          };

          updateStatus();
          timer = setInterval(updateStatus, 1000);
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

    if (user) {
      fetchContest();
    } else {
      setErrorMsg("You must be logged in to view contest details.");
      setLoading(false);
    }

    return () => clearInterval(timer);
  }, [params.contestId, user]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  if (loading) return <div className="text-white text-center mt-6">Loading contest details...</div>;
  if (errorMsg) return <div className="text-red-500 text-center mt-6">{errorMsg}</div>;

  return (
    <div className="px-48 p-6 bg-dark-layer-1 w-full min-h-screen text-white">
      {contest && (
        <>
          <h2 className="text-3xl font-bold text-center mb-6">{contest.name}</h2>
          <p className="text-gray-400 mb-1">
            Start Time: {new Date(contest.startTime).toLocaleString()}
          </p>
          <p className="text-gray-400 mb-2">
            Duration: {contest.duration} min
          </p>
          <p className="text-brand-orange font-medium mb-4">{timeLeft}</p>

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
              <p className="mb-4">
                {timeLeft === "Contest has ended." ? "The contest has ended." : "The contest has not started yet."}
              </p>
              {timeLeft === "Contest has ended." && (
                
              <Link
                  href={`/contests/${contest.id}/leaderboard`}
                  className="inline-block px-4 py-2 bg-brand-orange text-white rounded hover:bg-orange-500"
               >
                 View Leaderboard
              </Link>

              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ContestDetailsPage;
