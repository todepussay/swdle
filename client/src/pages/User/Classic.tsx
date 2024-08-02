import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Family from '@models/Family';
import MonsterType from '@models/Monster';
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
import Monster from '@components/Monster';

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

    async function getMonsterData(){
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
                const res = await axios.post(`${apiUrl}/guessMonster`, {
                    monster_id: triesJSON[i],
                    number_try: i + 1,
                    auto: true
                });

                resultat.push(res.data);
                if(i === triesJSON.length - 1){
                    setTriesMonster(resultat);
                    
                    const lastIndices = resultat[resultat.length - 1].indices;

                    setIndices(prev => 
                        prev.map((indice: Indice, index: number) => {
                            const shouldUpdate = resultat[resultat.length - 1].try >= indice.unlock && index === lastIndices[index].id;
                            console.log(shouldUpdate);
                            
                            if (shouldUpdate) {
                                // Create a new object with updated `img` property if the condition is met
                                return {
                                    ...indice,
                                    img: lastIndices[index].img
                                };
                            } else {
                                // Return the original object if the condition is not met
                                return indice;
                            }
                        })
                    );
                    
    
                    if(resultat[resultat.length - 1].correct){
                        setCorrect(resultat[resultat.length - 1]);
                        setTimeout(() => {
                            correct_ref.current?.scrollIntoView({ behavior: "smooth" });
                        }, 500);
                    }
                }
            }
        }
    }

    useEffect(() => {
        getMonsterData();
    }, []);

    return (
        <div className="Classic">

            <Indices tryNumber={triesMonster.length} correct={correct !== undefined ? true : false} indices={indices} />

            {
                triesMonster.length === 0 && (
                    <div className="explications">
                        <p>Devine le monstre de <br /> Summoners War du jour !</p>
                        <span>Tu peux choisir entre chercher par famille de monstre, ou directement par monstre.</span> 
                        <span>Bonne chance !</span>
                    </div>
                )
            }

            <SearchBar 
                correct={correct}
                input={input}
                handleSubmitProposition={handleSubmitProposition}
                triesMonster={triesMonster}
                refresh={refresh}
            />

            {
                triesMonster.length > 0 && (
                    <TableClassic 
                        width={width}
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
                            <Monster 
                                monster={{
                                    monster_id: correct.information.id_monster,
                                    monster_name: correct.information.name_monster,
                                    monster_image_path: correct.information.image_monster_path,
                                    monster_element: correct.information.element_monster
                                }}
                            />
                            <div className="spans">
                                <span>
                                    {correct?.information.family_monster_name} 
                                </span>
                                <span>
                                    {correct?.information.name_monster}
                                </span>
                            </div>
                        </div>
                        {
                            correct.win_number !== 0 && (
                                <p>
                                    Vous êtes le {correct?.win_number} ème à trouver ce monstre !
                                </p>
                            )
                        }
                    </div>
                )
            }

        </div>
    )

}

export default Classic;