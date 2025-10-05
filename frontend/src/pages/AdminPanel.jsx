import axios from "axios";
import { useAuth } from "../context/Auth";
import { useLoading } from "../context/Loading";
import Cookies from "js-cookie";
import { useAlert } from "../context/Alert";

export default function AdminPanel() {
    const { user, setUser } = useAuth();
    let { loading } = useLoading();
    let { setAlert } = useAlert();

    const getRowColor = (status) => {
        switch (status) {
            case "present":
                return "bg-green-100 text-green-800";
            case "late":
                return "bg-yellow-100 text-yellow-800";
            case "suspicious":
                return "bg-orange-100 text-orange-800";
            case "outside":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // 🕒 Wait until data is ready
    if (loading || !user || !Array.isArray(user)) {
        return <div className="p-6">Loading user data...</div>;
    }
    async function updateStatus(id) {
        try {
            let res = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/attendance/${id}`,
                {},
                { headers: { token: Cookies.get("token") } }
            );
            setUser((prevUser) =>
                prevUser.map((attendance) =>
                    attendance._id === id ? res.data.data : attendance
                )
            );
            setAlert({
                visible: true,
                type: "success",
                message: res.data.msg,
            });
        } catch (err) {
            // console.log(err);
            setAlert({
                visible: true,
                type: "danger",
                message:
                    err.response?.data?.message ||
                    "Error update attendance status",
            });
        }
    }

    return (
        <div className="p-6 w-full">
            <button
                className="btn btn-accent"
                onClick={() => (window.location.href = "/admin/lectures")}
            >
                Lectures
            </button>
            <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
            <div className="overflow-x-auto shadow rounded-lg">
                <table className="min-w-full text-sm text-left border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Student Name</th>
                            <th className="px-4 py-2 border">Student Code</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Lecture</th>
                            <th className="px-4 py-2 border">Class</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Device ID</th>
                            <th className="px-4 py-2 border">Time</th>
                            <th className="px-4 py-2 border">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.map((a, index) => {
                            const student = a.studentId || {};
                            const lecture = a.lectureId || {};
                            return (
                                <tr
                                    key={a._id}
                                    className={`${getRowColor(
                                        a.status
                                    )} border-b transition`}
                                >
                                    <td className="px-4 py-2 border">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {student.name || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {student.studentCode || "-"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {student.email || "-"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {lecture.lectureName || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {lecture.className || "N/A"}
                                    </td>
                                    <td
                                        className="px-4 py-2 border font-semibold capitalize cursor-pointer hover:underline hover:opacity-50"
                                        onClick={() => updateStatus(a._id)}
                                    >
                                        {a.status}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {a.deviceId || "-"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {a.time
                                            ? new Date(a.time).toLocaleString()
                                            : "-"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {a.lat && a.long
                                            ? `${a.lat.toFixed(
                                                  5
                                              )}, ${a.long.toFixed(5)}`
                                            : "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
