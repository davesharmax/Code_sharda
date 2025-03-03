import UserInfo from "@/components/Profile/UserInfo";
import CategoryStats from "@/components/Profile/DifficultyStats";
import SubmissionHistory from "@/components/Profile/SubmissionHistory";

const ProfilePage = () => {
  return (
    <div className="flex h-[calc(100vh-60px)] p-6 bg-dark-layer-2 text-white">
      {/* Left Sidebar - User Info */}
      <div className="w-1/3 h-full p-6 bg-dark-layer-1 rounded-lg shadow-md">
        <UserInfo />
      </div>

      {/* Right Section - Stats & Submissions */}
      <div className="flex flex-col w-2/3 h-full ml-6">
        {/* Category-wise Stats */}
        <div className="h-1/3 w-full p-6 bg-dark-layer-1 rounded-lg shadow-md">
          <CategoryStats />
        </div>

        {/* Past Submissions */}
        <div className="h-2/3 w-full mt-6 p-6 bg-dark-layer-1 rounded-lg shadow-md">
          <SubmissionHistory />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
