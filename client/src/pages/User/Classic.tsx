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
import Indices from "@components/Indices";
import useDebounce from '@services/useDebounce';
import SearchBar from '@components/SearchBar';
import TableClassic from '@components/TableClassic';

const apiUrl = import.meta.env.VITE_API_URL;

type ClassicProps = {
    width: number;
};

const initIndices = [
    {
        unlock: 6,
        img: "",
        selected: false
    },
    {
        unlock: 12,
        img: "",
        selected: false
    }
];

function Classic({ width }: ClassicProps){

    const [tries, setTries] = useState<number[]>([]);
    const [triesMonster, setTriesMonster] = useState<GuessMonster[]>([]);
    const [indices, setIndices] = useState<Indice[]>(initIndices);
    const [correct, setCorrect] = useState<GuessMonster>();
    const [refresh, setRefresh] = useState<boolean>(false);

    const input = useRef<HTMLInputElement>(null);
    const correct_ref = useRef<HTMLDivElement>(null);

    const handleSubmitProposition = (id: number) => {
        if(width > 430){
            input.current?.focus();
        }

        axios.post(`${apiUrl}/guessMonster`, {
            monster_id: id,
            number_try: triesMonster.length + 1
        })
        .then((res) => {
            console.log(res.data);
            setTriesMonster([...triesMonster, res.data]);
            setRefresh(!refresh);

            setIndices(prev => 
                prev.map((indice: Indice, index: number) => 
                    res.data.try >= indice.unlock && index === res.data.indices[index].id ? {
                        ...indice,
                        img: res.data.indices[index].img
                    } : indice
                )
            );

            Cookies.set("classic", JSON.stringify({
                date: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).date : new Date(),
                tries: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).tries : [],
                indices: indices
            }));

            let triesJSON = Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).tries : [];
            triesJSON.push(id);
            Cookies.set("classic", JSON.stringify({
                date: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).date : new Date(),
                tries: triesJSON,
                indices: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).indices : []
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
                indices: initIndices
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
                        
                        const lastIndices = resultat[resultat.length - 1].indices;

                        setIndices(prev => 
                            prev.map((indice: Indice, index: number) => 
                                resultat.length >= indice.unlock && index === lastIndices[index].id ? {
                                    ...indice,
                                    img: lastIndices[index].img
                                } : indice
                            )
                        );

                        if(resultat[resultat.length - 1].correct){
                            setCorrect(resultat[resultat.length - 1]);
                            setTimeout(() => {
                                correct_ref.current?.scrollIntoView({ behavior: "smooth" });
                            }, 500);
                        }
                    }
                })
            }

            const savedIndices = savedClassic.indices;
            if(savedIndices){
                setIndices(savedIndices);
            }
        }

        const savedSearchMode = Cookies.get("searchMode");
        if(savedSearchMode){
            // setSearchMode(savedSearchMode);
        }
    }, []);

    // useEffect(() => {
        
    //     if(search === ""){
    //         setPropositionFamilies([]);
    //         setPropositionMonster([]);
    //     } else {
    //         axios.get(`${apiUrl}/search`, {
    //             params: {
    //                 search: debouncedValue,
    //                 searchMode: searchMode
    //             }
    //         }).then((res) => {
    //             if(searchMode === "families"){
    //                 setPropositionFamilies(res.data.families);
    //             } else {
    //                 setPropositionMonster(res.data.monsters);
    //             }
    //         })
    //     }

    // }, [debouncedValue]);

    return (
        <div className="Classic">

            {/* <Indices tries={triesMonster.length} indices={indices} /> */}

            {/* {
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
            } */}

            <SearchBar 
                correct={correct}
                input={input}
                handleSubmitProposition={handleSubmitProposition}
                triesMonster={triesMonster}
                refresh={refresh}
            />

            {/* <div className="search-zone">
                <input 
                    type="text"
                    placeholder={
                        correct ? "Bravo ! Vous avez trouvé le monstre !" :
                        searchMode === "families" ? "Rechercher par famille de monstre" : "Rechercher par nom du monstre"
                    }
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    ref={input}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && propositionMonster.length > 0 && searchMode === "monsters") {
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
                        searchMode === "families" ? "Famille" : "Monstre"
                    }
                </button>

                {
                     ((propositionFamilies.length > 0) || (propositionMonster.length > 0)) && (
                        <div className={`proposition ${searchMode === "monsters" ? "propostion-monster" : ""}`}>
                            {
                                searchMode === "families" ? (
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
                                                                        <img src={monster.monster_image} alt="Monster" />
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
                                                <img src={monster.monster_image} alt="Monster" />
                                            </div>
                                        )
                                    })
                                )
                            }
                        </div>
                    )
                }
            </div> */}

            {
                triesMonster.length > 0 && (
                    <TableClassic 
                        triesMonster={triesMonster}
                    />
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