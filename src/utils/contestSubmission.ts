// utils/contestSubmission.ts
import {
    addDoc,
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    increment,
    arrayUnion,
  } from "firebase/firestore";
  import { firestore, auth } from "@/lib/firebase";
  
  export async function handleContestSubmission(params: {
    contestId: string;
    problemId: string;
    code: string;
    language: string;
    status: string;        // e.g. "accepted" or "wrong answer"
  }) {
    const { contestId, problemId, code, language, status } = params;
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
  
    // 1) Mirror into contestSubmissions
    await addDoc(collection(firestore, "contestSubmissions"), {
      contestId,
      userId: user.uid,
      problemId,
      code,
      language,
      status,
      timestamp: serverTimestamp(),
    });
  
    // 2) If accepted, bump leaderboard in a transaction
    if (status === "accepted") {
      const scoreRef = doc(
        firestore,
        "contestLeaderboards",
        contestId,
        "scores",
        user.uid
      );
  
      await runTransaction(firestore, async (tx) => {
        const snap = await tx.get(scoreRef);
        if (snap.exists()) {
          const data = snap.data() as { solvedProblems?: string[] };
          const solved: string[] = data.solvedProblems || [];
          if (!solved.includes(problemId)) {
            tx.update(scoreRef, {
              solvedProblems: arrayUnion(problemId),
              score: increment(100),
              lastSubmissionTime: serverTimestamp(),
            });
          }
        } else {
          // First accepted problem for this user
          tx.set(scoreRef, {
            userName: user.displayName || user.uid,
            solvedProblems: [problemId],
            score: 100,
            lastSubmissionTime: serverTimestamp(),
          });
        }
      });
    }
  }
  