import { useState, useEffect } from "react";
import axios from "axios";
import { useLoading } from "../context/Loading";
import { useAlert } from "../context/Alert";
import Cookies from "js-cookie";

export default function AttendanceButtons({ lectureId }) {
  const [active, setActive] = useState(false);
  let {loading,setLoading} = useLoading()
  let {setAlert} = useAlert()

  // ✅ Check session status when component loads
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/lectures/status/${lectureId}`,{ headers: { token: Cookies.get("token") } });
        setActive(res.data.active);
      } catch (err) {
        console.error(err);
      }
    };
    checkStatus();
  }, [lectureId]);

  const startAttendance = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/lectures/start/${lectureId}`,{},{ headers: { token: Cookies.get("token") } });
      setActive(true);
      setAlert("Attendance started!");
    } catch (err) {
      setAlert(err.response?.data?.message || "Error starting attendance");
    } finally {
      setLoading(false);
    }
  };

  const cancelAttendance = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/lectures/cancel/${lectureId}`,{},{ headers: { token: Cookies.get("token") } });
      setActive(false);
      setAlert("Attendance cancelled!");
    } catch (err) {
      setAlert(err.response?.data?.message || "Error cancelling attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      {!active ? (
        <button
          onClick={startAttendance}
          disabled={loading}
          className="btn btn-accent"
        >
          {loading ? "Starting..." : "Start Attendance"}
        </button>
      ) : (
        <button
          onClick={cancelAttendance}
          disabled={loading}
          className="btn btn-error"
        >
          {loading ? "Cancelling..." : "Cancel Attendance"}
        </button>
      )}
    </div>
  );
}
