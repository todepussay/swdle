import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { UserProvider } from "@contexts/UserContext";

const AdminPanel = lazy(() => import("@pages/Admin/AdminPanel"));
const UserPage = lazy(() => import("@pages/User/UserPage"));

function App(){

    return (
        <UserProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/admin/*" element={<AdminPanel />} />
                    <Route path="*" element={<UserPage />} />
                </Routes>
            </Suspense>
        </UserProvider>
    )

}

export default App;