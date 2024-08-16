import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "@components/PublicLayout";
import Home from "@pages/Home";
import Classic from "@pages/Classic";
import Login from "@pages/Login";
import Signin from "@pages/Signin";
import Error from "@pages/Error";

function PublicRouter(){
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="classic" element={<Classic />} />
                <Route path="login" element={<Login />} />
                <Route path="signin" element={<Signin />} />
                <Route path="*" element={<Error />} />
            </Route>
        </Routes>
    )
}

export default PublicRouter;