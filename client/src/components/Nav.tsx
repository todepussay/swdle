import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CiSettings, CiLogout, CiLogin, CiDatabase } from "react-icons/ci";
import UserContext from '@/contexts/UserContext';
import '@styles/Nav.css';

import monster from "@assets/monster.png";
import skill from "@assets/skill.png";
import pixel from "@assets/pixel.png";

type NavProps = {
    onglet: string;
    setOnglet: React.Dispatch<React.SetStateAction<string>>;
}

function Nav({ onglet, setOnglet }: NavProps){

    const { logout, ifUserConnected, ifUserIsAdmin } = useContext(UserContext)!;
    const navigate = useNavigate();

    return (
        <nav>
            <h2>Sélectionnez votre mode de jeu</h2>
            <ul>
                <li>
                    <Link className={onglet === "classic" ? "active" : ""} to={"/classic"} onClick={() => setOnglet("classic")}>
                        <img src={monster} alt="Classic" />
                        <span>Classique</span>
                    </Link>
                </li>
                <li>
                    <Link className={onglet === "skill" ? "active" : ""} to={"/skill"} onClick={() => setOnglet("skill")}>
                        <img src={skill} alt="Skill" />
                        <span>Compétence</span>
                    </Link>
                </li>
                <li>
                    <Link className={onglet === "pixel" ? "active" : ""} to={"/pixel"} onClick={() => setOnglet("pixel")}>
                        <img src={pixel} alt="Pixel" />
                        <span>Pixelisé</span>
                    </Link>
                </li>
            </ul>

            <div className="tools">
                {
                    ifUserConnected() ? (
                        <Link className='tool' to="" onClick={() => {
                            logout();
                            setOnglet("home");
                            navigate("/");
                        }} >
                            <CiLogout />
                        </Link>
                    ) : (
                        <Link to={"/login"} onClick={() => setOnglet("login")} className="tool">
                            <CiLogin />
                        </Link>
                    )
                }

                <button className="tool">
                    <CiSettings />
                </button>
                {
                    ifUserIsAdmin() && (
                        <Link to={"/admin"} onClick={() => setOnglet("admin")} className="tool">
                            <CiDatabase />
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Nav;