import React from "react";
import { Link } from "react-router-dom";
import monster from "./../asset/monster.png";
import skill from "./../asset/skill.png";
import pixel from "./../asset/pixel.png";
import "./Nav.css";
import Cookies from "js-cookie";

export default function Nav({ onglet, setOnglet }){

    return (
        <nav>
          <ul>
            <li>
              <Link className={onglet === "classic" ? "active" : ""} to={"/classic"} onClick={() => setOnglet("classic")}>
                <img src={monster} alt="Monster" />
                <span>Classique</span>
              </Link>
            </li>
            {/* <li>
              <Link className={onglet === "skill" ? "active" : ""} to={"/skill"} onClick={() => setOnglet("skill")}>
                <img src={skill} alt="Skill logo" />
                <span>Compétence</span>
              </Link>
            </li>
            <li>
              <Link className={onglet === "pixel" ? "active" : ""} to={"/pixel"} onClick={() => setOnglet("pixel")}>
                <img src={pixel} alt="Pixel logo" id="pixel" />
                <span>Pixelisé</span>
              </Link>
            </li> */}
          </ul>
          {/* <button onClick={
            () => {
              Cookies.remove("tries");
              Cookies.remove("proposition");
              Cookies.remove("classic");
              window.location.reload();
            }
          
          }>
            Delete Cookie
          </button> */}
        </nav>
    )
}