import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/Auth";
import Dialog from "./components/Dialog";
import { useLoading } from "./context/Loading";
import AdminPanel from "./pages/AdminPanel";
import { AlertProvider } from "./context/Alert";
import Alert from "./components/Alert";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Attendance from "./pages/Attendance";
import AdminRoute from "./components/AdminRoute";
import Lectures from "./pages/Lectures";
import { LecturesProvider } from "./context/lectures";
import GetClassName from "./pages/GetClassName";

function App() {
    let { loading } = useLoading();
    return (
        <>
            {/* container */}
            <div className=" bg-background min-h-screen items-start text-text w-full flex flex-col px-5 md:px-20">
                <AlertProvider>
                    <AuthProvider>
                        <LecturesProvider>
                            <Nav />
                            <div className="w-full min-h-[calc(100vh-130px)]">
                                <Routes>
                                    <Route path="/" element={<Login />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route
                                        path="/register"
                                        element={<Register />}
                                    />
                                    <Route
                                        path="/student/:id"
                                        element={
                                            <ProtectedRoute>
                                                <Profile />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/attendance"
                                        element={
                                            <ProtectedRoute>
                                                <GetClassName />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/attendance/:classNameInQr"
                                        element={
                                            <ProtectedRoute>
                                                <Attendance />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/:id"
                                        element={
                                            <ProtectedRoute>
                                                <AdminPanel />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin"
                                        element={
                                            <AdminRoute>
                                                <Login />
                                            </AdminRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/lectures"
                                        element={
                                            <ProtectedRoute>
                                                <Lectures />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                                {loading && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-background/60 z-50">
                                        <span className="loader" />
                                    </div>
                                )}
                            </div>
                            <Alert />
                            <Dialog />
                        </LecturesProvider>
                    </AuthProvider>
                </AlertProvider>
            </div>
        </>
    );
}

export default App;
