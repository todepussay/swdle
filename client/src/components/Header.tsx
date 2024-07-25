import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/Header.css';

import obelix from "@assets/obelix.png";

type HeaderProps = {
    onglet: string;
    setOnglet: React.Dispatch<React.SetStateAction<string>>;
}

function Header({ onglet, setOnglet }: HeaderProps){
    return (
        <header>
            <img src={obelix} alt="Obelix 1" className="obelix" />
            <h1><Link to="/" onClick={() => setOnglet("home")}>SWdle</Link></h1>
            <img src={obelix} alt="Obelix 2" className="obelix" />

            {
                onglet !== "home" && 
                <>
                    <h2>
                        {
                            onglet === "classic" ? "Classique" :
                            onglet === "skill" ? "Compétence" :
                            onglet === "pixel" ? "Pixelisé" :
                            onglet === "login" ? "Connexion" :
                            onglet === "register" ? "Inscription" : ""
                        }
                    </h2>
                    <img src={obelix} alt="Obelix 3" className="obelix" />
                </>
            }
        </header>
    )
}

export default Header;