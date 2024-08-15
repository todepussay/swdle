import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Family from '@models/Family';
import MonsterType from '@models/Monster';
import GuessMonster from '@models/GuessMonster';
import Indice from '@models/Indice';
import '@styles/Classic.css';
import { FaCopy } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Indices from "@components/Indices";
import SearchBar from '@components/SearchBar';
import TableClassic from '@components/TableClassic';
import Monster from '@components/Monster';
import { Tooltip } from "react-tooltip";

const apiUrl = import.meta.env.VITE_API_URL;
const url = import.meta.env.VITE_URL;

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

interface Share {
    head: string;
    body: string[];
    foot: string;
}

function Classic({ width }: ClassicProps){

    const [triesMonster, setTriesMonster] = useState<GuessMonster[]>([]);
    const [indices, setIndices] = useState<Indice[]>(initIndices);
    const [correct, setCorrect] = useState<GuessMonster>();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [share, setShare] = useState<Share>({
        head: "J'ai trouvé le monstre #SWdle en 0 coups !",
        body: [],
        foot: url
    });
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [position, setPosition] = useState<number>(0);

    const input = useRef<HTMLInputElement>(null);
    const correct_ref = useRef<HTMLDivElement>(null);

    const copyToClipboard = () => {
        const str = generateTextForShare();
        navigator.clipboard.writeText
            ? navigator.clipboard.writeText(str)
            : document.execCommand('copy', false, str);
        setIsCopied(true);
    }

    const shareOnTwitter = () => {
        const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(generateTextForShare());
        window.open(url, "_blank");
    }

    const generateTextForShare = () => {
        return `${share.head}\n${share.body.join("\n")}\n${share.foot}`;
    }

    useEffect(() => {
        if(triesMonster[0]?.correct){
            setCorrect(correct);
            setTimeout(() => {
                correct_ref.current?.scrollIntoView({ behavior: "smooth" });
            }, 500);

            let body = triesMonster.slice(0, 5).map((tryMonster: GuessMonster, index: number) => {
                return `${
                    tryMonster.correct ? "🟩" : "🟥"
                }${
                    tryMonster.information.natural_stars_good ? "🟩" : "🟥"
                }${
                    tryMonster.information.second_awakened_good ? "🟩" : "🟥"
                }${
                    tryMonster.information.element_good ? "🟩" : "🟥"
                }${
                    tryMonster.information.archetype_good ? "🟩" : "🟥"
                }${
                    tryMonster.information.buffs_good ? "🟩" :
                    tryMonster.information.buffs_partiel ? "🟨" : "🟥"
                }${
                    tryMonster.information.debuffs_good ? "🟩" :
                    tryMonster.information.debuffs_partiel ? "🟨" : "🟥"
                }${
                    tryMonster.information.family_good ? "🟩" : "🟥"
                }${
                    tryMonster.information.leader_skill_good ? "🟩" : "🟥"
                }${
                    tryMonster.information.fusion_food_good ? "🟩" : "🟥"
                }`;
            });

            if(triesMonster.length > 5){
                body.push(`+${triesMonster.length - 5} autres essais`);
            }

            setShare(prev => ({
                ...prev,
                head: `J'ai trouvé le monstre #SWdle en ${triesMonster.length} coups !`,
                body: body
            }));
        }
    }, [triesMonster]);

    const handleSubmitProposition = (id: number) => {
        if(width > 430){
            input.current?.focus();
        }

        axios.post(`${apiUrl}/guessMonster`, {
            monster_id: id,
            number_try: triesMonster.length + 1
        })
        .then((res) => {
            let newTriesMonster = [...triesMonster, res.data];
            setTriesMonster(newTriesMonster);
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
                indices: indices,
                position: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).position : 0
            }));

            let triesJSON = Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).tries : [];
            triesJSON.push(id);
            Cookies.set("classic", JSON.stringify({
                date: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).date : new Date(),
                tries: triesJSON,
                indices: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).indices : [],
                position: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).position : 0
            }));

            if(res.data.correct){
                setCorrect(res.data);
                setPosition(res.data.win_number);

                Cookies.set("classic", JSON.stringify({
                    date: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).date : new Date(),
                    tries: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).tries : [],
                    indices: Cookies.get("classic") ? JSON.parse(Cookies.get("classic")!).indices : [],
                    position: res.data.win_number
                }));
            }
        })
    }

    async function getMonsterData(){
        if(!Cookies.get("classic")){
            Cookies.set("classic", JSON.stringify({
                date: new Date(),
                tries: [],
                indices: initIndices,
                position: 0
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
                        console.log(savedClassic)
                        setPosition(savedClassic.position);
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
                                triesMonster.length === 1 ? "One Shot !" : `Bravo ! Vous avez trouvé le monstre en ${triesMonster.length} essais !`
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
                            position !== 0 && (
                                <p>
                                    Vous êtes le {position}{position === 1 ? "er" : "ème"} à trouver ce monstre !
                                </p>
                            )
                        }
                    </div>
                )
            }

            {
                correct !== undefined && (
                    <div className="share correct">
                        <div className="share-text">
                            <p>
                                {share.head}
                            </p>
                            <p className='share-array'>
                                {
                                    share.body.map((line, index) => {
                                        return (
                                            <span className={index === 5 ? "other" : ""} key={index}>{line}</span>
                                        )
                                    })
                                }
                            </p>
                            <p>
                                {share.foot}
                            </p>
                        </div>
                        <div className="share-btns">
                            <button
                                className='copy'
                                onClick={copyToClipboard}
                                data-tooltip-id="tooltip-copy"
                                data-tooltip-content="Copier dans le presse papier"
                            >
                                <FaCopy />
                                <span>
                                    {
                                        isCopied ? "Copié !" : "Copier"
                                    }
                                </span>
                            </button>
                            <button
                                className='twitter'
                                onClick={shareOnTwitter}
                                data-tooltip-id="tooltip-twitter"
                                data-tooltip-content="Partager sur X/Twitter"
                            >
                                <FaXTwitter />
                                <span>
                                    Partager
                                </span>
                            </button>
                            
                            <Tooltip
                                className='tooltip'
                                place='top'
                                id="tooltip-copy"
                            />
                            <Tooltip
                                className='tooltip'
                                place='top'
                                id="tooltip-twitter"
                            />
                        </div>
                    </div>
                )
            }

        </div>
    )

}

export default Classic;