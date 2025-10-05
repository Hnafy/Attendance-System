import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { useAlert } from "../context/Alert";

export default function Register() {
    let [input, setInput] = useState({
        name: "",
        studentCode: "",
        email: "",
        password: "",
        resetPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    // let nav = useNavigate();
    let { login } = useAuth();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    // console.log(baseUrl);
    let [accept, setAccept] = useState(false);
    let { setAlert } = useAlert();
    async function handleSubmit(e) {
        e.preventDefault();
        setAccept(true);
        // validation
        if (
            !input.name ||
            !input.email ||
            input.studentCode.length < 6 ||
            input.password.length < 6 ||
            input.password !== input.resetPassword
        ) {
            // console.log("invalid inputs");
            setAlert({
                visible: true,
                type: "danger",
                message: "invalid inputs",
            });
        } else {
            try {
                // upload user details
                let res = await axios.post(`${baseUrl}/students`, {
                    name: input.name,
                    studentCode: input.studentCode,
                    email: input.email,
                    password: input.password,
                });
                // console.log("✅ Registered:", res.data); // add alert

                // save token in cookie
                login(res.data.token, res.data.data.id);
                // navigate to user page
                // nav(`/student/${res.data.data.id}`);
                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true });

                setAccept(false);
            } catch (err) {
                // console.log(err);
                setAlert({
                    visible: true,
                    type: "danger",
                    message: err.response.data.msg,
                });
            }
        }
    }

    return (
        <>
            <div className="w-full min-h-[calc(100vh-130px)] flex justify-center items-center">
                <form className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-[var(--color-background)]">
                    {/* Title */}
                    <h1 className="text-[var(--color-text)] text-3xl mt-10 font-medium">
                        Register
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Please sign Up to continue
                    </p>

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
                            placeholder="User Name"
                            required
                            onChange={(e) => {
                                setInput({ ...input, name: e.target.value });
                            }}
                            value={input.name}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                    </div>
                    {input.name.length < 1 && accept ? (
                        <p className="text-error text-start">
                            User Name Is Required
                        </p>
                    ) : (
                        ""
                    )}
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
                            required
                            onChange={(e) => {
                                setInput({
                                    ...input,
                                    studentCode: e.target.value,
                                });
                            }}
                            value={input.studentCode}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                    </div>
                    {input.studentCode.length < 6 && accept ? (
                        <p className="text-error text-start">
                            student code is invalid
                        </p>
                    ) : (
                        ""
                    )}
                    {/* Email input */}
                    <div className="flex items-center w-full mt-4 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 bg-transparent">
                        <svg
                            width="16"
                            height="11"
                            viewBox="0 0 16 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                                fill="#6B7280"
                            ></path>
                        </svg>
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            onChange={(e) => {
                                setInput({ ...input, email: e.target.value });
                            }}
                            value={input.email}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                    </div>
                    {input.email.length < 1 && accept ? (
                        <p className="text-error text-start">
                            Email Is Required
                        </p>
                    ) : (
                        ""
                    )}

                    {/* Password input */}
                    <div className="flex items-center mt-4 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-3 gap-2 bg-transparent">
                        <svg
                            width="13"
                            height="17"
                            viewBox="0 0 13 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                fill="#6B7280"
                            ></path>
                        </svg>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            onChange={(e) =>
                                setInput({
                                    ...input,
                                    password: e.target.value,
                                })
                            }
                            value={input.password}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? (
                                <i className="fas fa-eye-slash cursor-pointer"></i>
                            ) : (
                                <i className="fas fa-eye cursor-pointer"></i>
                            )}
                        </button>
                    </div>
                    {input.password.length < 6 && accept && (
                        <p className="text-error text-start">
                            Password must be at least 8 characters
                        </p>
                    )}

                    {/* Confirm Password input */}
                    <div className="flex items-center mt-4 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-3 gap-2 bg-transparent">
                        <svg
                            width="13"
                            height="17"
                            viewBox="0 0 13 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                fill="#6B7280"
                            ></path>
                        </svg>
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm Password"
                            required
                            onChange={(e) =>
                                setInput({
                                    ...input,
                                    resetPassword: e.target.value,
                                })
                            }
                            value={input.resetPassword}
                            className="bg-transparent text-text placeholder-gray-400 outline-none text-sm w-full h-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {showConfirm ? (
                                <i className="fas fa-eye-slash cursor-pointer"></i>
                            ) : (
                                <i className="fas fa-eye cursor-pointer"></i>
                            )}
                        </button>
                    </div>
                    {input.password !== input.resetPassword && accept && (
                        <p className="text-error text-start">
                            Passwords must match
                        </p>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        onClick={(e) => handleSubmit(e)}
                        className="cursor-pointer mt-9 w-full h-11 rounded-full text-white bg-primary hover:opacity-90 transition-opacity"
                    >
                        Register
                    </button>

                    {/* Signup link */}
                    <p className="text-gray-500 text-sm mt-3 mb-11">
                        you have an account?
                        <Link className="text-primary" to="/login">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}
