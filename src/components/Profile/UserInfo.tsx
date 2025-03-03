import { useEffect, useState } from "react";
import { auth, firestore } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Image from "next/image";

const UserInfo = () => {
  const [user] = useAuthState(auth);
  const [solvedCount, setSolvedCount] = useState<number | null>(null);
  const [stats, setStats] = useState<{ [category: string]: number }>({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const solvedProblems = userData.solvedProblems || [];
          setSolvedCount(solvedProblems.length);

          // Fetch category information for solved problems
          const problemsRef = collection(firestore, "problems");
          const problemsSnapshot = await getDocs(problemsRef);
          const categoryCounts: { [category: string]: number } = {};

          problemsSnapshot.forEach((doc) => {
            const problemData = doc.data();
            if (solvedProblems.includes(doc.id)) {
              categoryCounts[problemData.category] = (categoryCounts[problemData.category] || 0) + 1;
            }
          });

          setStats(categoryCounts);
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="flex flex-col items-center">
      <Image src="/avatar.png" alt="User Avatar" width={100} height={100} className="rounded-full" />
      <h2 className="mt-4 text-xl font-bold">{user?.displayName || "User"}</h2>
      <p className="text-gray-400">{user?.email}</p>
      <p className="mt-4 text-lg font-semibold">Total Problems Solved: {solvedCount !== null ? solvedCount : "Loading..."}</p>
      <div className="mt-4 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Questions Solved Per Category</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Solved</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats).map(([category, count]) => (
              <tr key={category} className="border-b">
                <td className="p-2">{category}</td>
                <td className="p-2">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserInfo;
