import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import corner from "@assets/corner.png";
import Header from "@components/Header";
import Nav from "@components/Nav";
import "@styles/PublicLayout.css";

const apiUrl = import.meta.env.VITE_API_URL


function PublicLayout(){
    
    const [width, setWidth] = useState<number>(window.innerWidth);
    const navigate = useNavigate();

    // Fonction pour comparer les dates
    function comparerDates(date1: Date, date2: Date){
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
    }

    useEffect(() => {

        function handleResize(){
            setWidth(window.innerWidth);
        }

        // Ajout de l'écouteur d'événements
        window.addEventListener('resize', handleResize);
            
        if(Cookies.get("classic")){
            
            let dateClassic : Date = new Date(JSON.parse(Cookies.get("classic")!).date);
            
            axios.get(`${apiUrl}/verifyDaily`)
            .then((res) => {
                if(!comparerDates(dateClassic, new Date(res.data))){
                    Cookies.remove("classic");

                    navigate("/");
                }
            })
        }

        // Nettoyage de l'écouteur d'événements
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    return (
        <div className="App">
            <div className="render">
    
                <img src={corner} alt="Corner top left" className="corner" id="corner-top-left" />
                <img src={corner} alt="Corner top right" className="corner" id="corner-top-right" />
                <img src={corner} alt="Corner bottom right" className="corner" id="corner-bottom-right" />
                <img src={corner} alt="Corner bottom left" className="corner" id="corner-bottom-left" />

                <div className="content">
                    
                    <Header />

                    {
                        width > 430 &&
                        <Nav />
                    }

                    <div className="game">
                        <Outlet />  
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicLayout;