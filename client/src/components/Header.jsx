import React from "react";
import obelix from "./../asset/obelix.png";
import "./../styles/Header.css";
import { Link } from "react-router-dom";

export default function Header({ onglet, setOnglet }){
    return (
        <header>
            <img src={obelix} alt="Obelix" className="obelix" />
            <h1><Link to="/" onClick={() => setOnglet("home")}>SWdle</Link></h1>
            <img src={obelix} alt="Obelix" className="obelix" />

            {
                onglet !== "home" &&
                <>
                    <h2>
                        {
                            onglet === "classic" ? "Classique" :
                            onglet === "skill" ? "Compétence" :
                            onglet === "pixel" ? "Pixelisé" : 
                            onglet === "home" ? "" : ""
                        }
                    </h2>
                    <img src={obelix} alt="Obelix" className="obelix" />
                </>
            }

        </header>
    )
}