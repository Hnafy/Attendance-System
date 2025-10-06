import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../context/Auth";
import { useAlert } from "../context/Alert";
import { useNavigate } from "react-router-dom";

function getDeviceId() {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
}

export default function Attendance() {
    const { user } = useAuth();
    let {setAlert} = useAlert()
    let nav = useNavigate()

    async function submitAttendance() {
        try {
            let longitude = null;
let latitude = null;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      console.log("Latitude:", latitude, "Longitude:", longitude);
    },
    (error) => {
      console.error("Error getting location:", error.message);
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}
            let token = Cookies.get("token");
            let className = window.location.pathname.split("/").pop();
            // console.log(className);
            let deviceId = getDeviceId();
            let studentId = user.id;
            let data = {
                deviceId,
                studentId,
                long: longitude,
                lat: latitude,
            };

            const config = {
                headers: {
                    token,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };

            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/attendance/${className}`,
                data,
                config
            );

            // console.log("✅ Attendance submitted:", res.data);
            setAlert({
                    visible: true,
                    type: "success",
                    message: res.data.message,
                });
                // navigate to user page
            nav(`/student/${user.id}`);
        } catch (err) {
            // console.log(
            //     err.response?.data.message
            // );
            setAlert({
                    visible: true,
                    type: "danger",
                    message: err.response?.data.message,
                });
        }
    }
    return (
        <>
            <div className="w-full flex justify-center mt-10">
                <button
                    className="btn btn-accent"
                    onClick={() => submitAttendance()}
                >
                    Submit Attendance
                </button>
            </div>
        </>
    );
}
