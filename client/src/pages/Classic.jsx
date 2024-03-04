import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Classic.css';
import img from '../asset/monsters/unit_icon_0000_1_1.png'
import Cookies from 'js-cookie';
import star from '../asset/star.png';
import star_awakened from '../asset/star-awakened.png';
import fire from '../asset/fire.png';
import water from '../asset/water.png';
import wind from '../asset/wind.png';
import light from '../asset/light.png';
import dark from '../asset/dark.png';
import attack from '../asset/attack.png';
import defense from '../asset/defense.png';
import support from '../asset/support.png';
import hp from '../asset/hp.png';
import indice_img from '../asset/indice.png';
import monster from '../asset/monster.png';

export default function Classic() {

    const [searchMode, setSearchMode] = useState("family");
    const [search, setSearch] = useState("");
    const [families, setFamilies] = useState([]);
    const [proposition, setProposition] = useState([]);
    const [tries, setTries] = useState([]);
    const [indiceSelected, setIndiceSelected] = useState();
    const [indice, setIndice] = useState([]);
    const input = React.createRef();

    const handleChange = (e) => {
        let valeur = e.target.value;

        setSearch(valeur);
        
        if(valeur === "") {
            setProposition([]);
        } else {

            if (searchMode === "family") {
                setProposition(
                    families.filter((family) => {
                        return family.family_name.toLowerCase().startsWith(valeur.toLowerCase());
                    })
                );
            } else {
                let monsters = [];
                families.forEach((family) => {
                    family.monsters.forEach((monster) => {
                        if(monster.monster_name.toLowerCase().startsWith(valeur.toLowerCase()) && !tries.some((tryMonster) => {
                            return tryMonster.information.name_monster === monster.monster_name;
                        })) {
                            monsters.push(monster);
                        }
                    });
                });

                setProposition(monsters);
                
                
            }
        }
    }   

    const handleChangeSearchMode = () => {
        setProposition([]);
        setSearch("");
        setSearchMode(searchMode === "family" ? "monster" : "family");
        Cookies.set('searchMode', searchMode === "family" ? "monster" : "family");
    }

    const handleSubmitProposition = (id) => {
        input.current.focus();
        axios.post(`${process.env.REACT_APP_URL_API}/guessMonster`, {
            monster_id: id,
            number_try: tries.length + 1
        })
        .then((res) => {
            setTries([...tries, res.data]);
            setProposition([]);
            setSearch("");

            if (tries.length + 1 >= 6) {
                setIndice({
                    indice1: res.data.indice.indice1
                });
            }

            if(tries.length + 1 >= 12) {
                setIndice({
                    indice1: res.data.indice.indice1,
                    indice2: res.data.indice.indice2
                });
            }
            
            if(Cookies.get('tries')) {
                let triesJSON = JSON.parse(Cookies.get('tries'));
                triesJSON.push(id);
                console.log("Cookie : ", triesJSON);
                Cookies.set('tries', JSON.stringify(triesJSON));
            } else {
                Cookies.set('tries', JSON.stringify([id]));
            }
        })
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL_API}/getAllMonsters`)
        .then((res) => {
            setFamilies(res.data);
        })

        const savedTries = Cookies.get('tries');
        if (savedTries) {
            let triesJSON = JSON.parse(savedTries);
            let resultat = [];
            for(let i = 0; i < triesJSON.length; i++) {
                console.log(triesJSON[i])
                axios.post(`${process.env.REACT_APP_URL_API}/guessMonster`, {
                    monster_id: triesJSON[i],
                    number_try: i + 1
                })
                .then((res) => {
                    resultat.push(res.data);
                    if (i === triesJSON.length - 1) {
                        setTries(resultat);
                    }
                })
            }
        }

        const savedSearchMode = Cookies.get('searchMode');
        if (savedSearchMode) {
          setSearchMode(savedSearchMode);
        }
    }, []);

    return (
        console.log(tries),
        <div className="Classic">
            <div className="indices">
                <div className="list-indices">
                    <div className="indice" id='indice1'>
                        <img src={tries.length >= 6 ? monster : indice_img} alt="Indice" onClick={
                            () => {
                                if(tries.length >= 6){
                                    setIndiceSelected(indiceSelected === "indice1" ? "" : "indice1");
                                }
                            }
                        } />
                        <span>
                            {
                                tries.length >= 6 ? (
                                    ""
                                ) : (
                                    `Débloqué dans ${6 - tries.length} essais`
                                )
                            }
                        </span>
                    </div>
                    <div className="indice" id='indice2'>
                        <img src={tries.length >= 12 ? monster : indice_img} alt="Indice" onClick={
                            () => {
                                if(tries.length >= 12){
                                    setIndiceSelected(indiceSelected === "indice2" ? "" : "indice2");
                                }
                            }
                        } />
                        <span>
                            {
                                tries.length >= 12 ? (
                                    ""
                                ) : (
                                    `Débloqué dans ${12 - tries.length} essais`
                                )
                            }
                        </span>
                    </div>
                </div>
                

                {
                    indiceSelected && (
                        <div className="indice-content">
                            {
                                indiceSelected === "indice1" ? (
                                    <img src={require(`../asset/skills/${indice.indice1}`)} />
                                ) : indiceSelected === "indice2" ? (
                                    <img src={require(`../asset/monsters/${indice.indice2}`)} />
                                ) : (
                                    ""
                                )
                            }
                        </div>
                    )
                }

            </div>
            <div className="search-zone">
                <input 
                    type="text"
                    placeholder={
                        searchMode === "family" ? "Rechercher par famille de monstre" : "Rechercher par nom du monstre"
                    }
                    value={search}
                    onChange={handleChange}
                    ref={input}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && proposition.length > 0 && searchMode === "monster") {
                            handleSubmitProposition(proposition[0].monster_id);
                        }
                    }}
                />
                
                <button
                    onClick={handleChangeSearchMode}
                >
                    {
                        searchMode === "family" ? "Famille" : "Monstre"
                    }
                </button>

                {
                    proposition.length > 0 && (
                        <div className={`proposition ${searchMode === "monster" ? "propostion-monster" : ""}`}>
                            {
                                searchMode === "family" ? (
                                    proposition.map((family, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                {
                                                    index > 0 && proposition[index - 1].family_name !== family.family_name && (
                                                        <hr />
                                                    )
                                                }
                                                <div className="family" key={index}>
                                                    <p className="family-name">
                                                        {family.family_name}
                                                    </p>
                                                    <div className="monsters">
                                                        {
                                                            family.monsters
                                                            .filter((monster) => {
                                                                return !tries.some((tryMonster) => {
                                                                    return tryMonster.information.name_monster === monster.monster_name;
                                                                });
                                                            })
                                                            .map((monster, index) => {
                                                                return (
                                                                    <div className="monster" key={index} onClick={() => handleSubmitProposition(monster.monster_id)}>
                                                                        <p className='monster-name'>
                                                                            {monster.monster_name}
                                                                        </p>
                                                                        <img src={require(`../asset/monsters/${monster.monster_image}`)} alt="Monster Image" />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        )
                                    })
                                ) : (
                                    proposition
                                    .sort((a, b) => {
                                        return a.monster_name.localeCompare(b.monster_name);
                                    })
                                    .filter((monster) => {
                                        return !tries.some((tryMonster) => {
                                            return tryMonster.information.name_monster === monster.monster_name;
                                        });
                                    })
                                    .map((monster, index) => {
                                        return (
                                            <div className="monster" key={index} onClick={() => handleSubmitProposition(monster.monster_id)}>
                                                <p className='monster-name'>
                                                    {monster.monster_name}
                                                </p>
                                                <img src={require(`../asset/monsters/${monster.monster_image}`)} alt="Monster Image" />
                                            </div>
                                        )
                                    })
                                )
                            }
                        </div>
                    )
                }
            </div>

            {
                tries.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Monstre</th>
                                <th>Etoile Naturelle</th>
                                <th>Second Eveil Possible</th>
                                <th>Elément</th>
                                <th>Type</th>
                                <th>Famille</th>
                                <th>Leader Skill</th>
                                <th>Fusion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tries
                                .sort((a, b) => {
                                    return b.try - a.try;
                                })
                                .map((element, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className='monster-name-hover'>
                                                <img src={require(`../asset/monsters/${element.information.image_monster}`)} alt="Monster Image" />
                                                <span>
                                                    {element.information.name_monster}
                                                </span>
                                            </td>
                                            <td className={
                                                    element.information.natural_stars_good ? "good" : 
                                                    element.information.natural_stars_more ? "bad more" :
                                                    "bad less"
                                                }>
                                                <span>
                                                    {element.information.natural_stars_monster}
                                                    {
                                                        element.second_awakened_monster ? (
                                                            <img src={star_awakened} alt="Second Awakened" />
                                                        ) : (
                                                            <img src={star} alt="Star" />
                                                        )
                                                    }
                                                </span>
                                            </td>
                                            <td className={element.information.second_awakened_good ? "good" : "bad"}>
                                                <span>
                                                    {element.information.second_awakened_monster ? "Oui" : "Non"}
                                                </span>
                                            </td>
                                            <td className={element.information.element_good ? "good" : "bad"}>
                                                {
                                                    element.information.element_monster === "fire" ? (
                                                        <img src={fire} alt="Fire" />
                                                    ) : element.information.element_monster === "water" ? (
                                                        <img src={water} alt="Water" />
                                                    ) : element.information.element_monster === "wind" ? (
                                                        <img src={wind} alt="Wind" />
                                                    ) : element.information.element_monster === "light" ? (
                                                        <img src={light} alt="Light" />
                                                    ) : (
                                                        <img src={dark} alt="Dark" />
                                                    )
                                                }
                                            </td>
                                            <td className={element.information.archetype_good ? "good" : "bad"}>
                                                {
                                                    element.information.archetype_monster === "attack" ? (
                                                        <img src={attack} alt="Attack" />
                                                    ) : element.information.archetype_monster === "defense" ? (
                                                        <img src={defense} alt="Defense" />
                                                    ) : element.information.archetype_monster === "support" ? (
                                                        <img src={support} alt="Support" />
                                                    ) : (
                                                        <img src={hp} alt="HP" />
                                                    )
                                                }
                                            </td>
                                            <td className={`family-td ${element.information.family_good ? "good" : "bad"}`}>
                                                <span>
                                                    {element.information.family_monster_name}
                                                </span>
                                            </td>
                                            <td className={element.information.leader_skill_monster ? "good" : "bad"}>
                                                <span>
                                                    {element.information.leader_skill_good ? "Oui" : "Non"}
                                                </span>
                                            </td>
                                            <td className={element.information.fusion_food_good ? "good" : "bad"}>
                                                <span>
                                                    {element.information.fusion_food_monster ? "Oui" : "Non"}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                )
            }

        </div>
    )
}