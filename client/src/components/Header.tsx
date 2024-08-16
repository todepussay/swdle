import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@styles/Header.css';

import obelix from "@assets/obelix.png";

function Header(){

    const location = useLocation();

    return (
        <header>
            <img src={obelix} alt="Obelix 1" className="obelix" />
            <h1><Link to="/">SWdle</Link></h1>
            <img src={obelix} alt="Obelix 2" className="obelix" />

            {
                location.pathname !== "/" && 
                <>
                    <h2>
                        {
                            location.pathname === "/classic" ? "Classique" :
                            location.pathname === "/skill" ? "Compétence" :
                            location.pathname === "/pixel" ? "Pixelisé" :
                            location.pathname === "/login" ? "Connexion" :
                            location.pathname === "/signin" ? "Inscription" : ""
                        }
                    </h2>
                    <img src={obelix} alt="Obelix 3" className="obelix" />
                </>
            }
        </header>
    )
}

export default Header;