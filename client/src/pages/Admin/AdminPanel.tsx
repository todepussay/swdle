import React, { useContext, useEffect } from 'react';
import AdminNav from '@components/admin/AdminNav';
import '@styles/Admin/AdminPanel.css';
import DashBoard from "@pages/Admin/DashBoard";
import DataManagment from "@pages/Admin/DataManagment";
import Users from "@pages/Admin/Users";
import History from "@pages/Admin/History";
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserContext from '@/contexts/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminPanel(){

    const { ifUserIsAdmin } = useContext(UserContext)!;
    const navigate = useNavigate();

    useEffect(() => {
        if(!ifUserIsAdmin()){
            navigate("/");
        }
    }, [])

    return (
        <div className='AdminPanel'>

            <ToastContainer />

            <AdminNav />

            <div className="panel">

                <Routes>
                    <Route path="/" element={<DashBoard />} />
                    <Route path="/dashboard" element={<DashBoard />} />
                    <Route path="/families" element={<DataManagment onglet='families' title="Familles" add="Ajouter une famille" />} />
                    <Route path="/monsters" element={<DataManagment onglet='monsters' title='Monstres' add="Ajouter un monstre" />} />
                    <Route path="/skills" element={<DataManagment onglet='skills' title='Compétences' add="Ajouter une compétence" />} />
                    <Route path="/buffs" element={<DataManagment onglet='buffs' title='Renforcements' add="Ajouter un effet de renforcement" />} />
                    <Route path="/debuffs" element={<DataManagment onglet='debuffs' title='Nocifs' add="Ajouter un effet nocif" />} />
                </Routes>

                {/* {
                    onglet === "dashboard" ? <DashBoard /> :
                    (onglet === "family" || onglet === "monster" || onglet === "skill" || onglet === "buff" || onglet === "nerf") ? (
                        <DataManagment onglet={onglet} title={title[onglet]} />
                    ) :
                    onglet === "users" ? <Users /> :
                    onglet === "history" ? <History /> :
                    null
                } */}
            </div>
        </div>
    )
}

export default AdminPanel;