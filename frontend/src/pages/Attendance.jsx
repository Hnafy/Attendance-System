import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../context/Auth";
import { useAlert } from "../context/Alert";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/Loading";
import { useState } from "react";

function getDeviceId() {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
}

export default function Attendance() {
    const { user, setUser } = useAuth();
    let { setAlert } = useAlert();
    const [formData, setFormData] = useState({
        studentName: "",
        studentCode: "",
    });
    let nav = useNavigate();
    let { setLoading } = useLoading();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    async function submitAttendance() {
    try {
        setLoading(true);

        // Get user location
        async function getLocation() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) return reject("Geolocation not supported");
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve(pos.coords),
                    (err) => reject(err)
                );
            });
        }

        const className = window.location.pathname.split("/").pop();
        const deviceId = getDeviceId();
        let latitude = null;
        let longitude = null;

        try {
            const coords = await getLocation();
            latitude = coords.latitude;
            longitude = coords.longitude;
            console.log("Latitude:", latitude, "Longitude:", longitude);
        } catch (err) {
            console.error("Error getting location:", err);
        }

        // Prepare data
        let data = {
            deviceId,
            lat: latitude,
            long: longitude,
        };

        // Add student info depending on login state
        let url = `${import.meta.env.VITE_BASE_URL}/attendance/${className}`;
        if (user?.id) {
            // Logged-in student
            data.studentId = user.id;
        } else {
            // Guest student
            if (!formData.studentName || !formData.studentCode) {
                setAlert({
                    visible: true,
                    type: "danger",
                    message: "Please enter your name and student code",
                });
                setLoading(false);
                return;
            }
            data.studentName = formData.studentName;
            data.studentCode = formData.studentCode;
            url += "/guest"; // hit guest endpoint
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                token: Cookies.get("token") || "",
            },
        };

        // Submit attendance
        const res = await axios.post(url, data, config);

        setAlert({
            visible: true,
            type: "success",
            message: res.data.message,
        });

        console.log("✅ Attendance submitted:", res.data);

        // Update user context and navigate if logged-in
        if (user?.id) {
            setUser(res.data);
            nav(`/student/${user.id}`);
        }else {
            nav("/attendanceSubmitted");
        }

    } catch (err) {
        setAlert({
            visible: true,
            type: "danger",
            message: err.response?.data.message || err.message,
        });
    } finally {
        setLoading(false);
    }
}


    return (
        <>
            <div className="w-full flex justify-center mt-10">
                <div className="flex flex-col gap-5">
                    {!user.name && (
                        <>
                            <div className="flex flex-col gap-1">
                                {/* User input */}
                                <div className="flex items-center w-full mt-10 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 bg-transparent">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="h-4 w-4 opacity-70"
                                    >
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Student Name"
                                        name="studentName"
                                        required
                                        onChange={handleChange}
                                        value={formData.studentName}
                                        className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                                    />
                                </div>
                                {/* student code input */}
                                <div className="flex items-center w-full mt-5 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 bg-transparent">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="h-4 w-4 opacity-70"
                                    >
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                    </svg>
                                    <input
                                        type="number"
                                        placeholder="Student Code"
                                        name="studentCode"
                                        required
                                        onChange={handleChange}
                                        value={formData.studentCode}
                                        className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <button
                        disabled={
                            (user.name == "" )&&
                            (formData.studentName.length < 3 ||
                            formData.studentCode.length < 3)
                        }
                        className="btn btn-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:border-none"
                        onClick={() => submitAttendance()}
                    >
                        Submit Attendance
                    </button>
                </div>
            </div>
        </>
    );
}
