import React from 'react';
import Nav from "@components/Nav";
import '@styles/Home.css';

type HomeProps = {
    onglet: string;
    setOnglet: React.Dispatch<React.SetStateAction<string>>;
    width: number;
}

function Home({ onglet, setOnglet, width }: HomeProps){    
    return (
        <div className='Home'>
            {
                width > 430 ?
                <p>Sélectionnez un mode de jeu</p>
                :
                <Nav onglet={onglet} setOnglet={setOnglet} />
            }
        </div>
    )
}

export default Home;