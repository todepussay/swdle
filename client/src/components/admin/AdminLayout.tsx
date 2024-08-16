import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNav from "@components/admin/AdminNav";
import "@styles/Admin/AdminLayout.css";

function AdminLayout(){
    return (
        <div className="AdminLayout">

            <ToastContainer />

            <AdminNav />

            <div className="panel">
                <Outlet />
            </div>

        </div>
    )
}

export default AdminLayout;