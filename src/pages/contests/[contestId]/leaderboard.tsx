"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { format } from "date-fns";

type Submission = {
  userId: string;
  problemId: string;
  contestId: string;
  language: string;
  status: string;
  timestamp: Timestamp;
};

type LeaderboardRow = {
  userId: string;
  solvedCount: number;
  submissions: Submission[];
  latestAcceptedAt: Timestamp;
};

const LeaderboardPage = () => {
  const { contestId } = useParams() as { contestId: string };
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [users, setUsers] = useState<{ [userId: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [currentUser] = useAuthState(auth);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      const q = query(collection(firestore, "contestSubmissions"), where("contestId", "==", contestId));
      const querySnapshot = await getDocs(q);

      const allSubs: Submission[] = [];
      querySnapshot.forEach((doc) => {
        allSubs.push(doc.data() as Submission);
      });

      setSubmissions(allSubs);
    };

    fetchSubmissions();
  }, [contestId]);

  useEffect(() => {
    if (submissions.length === 0) return;

    const userMap: { [key: string]: LeaderboardRow } = {};
    const userIdToName: { [key: string]: string } = {};

    const fetchUsernames = async (userIds: string[]) => {
      const uniqueIds = Array.from(new Set(userIds));
      const results: { [id: string]: string } = {};

      await Promise.all(
        uniqueIds.map(async (uid) => {
          const docRef = collection(firestore, "users");
          const snapshot = await getDocs(query(docRef, where("__name__", "==", uid)));
          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            results[uid] = data.username || "Anonymous";
          } else {
            results[uid] = "Anonymous";
          }
        })
      );

      return results;
    };

    const processData = async () => {
      const acceptedSubs = submissions.filter((s) => s.status === "Accepted");

      for (const sub of acceptedSubs) {
        if (!userMap[sub.userId]) {
          userMap[sub.userId] = {
            userId: sub.userId,
            solvedCount: 0,
            submissions: [],
            latestAcceptedAt: sub.timestamp,
          };
        }

        const existingProblems = userMap[sub.userId].submissions.map((s) => s.problemId);
        if (!existingProblems.includes(sub.problemId)) {
          userMap[sub.userId].solvedCount += 1;
          userMap[sub.userId].submissions.push(sub);

          const prevTime = userMap[sub.userId].latestAcceptedAt;
          if (sub.timestamp && (!prevTime || sub.timestamp.toMillis() > prevTime.toMillis())) {
            userMap[sub.userId].latestAcceptedAt = sub.timestamp;
          }
        }
      }

      const usernames = await fetchUsernames(Object.keys(userMap));
      setUsers(usernames);

      const rows = Object.values(userMap).sort((a, b) => {
        if (b.solvedCount === a.solvedCount) {
          return a.latestAcceptedAt.toMillis() - b.latestAcceptedAt.toMillis();
        }
        return b.solvedCount - a.solvedCount;
      });

      setLeaderboard(rows);
      setLoading(false);
    };

    processData();
  }, [submissions]);

  return (
    <div className="min-h-screen bg-dark-layer-1 p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">🏆 Contest Leaderboard</h1>

      {loading ? (
        <p>Loading leaderboard...</p>
      ) : leaderboard.length === 0 ? (
        <p>No one has solved any problems yet.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Username</th>
              <th className="py-2 px-4">Solved</th>
              <th className="py-2 px-4">Last Accepted</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row, index) => (
              <tr
                key={row.userId}
                className={`border-b border-gray-700 ${currentUser?.uid === row.userId ? "bg-dark-fill-3" : ""}`}
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{users[row.userId] || row.userId}</td>
                <td className="py-2 px-4">{row.solvedCount}</td>
                <td className="py-2 px-4">
                  {row.latestAcceptedAt ? format(row.latestAcceptedAt.toDate(), "PPpp") : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderboardPage;
