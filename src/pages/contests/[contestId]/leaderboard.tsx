"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useParams } from "next/navigation";

interface LeaderboardEntry {
  userId: string;
  score: number;
  // add additional fields such as username if available
}

const Leaderboard = () => {
  const params = useParams() as { contestId: string };
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Assuming leaderboard entries are stored in a subcollection for each contest
        const leaderboardRef = collection(firestore, "contests", params.contestId, "leaderboard");
        // Order by score descending
        const leaderboardQuery = query(leaderboardRef, orderBy("score", "desc"));
        const querySnapshot = await getDocs(leaderboardQuery);
        const entries = querySnapshot.docs.map((doc) => ({ userId: doc.id, ...(doc.data() as LeaderboardEntry) }));
        setLeaderboard(entries);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [params.contestId]);

  return (
    <div className="px-48 p-6 bg-dark-layer-1 w-full min-h-screen text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Contest Leaderboard</h2>
      {leaderboard.length > 0 ? (
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry.userId} className="border-b border-gray-600">
                <td className="p-2">{entry.userId}</td>
                <td className="p-2">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">No leaderboard data available.</p>
      )}
    </div>
  );
};

export default Leaderboard;
