"use client";

import { useEffect, useState } from "react";
import { firestore, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";

interface Contest {
  id: string;
  name: string;
  startTime: string;
  duration: number;
}
interface ContestList {
  active: Contest[];
  past: Contest[];
}

const Contests = () => {
  const [user] = useAuthState(auth);
  const [contests, setContests] = useState<ContestList>({
    active: [],
    past: [],
  });
  const [isFaculty, setIsFaculty] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const contestsRef = collection(firestore, "contests");
        const querySnapshot = await getDocs(contestsRef);
        const contestsData = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Contest),
          id: doc.id,
        }));

        const now = new Date();
        const active: Contest[] = [];
        const past: Contest[] = [];

        contestsData.forEach((c) => {
          const start = new Date(c.startTime);
          const end = new Date(start.getTime() + c.duration * 60000);
          if (now >= start && now <= end) active.push(c);
          else if (now > end) past.push(c);
        });

        setContests({ active, past });
      } catch (err) {
        console.error("Error fetching contests:", err);
        setErrorMsg("Failed to load contests. Please try again later.");
      }
    };

    const checkRole = async () => {
      if (!user) return;
      try {
        const usersRef = collection(firestore, "users");
        const snap = await getDocs(usersRef);
        const me = snap.docs.find((d) => d.id === user.uid);
        if (me && (me.data() as any).role === "faculty") setIsFaculty(true);
      } catch (err) {
        console.error("Error checking user role:", err);
      }
    };

    fetchContests();
    checkRole();
  }, [user]);

  return (
    <div className="px-48 p-6 bg-dark-layer-1 w-full h-[calc(100vh-62px)] overflow-y-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">
        Contests
      </h2>
      {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

      {/* Active */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-white">
          🔥 Active Contests
        </h3>
        {contests.active.length > 0 ? (
          <div className="grid gap-4">
            {contests.active.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-dark-layer-2 rounded-lg shadow-md border border-gray-700"
              >
                <h4 className="text-lg font-bold">{c.name}</h4>
                <p className="text-gray-400">
                  📅 {new Date(c.startTime).toLocaleString()}
                </p>
                <p className="text-gray-400">⏳ {c.duration} min</p>
                <Link href={`/contests/${c.id}`}>
                  <button className="mt-2 px-4 py-2 bg-brand-orange text-white rounded hover:bg-orange-500">
                    Join Contest
                  </button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No active contests available.</p>
        )}
      </div>

      {/* Past */}
      <div>
        <h3 className="text-xl font-semibold mb-3 text-white">
          📜 Past Contests
        </h3>
        {contests.past.length > 0 ? (
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Start</th>
                <th className="p-2 text-left">Duration</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.past.map((c) => (
                <tr key={c.id} className="border-b border-gray-600">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">
                    {new Date(c.startTime).toLocaleString()}
                  </td>
                  <td className="p-2">{c.duration} min</td>
                  <td className="p-2">
                    <Link href={`/contests/${c.id}/leaderboard`}>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        View Leaderboard
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No past contests available.</p>
        )}
      </div>

      {isFaculty && (
        <div className="mt-6 text-center">
          <Link href="/contests/create">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              ➕ Create Contest
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contests;
