import "@styles/Admin/AdminNav.css";
import NavList from "@components/admin/NavList";
import NavItem from "@components/admin/NavItem";
import NavFooter from "@components/admin/NavFooter";
import { FaHome, FaDatabase, FaUsers, FaHistory } from "react-icons/fa";

function AdminNav(){
    return (
        <nav>
            <h1>SWdle - Dashboard</h1>
            
            <div className="list">
                <NavList title="Dashboard" icon={<FaHome />} name="dashboard" />
                <NavList title="Gestion des données" icon={<FaDatabase />}>
                    <NavItem title="Famille" name="families" />
                    <NavItem title="Monstre" name="monsters" />
                    <NavItem title="Compétence" name="skills" />
                    <NavItem title="Renforcement" name="buffs" />
                    <NavItem title="Nocif" name="debuffs" />
                </NavList>
                <NavList title="Utilisateur" icon={<FaUsers />} name="users" />
                <NavList title="Historique" icon={<FaHistory />} name="history" />
            </div>
            
            <NavFooter />
        </nav>
    )
}

export default AdminNav;