import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "@components/admin/AdminLayout";
import DashBoard from "@pages/Admin/DashBoard";
import DataManagment from "@pages/Admin/DataManagment";
import Users from "@pages/Admin/Users";
import History from "@pages/Admin/History";

function AdminRouter(){
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<DashBoard />} />
                <Route path="dashboard" element={<DashBoard />} />
                <Route path="families" element={<DataManagment onglet='families' title="Familles" add="Ajouter une famille" />} />
                <Route path="monsters" element={<DataManagment onglet='monsters' title='Monstres' add="Ajouter un monstre" />} />
                <Route path="skills" element={<DataManagment onglet='skills' title='Compétences' add="Ajouter une compétence" />} />
                <Route path="buffs" element={<DataManagment onglet='buffs' title='Renforcements' add="Ajouter un effet de renforcement" />} />
                <Route path="debuffs" element={<DataManagment onglet='debuffs' title='Nocifs' add="Ajouter un effet nocif" />} />
                <Route path="users" element={<Users />} />
                <Route path="history" element={<History />} />
            </Route>
        </Routes>
    )
}

export default AdminRouter;