import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useAlert } from "./Alert.jsx";
import { useLoading } from "./Loading.jsx";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState({
        name: "",
        email: "",
        studentCode: 0,
        isAdmin: false,
        attendances: [],
    });
    const [admin, setAdmin] = useState({});


    let { setAlert } = useAlert();
    let {setLoading} = useLoading()

    // check token on first load
    useEffect(() => {
        const initAuth = async () => {
            const token = Cookies.get("token");
            if (!token) return;

            try {
                setLoading(true)
                // verify token to get userId
                const verifyRes = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/students/verify`,
                    { headers: { token }, withCredentials: true }
                );

                setAdmin(verifyRes.data.user);
                const userDecoded = verifyRes.data;
                if (userDecoded.user.isAdmin) {
                    // fetch full user profile
                    const userRes = await axios.get(
                        `${
                            import.meta.env.VITE_BASE_URL
                        }/attendance/allStudents`,
                        { headers: { token }, withCredentials: true }
                    );
                    setUser(userRes.data);
                }else{
                    // fetch full user profile
                    const userRes = await axios.get(
                        `${
                            import.meta.env.VITE_BASE_URL
                        }/students/attendance?studentId=${userDecoded.user.id}`,
                        { headers: { token }, withCredentials: true }
                    );
                    setUser(userRes.data);
                }
            } catch (err) {
                Cookies.remove("token");
                console.error("Auth error:", err);
                setUser({
                    name: "",
                    email: "",
                    studentCode: 0,
                    isAdmin: false,
                    attendances: [],
                });
                setAdmin({}); // Clear admin state on error
            }finally {
                setLoading(false)
            }
        };

        initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    console.log(user);

    const login = async (token, userId) => {
        try {
            setLoading(true)
            // save token in cookie
            Cookies.set("token", token, {
                expires: 30, // 7 days
                path: "/", // available everywhere
                secure: true, // only on HTTPS (Vercel is HTTPS, so fine)
                sameSite: "strict", // adjust if you call API from another domain
            });
            
            // First verify the token to get user data
            const verifyRes = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/students/verify`,
                { headers: { token }, withCredentials: true }
            );
            setAdmin(verifyRes.data.user);

            // Check if the user is an admin from the verification response
            if (verifyRes.data.user.isAdmin) {
                const res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/attendance/allStudents`,
                    { headers: { token }, withCredentials: true }
                );
                setUser(res.data);
                setAlert({
                    visible: true,
                    type: "success",
                    message: "Admin login successfully",
                });
            } else {
                const res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/students/attendance?studentId=${userId}`,
                    { headers: { token }, withCredentials: true }
                );
                setUser(res.data);
                setAlert({
                    visible: true,
                    type: "success",
                    message: "User login successfully",
                });
            }
        } catch (err) {
            console.error("Login error:", err);
            setAlert({
                visible: true,
                type: "danger",
                message: "Login failed. Please try again.",
            });
        }finally { 
            setLoading(false)
        }
    };

    // const logout = () => {
    //     Cookies.remove("token");
    //     setUser({
    //         user: "",
    //         email: "",
    //         posts: [],
    //         profilePhoto: { avatar: null },
    //     });
    //     setAlert({
    //         visible: true,
    //         type: "danger",
    //         message: "User logout",
    //     });
    // };

    return (
        <AuthContext.Provider value={{ user, setUser, login,admin }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}
