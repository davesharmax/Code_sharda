import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

const SubmissionHistory = () => {
  const [user] = useAuthState(auth);
  interface Submission {
    id: string;
    problemId: string;
    status: string;
    language: string;
    timestamp: any;
  }

  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (user) {
      const fetchSubmissions = async () => {
        const submissionsRef = collection(firestore, "submissions");
        const q = query(submissionsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const submissionList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            problemId: data.problemId,
            status: data.status,
            language: data.language,
            timestamp: data.timestamp,
          };
        });

        setSubmissions(submissionList);
      };

      fetchSubmissions();
    }
  }, [user]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Past Submissions</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Problem</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Language</th>
            <th className="p-2 text-left">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="border-b">
              <td className="p-2">{submission.problemId}</td>
              <td className="p-2">{submission.status}</td>
              <td className="p-2">{submission.language}</td>
              <td className="p-2">{submission.timestamp?.toDate().toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionHistory;
