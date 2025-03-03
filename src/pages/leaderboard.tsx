import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

const Leaderboard = () => {
  interface Leader {
    id: string;
    rank: number;
    displayName?: string;
    solvedCount: number;
  }

  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [userRank, setUserRank] = useState<Leader | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const usersRef = collection(firestore, "users");
      const querySnapshot = await getDocs(usersRef);

      const leaderboardData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          displayName: doc.data().displayName || "Anonymous",
          solvedCount: doc.data().solvedProblems?.length || 0,
        }))
        .sort((a, b) => b.solvedCount - a.solvedCount)
        .slice(0, 10)
        .map((user, index) => ({ ...user, rank: index + 1 }));

      setLeaders(leaderboardData);
    };

    const fetchUserRank = async () => {
      if (!user) return;

      const usersRef = collection(firestore, "users");
      const querySnapshot = await getDocs(usersRef);

      let allUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName || "Anonymous",
        solvedCount: doc.data().solvedProblems?.length || 0,
      }));

      allUsers.sort((a, b) => b.solvedCount - a.solvedCount);

      const userData = allUsers.find((u) => u.id === user.uid);
      if (userData) {
        setUserRank({ ...userData, rank: allUsers.indexOf(userData) + 1 });
      }
    };

    fetchLeaderboard();
    fetchUserRank();
  }, [user]);

  return (
    <div className="flex bg-dark-layer-1 h-[calc(100vh-62px)] flex-col text-white px-20">
      <h2 className="text-3xl font-bold my-4 text-center">Leaderboard</h2>
      <table className="w-1/2 mx-auto">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left w-[20%]">Rank</th>
            <th className="p-2 text-left w-[50%]">User</th>
            <th className="p-2 text-left w-[30%]">Solved Problems</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user) => (
            <tr key={user.id} className="">
              <td className="p-2">{user.rank}</td>
              <td className="p-2">{user.displayName}</td>
              <td className="p-2">{user.solvedCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      {userRank && !leaders.some((leader) => leader.id === userRank?.id) && (
        <div className="mt-4 p-2 border-t">
          <h3 className="font-bold">Your Rank</h3>
          <p>#{userRank.rank}: {userRank.displayName} - {userRank.solvedCount} problems solved</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default Leaderboard;
