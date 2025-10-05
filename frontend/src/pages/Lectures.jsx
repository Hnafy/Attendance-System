import axios from "axios";
import { useEffect } from "react";
import { useDialog } from "../context/Dialog";
import { useLectures } from "../context/lectures";
import { useAlert } from "../context/Alert";
import Cookies from "js-cookie";
import { useAuth } from "../context/Auth";

export default function LectureTable() {
    let { setDialog, setMood, setId } = useDialog();
    let { lectures, setLectures } = useLectures();
    let { setAlert } = useAlert();
    let {admin} = useAuth()

    function onUpdate(id) {
        console.log("Update lecture with ID:", id);
        setDialog(true);
        setMood("update");
        setId(id);
    }
    async function onDelete(id) {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/lectures/${id}`,
                { headers: { token: Cookies.get("token") } }
            );
            console.log(res);
            setAlert({
                visible: true,
                type: "danger",  // Changed to success since deletion was successful
                message: res.data.msg,
            });
            setLectures((prevLectures) =>
                prevLectures.filter((lecture) => lecture._id !== id)
            );
        } catch (err) {
            console.error(err);
            setAlert({
                visible: true,
                type: "danger",
                message: err.response?.data?.message || "Error deleting lecture"
            });
        }
    }
    function addLecture() {
        setDialog(true);
        setMood("add");
    }
    useEffect(() => {
        async function fetchDate() {
            let res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/lectures`
            );
            setLectures(res.data);
        }
        fetchDate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="p-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Lectures List</h2>
            <button
                    className="btn btn-accent w-[200px]"
                    onClick={() => window.location.href = `/admin/${admin.id}`}
                >
                    Admin Panel
                </button>
          </div>

            <div className="overflow-x-auto shadow rounded-lg">
                <table className="min-w-full text-sm text-left border border-gray-200">
                    <thead className="bg-accent text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Lecture Name</th>
                            <th className="px-4 py-2 border">Class</th>
                            <th className="px-4 py-2 border">Start Time</th>
                            <th className="px-4 py-2 border">End Time</th>
                            <th className="px-4 py-2 border text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {lectures.map((lecture, index) => (
                            <tr
                                key={lecture._id}
                                className="border-b hover:bg-text/10 transition text-text"
                            >
                                <td className="px-4 py-2 border">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-2 border font-medium">
                                    {lecture.lectureName}
                                </td>
                                <td className="px-4 py-2 border">
                                    {lecture.className}
                                </td>
                                <td className="px-4 py-2 border">
                                    {new Date(
                                        lecture.startTime
                                    ).toLocaleString()}
                                </td>
                                <td className="px-4 py-2 border">
                                    {new Date(lecture.endTime).toLocaleString()}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                    <button
                                        onClick={() => onUpdate(lecture._id)}
                                        className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 transition"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => onDelete(lecture._id)}
                                        className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-3 py-1 rounded transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {lectures.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-4 text-gray-500"
                                >
                                    No lectures found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center">
                <button
                    className="btn btn-accent mt-10 w-[200px]"
                    onClick={() => addLecture()}
                >
                    Add Lecture
                </button>
            </div>
        </div>
    );
}
