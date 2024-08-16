import React from 'react';
import Nav from "@components/Nav";
import '@styles/Home.css';
import Width from "@services/Width";

function Home(){    

    const width = Width();

    return (
        <div className='Home'>
            {
                width > 430 ?
                <p>Sélectionnez un mode de jeu</p>
                :
                <Nav />
            }
        </div>
    )
}

export default Home;