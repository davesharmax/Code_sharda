// import { useEffect, useState } from "react";
// import { firestore } from "@/lib/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "@/lib/firebase";
// import Link from "next/link";

// interface Contest {
//   id: string;
//   name: string;
//   startTime: string;
//   duration: number;
// }

// const Contests = () => {
//   const [activeContests, setActiveContests] = useState<Contest[]>([]);
//   const [pastContests, setPastContests] = useState<Contest[]>([]);
//   const [user] = useAuthState(auth);
//   const [isFaculty, setIsFaculty] = useState(false);

//   useEffect(() => {
//     const fetchContests = async () => {
//       const contestsRef = collection(firestore, "contests");
//       const querySnapshot = await getDocs(contestsRef);
//       const now = new Date();

//       const contests = querySnapshot.docs.map((doc) => {
//         const { id, ...data } = doc.data() as Contest;
//         return { id: doc.id, ...data };
//       });
      
//       setActiveContests(contests.filter((contest) => new Date(contest.startTime) > now));
//       setPastContests(contests.filter((contest) => new Date(contest.startTime) <= now));
//     };

//     const fetchUserRole = async () => {
//       if (user) {
//         const usersRef = collection(firestore, "users");
//         const querySnapshot = await getDocs(usersRef);
//         const userData = querySnapshot.docs.find((doc) => doc.id === user.uid)?.data();
//         if (userData?.role === "faculty") {
//           setIsFaculty(true);
//         }
//       }
//     };

//     fetchContests();
//     fetchUserRole();
//   }, [user]);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Active Contests</h2>
//       <ul>
//         {activeContests.map((contest) => (
//           <li key={contest.id} className="border-b p-2">
//             <Link href={`/contests/${contest.id}`} className="text-blue-500">
//               {contest.name}
//             </Link> - Starts at: {new Date(contest.startTime).toLocaleString()}, Duration: {contest.duration} mins
//           </li>
//         ))}
//       </ul>

//       <h2 className="text-xl font-bold mt-6 mb-4">Past Contests</h2>
//       <ul>
//         {pastContests.map((contest) => (
//           <li key={contest.id} className="border-b p-2">
//             <Link href={`/contests/${contest.id}`} className="text-blue-500">
//               {contest.name}
//             </Link>
//           </li>
//         ))}
//       </ul>

//       {isFaculty && (
//         <div className="mt-6">
//           <Link href="/contests/create" className="bg-blue-500 text-white py-2 px-4 rounded">
//             Create Contest
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Contests;

"use client";

import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

// Define the Contest interface
interface Contest {
  id: string;
  name: string;
  startTime: string;
  duration: number;
}

const Contests = () => {
  const [user] = useAuthState(auth);
  const [contests, setContests] = useState([]);
  const [isFaculty, setIsFaculty] = useState(false);

  useEffect(() => {
    const fetchContests = async () => {
      const contestsRef = collection(firestore, "contests");
      const querySnapshot = await getDocs(contestsRef);

      const contestsData = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Contest),
        id: doc.id,
      }));

      const currentTime = new Date();
      const activeContests = contestsData.filter(
        (contest) => new Date(contest.startTime) > currentTime
      );
      const pastContests = contestsData.filter(
        (contest) => new Date(contest.startTime) <= currentTime
      );

      setContests({ active: activeContests, past: pastContests });
    };

    const checkUserRole = async () => {
      if (user) {
        const usersRef = collection(firestore, "users");
        const querySnapshot = await getDocs(usersRef);
        const currentUser = querySnapshot.docs.find((doc) => doc.id === user.uid);
        if (currentUser && currentUser.data().role === "faculty") {
          setIsFaculty(true);
        }
      }
    };

    fetchContests();
    checkUserRole();
  }, [user]);

  return (
    <div className="px-48 p-6 bg-dark-layer-1 w-full h-[calc(100vh-62px)] overflow-y-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">Contests</h2>

      {/* Active Contests Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-white">🔥 Active Contests</h3>
        {contests.active && contests.active.length > 0 ? (
          <div className="grid gap-4">
            {contests.active.map((contest) => (
              <div key={contest.id} className="p-4 bg-dark-layer-2 rounded-lg shadow-md border border-gray-700">
                <h4 className="text-lg font-bold">{contest.name}</h4>
                <p className="text-gray-400">
                  📅 Start: {new Date(contest.startTime).toLocaleString()}
                </p>
                <p className="text-gray-400">⏳ Duration: {contest.duration} min</p>
                <Link href={`/contests/${contest.id}`}>
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

      {/* Past Contests Section */}
      <div>
        <h3 className="text-xl font-semibold mb-3 text-white">📜 Past Contests</h3>
        {contests.past && contests.past.length > 0 ? (
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-2 text-left">Contest Name</th>
                <th className="p-2 text-left">Start Time</th>
                <th className="p-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {contests.past.map((contest) => (
                <tr key={contest.id} className="border-b border-gray-600">
                  <td className="p-2">{contest.name}</td>
                  <td className="p-2">{new Date(contest.startTime).toLocaleString()}</td>
                  <td className="p-2">{contest.duration} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No past contests available.</p>
        )}
      </div>

      {/* Faculty Create Contest Button */}
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

