import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { UserProvider } from "@contexts/UserContext";

import { AuthGuard } from "@services/AuthGuard";
const AdminRouter = lazy(() => import("@services/AdminRouter"));
const PublicRouter = lazy(() => import("@services/PublicRouter"));

function App(){

    const location = useLocation();

    const isAdminRoute = location.pathname.startsWith("/admin");

    useEffect(() => {
        let styles = document.querySelectorAll("style");
        styles.forEach((style) => {
            style.remove();
        })
    }, [isAdminRoute])

    return (
        <UserProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {
                        isAdminRoute ? (
                            <Route path="/admin/*" element={
                                <AuthGuard>
                                    <AdminRouter />
                                </AuthGuard>
                            } />
                        ) : (
                            <Route path="/*" element={<PublicRouter />} />
                        )
                    }
                </Routes>
            </Suspense>
        </UserProvider>
    )
}

export default App;