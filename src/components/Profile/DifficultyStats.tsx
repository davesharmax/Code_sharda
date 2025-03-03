import { useEffect, useState } from "react";
import { auth, firestore } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const DifficultyStats = () => {
  const [user] = useAuthState(auth);
  const [difficultyStats, setDifficultyStats] = useState({ Easy: 0, Medium: 0, Hard: 0 });

  useEffect(() => {
    const fetchDifficultyStats = async () => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const solvedProblems = userData.solvedProblems || [];

          // Fetch difficulty levels for solved problems
          const problemsRef = collection(firestore, "problems");
          const problemsSnapshot = await getDocs(problemsRef);
          const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };

          problemsSnapshot.forEach((doc) => {
            const problemData = doc.data() as { difficulty: 'Easy' | 'Medium' | 'Hard' };
            if (solvedProblems.includes(doc.id)) {
              difficultyCounts[problemData.difficulty] = (difficultyCounts[problemData.difficulty] || 0) + 1;
            }
          });

          setDifficultyStats(difficultyCounts);
        }
      }
    };

    fetchDifficultyStats();
  }, [user]);

  return (
    <div className=" w-full max-w-md">
      <h2 className=" font-bold mb-2">Questions Solved Per Difficulty</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-1 text-left">Difficulty</th>
            <th className="p-1 text-left">Solved</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(difficultyStats).map(([difficulty, count]) => (
            <tr key={difficulty} className="">
              <td className="p-2">{difficulty}</td>
              <td className="p-2">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DifficultyStats;
