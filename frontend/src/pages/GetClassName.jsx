import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GetClassName() {
  let [className, setClassName] = useState("");
  let nav = useNavigate();

  return(
    <>
    <div className="flex flex-col gap-5 items-center justify-center h-[calc(100vh-130px)]">
      <input onChange={(e)=>setClassName(e.target.value)} value={className} className="border px-3 py-2 rounded w-[220px]" type="text" placeholder="Enter your ClassName" required/>
      <button onClick={()=>nav(`/attendance/${className}`)} className="btn btn-accent">Go to take Attendance</button>
    </div>
    </>
  )
}