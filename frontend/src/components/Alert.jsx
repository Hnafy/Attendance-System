import { useAlert } from "../context/Alert";
import { useEffect } from "react";

const alertStyles = {
  info: {
    text: "text-blue-800 dark:text-blue-400",
    border: "border-blue-300 dark:border-blue-800",
    bg: "bg-blue-50 dark:bg-gray-800",
    button:
      "bg-blue-50 text-blue-500 hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700",
  },
  danger: {
    text: "text-red-800 dark:text-red-400",
    border: "border-red-300 dark:border-red-800",
    bg: "bg-red-50 dark:bg-gray-800",
    button:
      "bg-red-50 text-red-500 hover:bg-red-200 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700",
  },
  success: {
    text: "text-green-800 dark:text-green-400",
    border: "border-green-300 dark:border-green-800",
    bg: "bg-green-50 dark:bg-gray-800",
    button:
      "bg-green-50 text-green-500 hover:bg-green-200 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700",
  },
  warning: {
    text: "text-yellow-800 dark:text-yellow-300",
    border: "border-yellow-300 dark:border-yellow-800",
    bg: "bg-yellow-50 dark:bg-gray-800",
    button:
      "bg-yellow-50 text-yellow-500 hover:bg-yellow-200 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700",
  },
  dark: {
    text: "text-gray-800 dark:text-gray-300",
    border: "border-gray-300 dark:border-gray-600",
    bg: "bg-gray-50 dark:bg-gray-800",
    button:
      "bg-gray-50 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
  },
};

export default function Alert() {
  const { alert, setAlert } = useAlert();
  const style = alertStyles[alert.type] || alertStyles.info;

  // Auto-hide after 3s
  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.visible, setAlert]);

  return (
    <div
      className={`
        fixed bottom-6 right-6 
        max-w-sm w-auto
        transition-all duration-500 ease-in-out
        ${alert.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}
      `}
    >
      <div
        className={`flex items-center p-4 border-t-4 rounded-lg shadow-lg ${style.text} ${style.border} ${style.bg}`}
        role="alert"
      >
        {/* Icon */}
        <svg
          className="shrink-0 w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>

        {/* Message */}
        <div className="ms-3 text-sm font-medium">{alert.message}</div>

        {/* Close button */}
        <button
          type="button"
          onClick={() => setAlert((prev) => ({ ...prev, visible: false }))}
          className={`cursor-pointer ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 ${style.button}`}
          aria-label="Close"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
