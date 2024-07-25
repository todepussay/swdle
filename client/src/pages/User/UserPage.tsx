import { useState, useEffect } from "react";
import Header from "@components/Header";
import Nav from "@components/Nav";
import Home from "@pages/User/Home";
import Classic from "@pages/User/Classic";
import Login from "@pages/User/Login";
import Signin from "@pages/User/Signin";
import corner from "@assets/corner.png";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Family from "@models/Family";
import '@styles/UserPage.css';

const apiUrl = import.meta.env.VITE_API_URL;

function UserPage(){

    const [onglet, setOnglet] = useState<string>('home');
    const [families, setFamilies] = useState<Family[]>([]);
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

        axios.get(`${apiUrl}/getAllMonsters`)
        .then((res) => {
            setFamilies(res.data);
        })

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

        // Ajout de l'écouteur d'événements
        window.addEventListener('resize', handleResize);
            
        // Nettoyage de l'écouteur d'événements
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [onglet]);

    return (
        <div className="App">
            <div className="render">

                <img src={corner} alt="Corner top left" className="corner" id="corner-top-left" />
                <img src={corner} alt="Corner top right" className="corner" id="corner-top-right" />
                <img src={corner} alt="Corner bottom right" className="corner" id="corner-bottom-right" />
                <img src={corner} alt="Corner bottom left" className="corner" id="corner-bottom-left" />

                <div className="content">
                    <Header onglet={onglet} setOnglet={setOnglet} />

                    {
                        width > 430 && 
                        <Nav onglet={onglet} setOnglet={setOnglet} />
                    }

                    <div className="game">
                        <Routes>
                            <Route path="/" element={<Home onglet={onglet} setOnglet={setOnglet} width={width} />} />
                            <Route path="/classic" element={<Classic families={families} width={width} />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signin" element={<Signin />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPage;