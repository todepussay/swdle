import { Route, Routes } from "react-router-dom";
import "./App.css";
import React, { useEffect } from "react";
import Header from "./components/Header";
import Nav from "./components/Nav";
import corner from "./asset/corner.png";
import Home from "./pages/Home";
import Classic from "./pages/Classic";
import Skill from "./pages/Skill";
import Pixel from "./pages/Pixel";
import axios from "axios";
import Cookies from "js-cookie";

function App() {
  
  const [onglet, setOnglet] = React.useState("classic");
  const [families, setFamilies] = React.useState([]);

  // Fonction pour comparer les dates
  function comparerDates(dateA, dateB) {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    );
  }

  useEffect(() => {

    axios.get(`${process.env.REACT_APP_URL_API}/getAllMonsters`)
    .then((res) => {
        setFamilies(res.data);
    })

    if(Cookies.get("classic")){
      let dateClassic = new Date(JSON.parse(Cookies.get("classic")).date);
      axios.get(`${process.env.REACT_APP_URL_API}/verifyDaily`)
      .then((res) => {
        if(!comparerDates(new Date(res.data), new Date(dateClassic))){
          Cookies.remove("classic");

          window.location.pathname = "/";
        }
      })
    }
    
    if(onglet === "home" && window.location.pathname !== "/"){
      window.location.pathname = "/";
    }
  }, []);

  return (
    <div className="App">

      <img src={corner} alt="Corner top left" className="corner" id="corner-top-left" />
      <img src={corner} alt="Corner top right" className="corner" id="corner-top-right" />
      <img src={corner} alt="Corner bottom right" className="corner" id="corner-bottom-right" />
      <img src={corner} alt="Corner bottom left" className="corner" id="corner-bottom-left" />
      
      <div className="content">
        <Header onglet={onglet} />
        <Nav onglet={onglet} setOnglet={(e) => {setOnglet(e)}} />

        <div className="game">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classic" element={<Classic families={families} />} />
            {/* <Route path="/skill" element={<Skill />} />
            <Route path="/pixel" element={<Pixel />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}


export default App;