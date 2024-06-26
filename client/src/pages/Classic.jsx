import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Classic.css';
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

export default function Classic({ families, width }) {

    const [searchMode, setSearchMode] = useState("family");
    const [search, setSearch] = useState("");
    const [proposition, setProposition] = useState([]);
    const [tries, setTries] = useState([]);
    const [indiceSelected, setIndiceSelected] = useState();
    const [indice, setIndice] = useState({});
    const [correct, setCorrect] = useState(null);
    const input = useRef(null);
    const correct_ref = useRef(null);

    const handleChange = (e) => {
        let valeur = e.target.value;

        setSearch(valeur);
        
        if(valeur === "") {
            setProposition([]);
        } else {

            if (searchMode === "family") {
                let familiesPropo = [];
                familiesPropo = families.filter((family) => {
                    return family.family_name.toLowerCase().startsWith(valeur.toLowerCase());
                });

                familiesPropo.forEach((family) => {
                    family.monsters = family.monsters.filter((monster) => {
                        return !tries.some((tryMonster) => {
                            return tryMonster.information.name_monster === monster.monster_name;
                        });
                    });
                });

                familiesPropo = familiesPropo.filter((family) => {
                    return family.monsters.length > 0;
                });

                setProposition(familiesPropo);
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
        Cookies.set("classic", JSON.stringify({
            date: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")).date : new Date(),
            tries: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")).tries : [],
            indice: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")).indice : {}
        }))
        Cookies.set('searchMode', searchMode === "family" ? "monster" : "family");
    }

    const handleSubmitProposition = (id) => {
        if(width > 430){
            input.current.focus();
        }
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
                Cookies.set("classic", JSON.stringify({
                    date: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")).date : new Date(),
                    tries: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")).tries : [],
                    indice: {
                        indice1: res.data.indice.indice1,
                        indice2: ""
                    }
                }))
                // Cookies.set('indice', JSON.stringify(res.data.indice));
            }

            if(tries.length + 1 >= 12) {
                setIndice({
                    indice1: res.data.indice.indice1,
                    indice2: res.data.indice.indice2
                });
                Cookies.set("classic", JSON.stringify({
                    date: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")).date : new Date(),
                    tries: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")).tries : [],
                    indice: {
                        indice1: res.data.indice.indice1,
                        indice2: res.data.indice.indice2
                    }
                }))
                // Cookies.set('indice', JSON.stringify(res.data.indice));
            }

            let triesJSON = Cookies.get("classic") ? JSON.parse(Cookies.get("classic")).tries : [];
            triesJSON.push(id);
            Cookies.set("classic", JSON.stringify({
                date: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")).date : new Date(),
                tries: triesJSON,
                indice: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")).indice : {}
            }))

            if(res.data.correct){
                setCorrect(res.data.information);
                setTimeout(() => {
                    correct_ref.current.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
            
            // if(Cookies.get('tries')) {
            //     let triesJSON = JSON.parse(Cookies.get('tries'));
            //     triesJSON.push(id);
            //     Cookies.set('tries', JSON.stringify(triesJSON));
            // } else {
            //     Cookies.set('tries', JSON.stringify([id]));
            // }
        })
    }

    useEffect(() => {
        if(!Cookies.get('classic')){
            Cookies.set("classic", JSON.stringify({
                date: new Date(),
                tries: [],
                indice: {}
            }))
        } else {
            let savedClassic = JSON.parse(Cookies.get("classic"));

            let triesJSON = savedClassic.tries;
            let resultat = [];
            for(let i = 0; i < triesJSON.length; i++) {
                axios.post(`${process.env.REACT_APP_URL_API}/guessMonster`, {
                    monster_id: triesJSON[i],
                    number_try: i + 1
                })
                .then((res) => {
                    resultat.push(res.data);
                    if (i === triesJSON.length - 1) {
                        setTries(resultat);
                        if(resultat[resultat.length - 1].correct){
                            setCorrect(resultat[resultat.length - 1].information);
                            setTimeout(() => {
                                correct_ref.current.scrollIntoView({ behavior: 'smooth' });
                            }, 500);
                        }
                    }
                })
            }

            const savedIndice = savedClassic.indice;
            if (savedIndice) {
                setIndice(savedIndice);
            }
        }

        const savedSearchMode = Cookies.get('searchMode');
        if (savedSearchMode) {
            setSearchMode(savedSearchMode);
        }



        // const savedTries = Cookies.get('tries');
        // if (savedTries) {
        //     let triesJSON = JSON.parse(savedTries);
        //     let resultat = [];
        //     for(let i = 0; i < triesJSON.length; i++) {
        //         axios.post(`${process.env.REACT_APP_URL_API}/guessMonster`, {
        //             monster_id: triesJSON[i],
        //             number_try: i + 1
        //         })
        //         .then((res) => {
        //             resultat.push(res.data);
        //             if (i === triesJSON.length - 1) {
        //                 setTries(resultat);
        //             }
        //         })
        //     }
        // }

        // const savedSearchMode = Cookies.get('searchMode');
        // if (savedSearchMode) {
        //   setSearchMode(savedSearchMode);
        // }

        // const savedIndice = Cookies.get('indice');
        // if (savedIndice) {
        //     setIndice(JSON.parse(savedIndice));
        // }
    }, []);

    return (
        <div className="Classic">
            {
                tries.length > 0 ? (
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
                                            <img src={require(`../asset/skills/${indice.indice1}`)} alt="Indice1" />
                                        ) : indiceSelected === "indice2" ? (
                                            <img src={indice.indice2} alt="Indice2" />
                                        ) : (
                                            ""
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <div className="explications">
                        <p>Devine le monstre de <br /> Summoners War du jour !</p>
                        <span>Tu peux choisir entre chercher par famille de monstre, ou directement par monstre.</span> 
                        <span>Bonne chance !</span>
                    </div>
                )
            }

            <div className="search-zone">
                <input 
                    type="text"
                    placeholder={
                        correct ? "Bravo ! Vous avez trouvé le monstre !" :
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
                    { ...correct && {
                        disabled: true
                    } }
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
                                        if(family.monsters.length === 0) return null;
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
                                                            .map((monster, index) => {
                                                                return (
                                                                    <div className="monster" key={index} onClick={() => handleSubmitProposition(monster.monster_id)}>
                                                                        <p className='monster-name'>
                                                                            {monster.monster_name}
                                                                        </p>
                                                                        <img src={require(`../asset/monsters/${monster.monster_image}`)} alt="Monster" />
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
                                                <img src={require(`../asset/monsters/${monster.monster_image}`)} alt="Monster" />
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
                                                <img src={require(`../asset/monsters/${element.information.image_monster}`)} alt="Monster" />
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
                                            <td className={element.information.leader_skill_good ? "good" : "bad"}>
                                                <span>
                                                    {element.information.leader_skill_monster ? "Oui" : "Non"}
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

            {
                correct !== null && (
                    <div className="correct" ref={correct_ref}>
                        <p>
                            { 
                                tries.length === 1 ? "One Shot !" : `Bravo ! Vous avez trouvé le monstre en ${tries.length} essais !`
                            }
                        </p>
                        <div className="resultat">
                            <img src={require(`../asset/monsters/${correct.image_monster}`)} alt="Monster" />
                            <span>
                                {correct.family_monster_name} <br />
                                {correct.name_monster}
                            </span>
                        </div>
                    </div>
                )
            }

        </div>
    )
}