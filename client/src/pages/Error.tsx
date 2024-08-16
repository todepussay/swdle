import React from 'react';
import "@styles/Error.css";
import { Link } from 'react-router-dom';

function Error(){    
    return (
        <div className='Error'>
            <p>Page introuvable</p>
            <Link className='btn' to={"/"}>Retour au menu</Link>
        </div>
    )
}

export default Error;