import { useEffect, useState } from "react"
import { firestore } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"

const ReportDashboard = () => {
  const [user] = useAuthState(auth)
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalSubmissions, setTotalSubmissions] = useState(0)
  const [averageSolved, setAverageSolved] = useState(0)
  const [mostActiveStudent, setMostActiveStudent] = useState<string | null>(
    null
  )
  const [studentPerformance, setStudentPerformance] = useState<any[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([])
  const [userMap, setUserMap] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchReportData = async () => {
      const usersRef = collection(firestore, "users")
      const submissionsRef = collection(firestore, "submissions")

      const usersSnapshot = await getDocs(usersRef)
      const submissionsSnapshot = await getDocs(submissionsRef)

      const students = usersSnapshot.docs.filter(
        (doc) => doc.data().role !== "faculty"
      )
      setTotalStudents(students.length)

      const userMap: Record<string, string> = {}
      students.forEach((student) => {
        userMap[student.id] = student.data().displayName || "Anonymous"
      })
      setUserMap(userMap)

      const submissions = submissionsSnapshot.docs.map((doc) => doc.data())
      setTotalSubmissions(submissions.length)

      let totalSolved = 0
      let activeStudent = ""
      let maxSubmissions = 0
      let performanceData = students.map((student) => {
        const data = student.data()
        const solvedCount = data.solvedProblems?.length || 0
        totalSolved += solvedCount
        const userSubmissions = submissions.filter(
          (sub) => sub.userId === student.id
        ).length
        if (userSubmissions > maxSubmissions) {
          maxSubmissions = userSubmissions
          activeStudent = data.displayName || "Anonymous"
        }
        return {
          id: student.id,
          displayName: data.displayName || "Anonymous",
          solvedCount,
        }
      })

      setAverageSolved(totalStudents ? totalSolved / totalStudents : 0)
      setMostActiveStudent(activeStudent)
      setStudentPerformance(performanceData)

      const sortedSubmissions = submissions
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10)
      setRecentSubmissions(sortedSubmissions)
    }

    fetchReportData()
  }, [])

  return (
    <div className="p-6 bg-dark-layer-2 text-white min-h-[calc(100vh-62px)]">
      <div className="w-[90%] mx-auto">
        {/* <h2 className="text-xl font-bold mb-4">Faculty Dashboard</h2> */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-4 border rounded ">
            <p className="text-2xl uppercase font-bold"> Total Students</p>
            <p className="text-lg">{totalStudents}</p>
          </div>
          <div className="p-4 border rounded ">
            <p className="text-2xl uppercase font-bold"> Total Submissions</p>
            <p className="text-lg">{totalSubmissions}</p>
          </div>
          {/* <div className="p-4 border rounded ">
            Average Solved Problems per Student: {averageSolved.toFixed(2)}
          </div> */}
          <div className="p-4 border rounded ">
            <p className="text-2xl uppercase font-bold"> Most Active Student</p>
            <p className="text-lg">{mostActiveStudent || "N/A"}</p>
          </div>
        </div>
        <div className="flex gap-10">
          <div className="w-[30%]">
            <h3 className="font-bold mb-2 text-2x">Student Performance</h3>
            <table className="w-full border">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Student</th>
                  <th className="p-2">Solved Problems</th>
                </tr>
              </thead>
              <tbody>
                {studentPerformance.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="p-2 text-center">{student.displayName}</td>
                    <td className="p-2 text-center">{student.solvedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-[70%]">
            <h3 className="font-bold mb-2 text-2xl">Recent Submissions</h3>
            <table className="w-full border">
              <thead>
                <tr className="border-b">
                  <th className="p-2">User</th>
                  <th className="p-2">Problem</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((submission, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 text-center">
                      {userMap[submission.userId] || "Unknown"}
                    </td>
                    <td className="p-2 text-center">{submission.problemId}</td>
                    <td className="p-2 text-center">{submission.status}</td>
                    <td className="p-2 text-center">
                      {new Date(
                        submission.timestamp?.seconds * 1000
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportDashboard
