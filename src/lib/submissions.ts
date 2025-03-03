import { firestore } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

/**
 * Store a new submission in Firestore
 */
export const submitSolution = async (
  userId: string, 
  problemId: string, 
  code: string, 
  language: string, 
  status: string, 
  executionTime: number, 
  memoryUsed: number
) => {
  try {
    await addDoc(collection(firestore, "submissions"), {
      userId,
      problemId,
      code,
      language,
      status,
      executionTime,
      memoryUsed,
      submittedAt: serverTimestamp()
    });
    console.log("Submission stored successfully!");
  } catch (error) {
    console.error("Error storing submission:", error);
  }
};

/**
 * Fetch submissions for a specific user
 */
export const getUserSubmissions = async (userId: string) => {
  const submissionsRef = collection(firestore, "submissions");
  const q = query(submissionsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
