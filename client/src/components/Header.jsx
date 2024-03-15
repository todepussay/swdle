import React from "react";
import obelix from "./../asset/obelix.png";
import "./../styles/Header.css";

export default function Header({ onglet }){
    return (
        <header>
            <img src={obelix} alt="Obelix" className="obelix" />
            <h1>SWdle</h1>
            <img src={obelix} alt="Obelix" className="obelix" />

            {
                onglet !== "home" &&
                <>
                    <h2>
                        {
                            onglet === "classic" ? "Classique" :
                            onglet === "skill" ? "Compétence" :
                            onglet === "pixel" ? "Pixelisé" : ""
                        }
                    </h2>
                    <img src={obelix} alt="Obelix" className="obelix" />
                </>
            }

        </header>
    )
}