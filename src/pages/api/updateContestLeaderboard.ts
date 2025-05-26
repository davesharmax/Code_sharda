// pages/api/updateContestLeaderboard.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  runTransaction,
} from "firebase/firestore";

type LeaderboardEntry = {
  userId: string;
  score: number;
  timestamp: any; // Firestore Timestamp
  status: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { contestId } = req.body;
  if (!contestId) {
    return res.status(400).json({ error: "contestId is required" });
  }

  try {
    // Query all submissions for this contest with status "Accepted"
    const submissionsRef = collection(firestore, "submissions");
    const q = query(
      submissionsRef,
      where("contestId", "==", contestId),
      where("status", "==", "Accepted")
    );
    const querySnapshot = await getDocs(q);

    // Aggregate scores: each accepted submission gives 100 points.
    const scores: Record<string, number> = {};
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const userId = data.userId;
      scores[userId] = (scores[userId] || 0) + 100;
    });

    // Convert aggregated scores to an array of leaderboard entries.
    const entries: LeaderboardEntry[] = Object.keys(scores).map((userId) => ({
      userId,
      score: scores[userId],
      // For simplicity, we use the current time as the updated timestamp.
      timestamp: new Date(),
      status: "Accepted",
    }));

    // Write/update the leaderboard document for this contest.
    const leaderboardRef = doc(firestore, "contestLeaderboards", contestId);
    await runTransaction(firestore, async (transaction) => {
      transaction.set(leaderboardRef, { entries }, { merge: true });
    });

    return res.status(200).json({ message: "Leaderboard updated", entries });
  } catch (error: any) {
    console.error("Error updating contest leaderboard:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
