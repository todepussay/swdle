import React from 'react';
import "../styles/Home.css";
import Nav from '../components/Nav';

export default function Home({ onglet, setOnglet, width }) {
    return (
        <div className="Home">
            {
                width > 430 ? 
                <p>Vous devez selectionner un mode de jeu</p>
                :
                <Nav onglet={onglet} setOnglet={setOnglet} />
            }
        </div>
    )
}