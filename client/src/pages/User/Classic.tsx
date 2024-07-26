import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Family from '@models/Family';
import Monster from '@models/Monster';
import GuessMonster from '@models/GuessMonster';
import Indice from '@models/Indice';
import '@styles/Classic.css';

import star from "@assets/star.png";
import star_awakened from "@assets/star-awakened.png";
import fire from "@assets/fire.png";
import water from "@assets/water.png";
import wind from "@assets/wind.png";
import light from "@assets/light.png";
import dark from "@assets/dark.png";
import attack from "@assets/attack.png";
import defense from "@assets/defense.png";
import support from "@assets/support.png";
import hp from "@assets/hp.png";
import indice_img from "@assets/indice.png";
import monster from "@assets/monster.png";

const apiUrl = import.meta.env.VITE_API_URL;

type ClassicProps = {
    families: Family[];
    width: number;
};

function Classic({ families, width }: ClassicProps){

    const [searchMode, setSearchMode] = useState<string>("family");
    const [search, setSearch] = useState<string>("");
    const [propositionFamilies, setPropositionFamilies] = useState<Family[]>([]);
    const [propositionMonster, setPropositionMonster] = useState<Monster[]>([]);
    const [tries, setTries] = useState<number[]>([]);
    const [triesMonster, setTriesMonster] = useState<GuessMonster[]>([]);
    const [indiceSelected, setIndiceSelected] = useState<string>("");
    const [indice, setIndice] = useState<Indice>({
        indice1: "",
        indice2: ""
    });
    const [correct, setCorrect] = useState<GuessMonster>();

    const input = useRef<HTMLInputElement>(null);
    const correct_ref = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let valeur : string = e.target.value;

        setSearch(valeur);

        if(valeur === ""){
            setPropositionFamilies([]);
            setPropositionMonster([]);
        } else {
            if(searchMode === "family"){
                let familiesPropo : Family[] = [];
                familiesPropo = families.filter((family) => {
                    return family.family_name.toLowerCase().startsWith(valeur.toLowerCase());
                });

                familiesPropo.forEach((family) => {
                    family.monsters = family.monsters.filter((monster) => {
                        return !triesMonster.some((tryMonster) => {
                            return tryMonster.information.name_monster === monster.monster_name;
                        });
                    });
                });

                familiesPropo = familiesPropo.filter((family) => {
                    return family.monsters.length > 0;
                });
        
                setPropositionFamilies(familiesPropo);
            } else {
                let monsters : Monster[] = [];
                families.forEach((family) => {
                    family.monsters.forEach((monster) => {
                        if(monster.monster_name.toLowerCase().startsWith(valeur.toLowerCase()) && !triesMonster.some((tryMonster) => {
                            return tryMonster.information.name_monster === monster.monster_name;
                        })) {
                            monsters.push(monster);
                        }
                    });
                });

                setPropositionMonster(monsters);
            }
        }
    };

    const handleChangeSearchMode = () => {
        setPropositionFamilies([]);
        setPropositionMonster([]);
        setSearch("");
        setSearchMode(searchMode === "family" ? "monster" : "family");
        Cookies.set("searchMode", searchMode === "family" ? "monster" : "family");
    }

    const handleSubmitProposition = (id: number) => {
        if(width > 430){
            input.current?.focus();
        }

        axios.post(`${apiUrl}/guessMonster`, {
            monster_id: id,
            number_try: triesMonster.length + 1
        })
        .then((res) => {
            setTriesMonster([...triesMonster, res.data]);
            setPropositionMonster([]);
            setPropositionFamilies([]);
            setSearch("");

            if(triesMonster.length + 1 >= 4){
                setIndice({
                    indice1: res.data.indice.indice1,
                    indice2: ""
                });
                Cookies.set("classic", JSON.stringify({
                    date: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).date : new Date(),
                    tries: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).tries : [],
                    indice: {
                        indice1: res.data.indice.indice1,
                        indice2: ""
                    }
                }))
            }

            if(triesMonster.length + 1 >= 12){
                setIndice({
                    indice1: res.data.indice.indice1,
                    indice2: res.data.indice.indice2
                });
                Cookies.set("classic", JSON.stringify({
                    date: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).date : new Date(),
                    tries: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).tries : [],
                    indice: {
                        indice1: res.data.indice.indice1,
                        indice2: res.data.indice.indice2
                    }
                }))
            }

            let triesJSON = Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).tries : [];
            triesJSON.push(id);
            Cookies.set("classic", JSON.stringify({
                date: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).date : new Date(),
                tries: triesJSON,
                indice: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).indice : {}
            }));

            if(res.data.correct){
                setCorrect(res.data);
                setTimeout(() => {
                    correct_ref.current?.scrollIntoView({ behavior: "smooth" });
                }, 500);
            }
        })
    }

    useEffect(() => {
        if(!Cookies.get("classic")){
            Cookies.set("classic", JSON.stringify({
                date: new Date(),
                tries: [],
                indice: {}
            }));
        } else {
            let savedClassic = JSON.parse(Cookies.get("classic")!);

            let triesJSON = savedClassic.tries;
            let resultat = [];
            
            for(let i = 0; i < triesJSON.length; i++){
                axios.post(`${apiUrl}/guessMonster`, {
                    monster_id: triesJSON[i],
                    number_try: i + 1
                })
                .then((res) => {
                    resultat.push(res.data);
                    if(i === triesJSON.length - 1){
                        setTriesMonster(resultat);
                        if(resultat[resultat.length - 1].correct){
                            setCorrect(resultat[resultat.length - 1]);
                            setTimeout(() => {
                                correct_ref.current?.scrollIntoView({ behavior: "smooth" });
                            }, 500);
                        }
                    }
                })
            }

            const savedIndice = savedClassic.indice;
            if(savedIndice){
                setIndice({
                    indice1: savedIndice.indice1 || "",
                    indice2: savedIndice.indice2 || ""
                });
            }
        }

        const savedSearchMode = Cookies.get("searchMode");
        if(savedSearchMode){
            setSearchMode(savedSearchMode);
        }
    }, []);

    return (
        <div className="Classic">
            {
                triesMonster.length > 0 ? (
                    <div className="indices">
                        <div className="list-indices">
                            <div className="indice" id='indice1'>
                                <img src={triesMonster.length >= 6 ? monster : indice_img} alt="Indice" onClick={
                                    () => {
                                        if(triesMonster.length >= 6){
                                            setIndiceSelected(indiceSelected === "indice1" ? "" : "indice1");
                                        }
                                    }
                                } />
                                <span>
                                    {
                                        triesMonster.length >= 6 ? (
                                            ""
                                        ) : (
                                            `Débloqué dans ${6 - triesMonster.length} essais`
                                        )
                                    }
                                </span>
                            </div>
                            <div className="indice" id='indice2'>
                                <img src={triesMonster.length >= 12 ? monster : indice_img} alt="Indice" onClick={
                                    () => {
                                        if(triesMonster.length >= 12){
                                            setIndiceSelected(indiceSelected === "indice2" ? "" : "indice2");
                                        }
                                    }
                                } />
                                <span>
                                    {
                                        triesMonster.length >= 12 ? (
                                            ""
                                        ) : (
                                            `Débloqué dans ${12 - triesMonster.length} essais`
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
                                            <img src={new URL(`../assets/skills/${indice.indice1}`, import.meta.url).href} alt="Indice1" />
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
                        if (e.key === "Enter" && propositionMonster.length > 0 && searchMode === "monster") {
                            handleSubmitProposition(propositionMonster[0].monster_id);
                        }
                    }}
                    { ...correct && {
                        disabled: true
                    } }
                />
                
                <button
                    className='btn'
                    onClick={handleChangeSearchMode}
                >
                    {
                        searchMode === "family" ? "Famille" : "Monstre"
                    }
                </button>

                {
                    ((propositionFamilies.length > 0) || (propositionMonster.length > 0)) && (
                        <div className={`proposition ${searchMode === "monster" ? "propostion-monster" : ""}`}>
                            {
                                searchMode === "family" ? (
                                    propositionFamilies.map((family, index) => {
                                        if(family.monsters.length === 0) return null;
                                        return (
                                            <React.Fragment key={index}>
                                                {
                                                    index > 0 && propositionFamilies[index - 1].family_name !== family.family_name && (
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
                                                                        <img src={new URL(`../assets/monsters/${monster.monster_image}`, import.meta.url).href} alt="Monster" />
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
                                    propositionMonster
                                    .sort((a, b) => {
                                        return a.monster_name.localeCompare(b.monster_name);
                                    })
                                    .filter((monster) => {
                                        return !triesMonster.some((tryMonster) => {
                                            return tryMonster.information.name_monster === monster.monster_name;
                                        });
                                    })
                                    .map((monster, index) => {
                                        return (
                                            <div className="monster" key={index} onClick={() => handleSubmitProposition(monster.monster_id)}>
                                                <p className='monster-name'>
                                                    {monster.monster_name}
                                                </p>
                                                <img src={new URL(`../assets/monsters/${monster.monster_image}`, import.meta.url).href} alt="Monster" />
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
                triesMonster.length > 0 && (
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
                                triesMonster
                                .sort((a, b) => {
                                    return b.try - a.try;
                                })
                                .map((element, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className='monster-name-hover'>
                                                <img src={new URL(`../assets/monsters/${element.information.image_monster}`, import.meta.url).href} alt="Monster" />
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
                                                        element.information.second_awakened_monster ? (
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
                correct !== undefined && (
                    <div className="correct" ref={correct_ref}>
                        <p>
                            { 
                                tries.length === 1 ? "One Shot !" : `Bravo ! Vous avez trouvé le monstre en ${triesMonster.length} essais !`
                            }
                        </p>
                        <div className="resultat">
                            <img src={new URL(`../assets/monsters/${correct?.information.image_monster}`, import.meta.url).href} alt="Monster" />
                            <span>
                                {correct?.information.family_monster_name} <br />
                                {correct?.information.name_monster}
                            </span>
                        </div>
                    </div>
                )
            }

        </div>
    )

}

export default Classic;