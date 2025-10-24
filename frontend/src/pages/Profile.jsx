import { useAuth } from "../context/Auth";

export default function profile() {
    // Helper function to set row color by status
    const getRowColor = (status) => {
        switch (status) {
            case "present":
                return "bg-green-100 text-green-800"; // 🟢 present
            case "late":
                return "bg-yellow-100 text-yellow-800"; // 🟡 late
            case "suspicious":
                return "bg-orange-100 text-orange-800"; // 🟠 suspicious
            case "outside":
                return "bg-red-100 text-red-800"; // 🔴 outside
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let { user } = useAuth();
    console.log(user)
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
            <div className="overflow-x-auto shadow rounded-lg">
                <table className="min-w-full text-sm text-left border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Student</th>
                            <th className="px-4 py-2 border">Student Code</th>
                            <th className="px-4 py-2 border">Lecture Name</th>
                            <th className="px-4 py-2 border">Class Name</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Device ID</th>
                            <th className="px-4 py-2 border">Time</th>
                            <th className="px-4 py-2 border">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.attendances.map((a, index) => (
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
                                    {a.studentId.name}
                                </td>
                                <td className="px-4 py-2 border">
                                    {a.studentId.studentCode}
                                </td>
                                <td className="px-4 py-2 border">
                                    {a.lectureId?.lectureName || "N/A"}
                                </td>
                                <td className="px-4 py-2 border">
                                    {a.lectureId?.className || "N/A"}
                                </td>
                                <td className="px-4 py-2 border font-semibold capitalize">
                                    {a.status}
                                </td>
                                <td className="px-4 py-2 border">
                                    {a.deviceId || "-"}
                                </td>
                                <td className="px-4 py-2 border">
                                    {new Date(a.time).toLocaleString()}
                                </td>
                                <td className="px-4 py-2 border">
                                    {a.lat && a.long
                                            ? `${a.lat.toFixed(
                                                5
                                            )}, ${a.long.toFixed(5)}`
                                            : "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
