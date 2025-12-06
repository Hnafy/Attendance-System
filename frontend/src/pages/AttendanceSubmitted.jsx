export default function AttendanceSubmitted(){
  return(
    <div className="flex flex-col items-center justify-center bg-background px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-text">Attendance Submitted</h1>
        <p className="text-lg text-text mb-6">Thank you! Your attendance has been successfully recorded.</p>
        <img src="attendanceSubmitted.png" alt="Attendance Success" className="mx-auto mb-6 w-32 h-32"/>
        <a href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Return to Home
        </a>
      </div>
    </div>
  );
}