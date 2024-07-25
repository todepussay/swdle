import React from 'react';
import { Link } from 'react-router-dom';
import "@styles/Admin/NavFooter.css";

function NavFooter(){
    return (
        <footer>
            <Link to={"/"}>Retour</Link>
        </footer>
    )
}

export default NavFooter;