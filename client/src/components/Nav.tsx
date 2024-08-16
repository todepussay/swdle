import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CiSettings, CiLogout, CiLogin, CiDatabase } from "react-icons/ci";
import UserContext from '@/contexts/UserContext';
import '@styles/Nav.css';

import monster from "@assets/monster.png";
import skill from "@assets/skill.png";
import pixel from "@assets/pixel.png";

function Nav(){

    const { logout, ifUserConnected, ifUserIsAdmin } = useContext(UserContext)!;
    const navigate = useNavigate();

    return (
        <nav>
            <h2>Sélectionnez votre mode de jeu</h2>
            <ul>
                <li>
                    <Link to={"/classic"}>
                        <img src={monster} alt="Classic" />
                        <span>Classique</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/skill"}>
                        <img src={skill} alt="Skill" />
                        <span>Compétence</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/pixel"}>
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
                            navigate("/");
                        }} >
                            <CiLogout />
                        </Link>
                    ) : (
                        <Link to={"/login"} className="tool">
                            <CiLogin />
                        </Link>
                    )
                }

                <button className="tool">
                    <CiSettings />
                </button>
                {
                    ifUserIsAdmin() && (
                        <Link to={"/admin"} className="tool">
                            <CiDatabase />
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Nav;