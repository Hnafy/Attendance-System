import { useState } from "react";
import { useDialog } from "../context/Dialog";
import axios from "axios";
import Cookies from "js-cookie";
import { useAlert } from "../context/Alert";
import { useLectures } from "../context/lectures";

export default function Dialog() {
    const [formData, setFormData] = useState({
        lectureName: "",
        className: "",
        startTime: "",
    });
    let { setDialog, dialog } = useDialog();
    let { mood, id } = useDialog();
    let { setLectures } = useLectures();
    let { setAlert } = useAlert();

    const handleChange = (e) => {
        // If changing startTime (from datetime-local input) convert the local
        // value (e.g. "2025-10-05T14:30") to an ISO UTC string so it can be
        // stored/sent to MongoDB consistently. For other fields just set raw.
        if (e.target.name === "startTime") {
            const localVal = e.target.value;
            setFormData({
                ...formData,
                startTime: localVal ? new Date(localVal).toISOString() : "",
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Helper to convert an ISO date string (stored/returned by backend/Mongo)
    // into the value format expected by <input type="datetime-local" /> which
    // is a local date/time string like "YYYY-MM-DDTHH:mm". We adjust for the
    // timezone offset so the displayed value is in the user's local region.
    const isoToLocalInput = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        // shift by timezone offset and then take ISO string to get local time
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        return local;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mood === "add") {
            try {
                let res = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/lectures`,
                    formData,
                    { headers: { token: Cookies.get("token") } }
                );
                setLectures((prevLectures) => [...prevLectures, res.data.data]);
                console.log(res.data);
                setAlert({
                    visible: true,
                    type: "success",
                    message: res.data.msg,
                });
                setDialog(false);
                setFormData({
                    lectureName: "",
                    className: "",
                    startTime: "",
                });
            } catch (err) {
                console.log(err);
                setAlert({
                    visible: true,
                    type: "danger",
                    message: err.response?.data?.message || "Error add lecture",
                });
            }
        } else if (mood === "update") {
            try {
                let res = await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/lectures/${id}`,
                    formData,
                    { headers: { token: Cookies.get("token") } }
                );
                setLectures((prevLectures) =>
                    prevLectures.map((lecture) =>
                        lecture._id === id ? res.data.data : lecture
                    )
                );
                setAlert({
                    visible: true,
                    type: "success",
                    message: res.data.msg,
                });
                setDialog(false);
                setFormData({
                    lectureName: "",
                    className: "",
                    startTime: "",
                });
            } catch (err) {
                console.log(err);
                setAlert({
                    visible: true,
                    type: "danger",
                    message:
                        err.response?.data?.message || "Error update lecture",
                });
            }
        }
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 ${
                dialog ? "visible" : "invisible"
            }`}
        >
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
                    dialog ? "opacity-40" : "opacity-0"
                }`}
            />
            {/* Dialog Content */}
            <div
                className={`bg-white rounded-xl shadow-lg w-full max-w-md p-6 transform transition-all duration-300 ease-in-out relative ${
                    dialog
                        ? "translate-y-0 opacity-100 scale-100"
                        : "translate-y-4 opacity-0 scale-95"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">
                    {mood == "update" ? "Update Lecture" : "Add Lecture"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Lecture Name
                        </label>
                        <input
                            type="text"
                            name="lectureName"
                            value={formData.lectureName}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Class Name
                        </label>
                        <input
                            type="text"
                            name="className"
                            value={formData.className}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Start Time
                        </label>
                                                <input
                                                        type="datetime-local"
                                                        name="startTime"
                                                        value={isoToLocalInput(formData.startTime)}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-300"
                                                />

                            
                    </div>

                    <div className="flex justify-end space-x-2 pt-3">
                        <button
                            type="button"
                            onClick={() => setDialog(false)}
                            className="cursor-pointer px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {mood == "update" ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
