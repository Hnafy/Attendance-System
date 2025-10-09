import axios from "axios";
import { useAuth } from "../context/Auth";
import { useLoading } from "../context/Loading";
import Cookies from "js-cookie";
import { useAlert } from "../context/Alert";
import { useState, useMemo } from "react";

export default function AdminPanel() {
    const { user, setUser } = useAuth();
    const { loading } = useLoading();
    const { setAlert } = useAlert();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

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

    // Always define useMemo (even if data not ready)
    const filteredRecords = useMemo(() => {
        if (!Array.isArray(user)) return [];
        return user.filter((a) => {
            const student = a.studentId || {};
            const lecture = a.lectureId || {};

            const matchesSearch =
                (student.name || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                String(student.studentCode || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (student.email || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (lecture.lectureName || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (lecture.className || "")
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || a.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [user, search, statusFilter]);

    async function updateStatus(id) {
        try {
            const res = await axios.put(
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
            setAlert({
                visible: true,
                type: "danger",
                message:
                    err.response?.data?.message ||
                    "Error updating attendance status",
            });
        }
    }

    if (loading || !Array.isArray(user)) {
        return <div className="p-6">Loading user data...</div>;
    }

    return (
        <div className="p-6 w-full">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <div className="flex gap-5">
                <button
                    className="btn btn-accent"
                    onClick={() => (window.location.href = "/admin/lectures")}
                >
                    Lectures
                </button>
                <button
                    className="btn btn-primary w-[120px]"
                    onClick={() => window.print()}
                >
                    Print
                </button>
                </div>

                <div className="no-print flex flex-wrap gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Search student, class, or lecture..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded w-[220px]"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border px-3 py-2 rounded bg-background text-text"
                    >
                        <option value="all">All Status</option>
                        <option value="present">Present</option>
                        <option value="late">Late</option>
                        <option value="suspicious">Suspicious</option>
                        <option value="outside">Outside</option>
                    </select>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>

            <div className="overflow-x-auto shadow rounded-lg">
                <table className="min-w-full text-sm text-left border border-gray-200 print-text">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs print-text">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Student Name</th>
                            <th className="px-4 py-2 border">Code</th>
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
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((a, index) => {
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
                                                ? new Date(
                                                      a.time
                                                  ).toLocaleString()
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
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan="10"
                                    className="text-center py-4 text-gray-500"
                                >
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
