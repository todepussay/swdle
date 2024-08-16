import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { UserProvider } from "@contexts/UserContext";

import { AuthGuard } from "@services/AuthGuard";
import AdminRouter from "@services/AdminRouter";
import PublicRouter from "@/pages/PublicRouter";

function App(){

    return (
        <UserProvider>
            <Routes>
                <Route path="/*" element={<PublicRouter />} />
                <Route path="/admin/*" element={
                    <AuthGuard>
                        <AdminRouter />
                    </AuthGuard>
                } />
            </Routes>
        </UserProvider>
    )

}

export default App;