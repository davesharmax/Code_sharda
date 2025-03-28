"use client";

import { useState } from "react";
import { firestore } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const CreateContest = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  // Form State
  const [contestData, setContestData] = useState({
    name: "",
    startTime: "",
    duration: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContestData({ ...contestData, [e.target.name]: e.target.value });
  };

  // Validate & Submit Contest
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!contestData.name || !contestData.startTime || !contestData.duration) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(Number(contestData.duration)) || Number(contestData.duration) <= 0) {
      setError("Duration must be a positive number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Check if user is faculty
      const usersRef = collection(firestore, "users");
      const userDoc = await getDocs(usersRef);
      const currentUser = userDoc.docs.find((doc) => doc.id === user?.uid);

      if (!currentUser || currentUser.data().role !== "faculty") {
        setError("You are not authorized to create a contest.");
        return;
      }

      // Add Contest to Firestore
      await addDoc(collection(firestore, "contests"), {
        name: contestData.name,
        startTime: new Date(contestData.startTime).toISOString(),
        duration: Number(contestData.duration),
        description: contestData.description,
        createdBy: user?.uid,
      });

      alert("Contest Created Successfully!");
      router.push("/contests"); // Redirect to contests page
    } catch (err) {
      setError("Error creating contest. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Prevent Non-Faculty Users from Accessing
  if (!user) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6 bg-dark-layer-2 h-[calc(100vh-62px)]">
        <div className="w-[50%] mx-auto">

        
      <h2 className="text-2xl text-white font-bold text-center mb-6">Create Contest</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white">Contest Name</label>
          <input
            type="text"
            name="name"
            value={contestData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-dark-fill-3 text-white border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-white">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={contestData.startTime}
            onChange={handleChange}
            className="w-full p-2 rounded bg-dark-fill-3 text-white border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-white">Duration (in minutes)</label>
          <input
            type="number"
            name="duration"
            value={contestData.duration}
            onChange={handleChange}
            className="w-full p-2 rounded bg-dark-fill-3 text-white border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-white">Description (Optional)</label>
          <textarea
            name="description"
            value={contestData.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-dark-fill-3 text-white border border-gray-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-brand-orange text-white py-2 rounded hover:bg-orange-500"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Contest"}
        </button>
      </form>
    </div>
    </div>
  );
};

export default CreateContest;
