import React, { useState, useEffect } from "react";
import "@styles/SearchBar.css";
import Cookies from "js-cookie";
import GuessMonster from "@models/GuessMonster";
import Family from "@models/Family";
import Monster from "@models/Monster";
import useDebounce from "@services/useDebounce";
import Proposition from "@components/Proposition";
import axios from "axios";
import { Tooltip } from "react-tooltip";

const apiUrl = import.meta.env.VITE_API_URL;

interface SearchBarProps {
    correct: GuessMonster | undefined;
    input: React.RefObject<HTMLInputElement>;
    handleSubmitProposition: (monster_id: number) => void;
    triesMonster: GuessMonster[];
    refresh: boolean;
}

function SearchBar({
    correct, 
    input,
    handleSubmitProposition,
    triesMonster,
    refresh
}: SearchBarProps){

    const [status, setStatus] = useState<string>("void"); // void, pending, found, not found
    const [search, setSearch] = useState<string>("");
    const [ debouncedValue ] = useDebounce(search, 500);
    const [searchMode, setSearchMode] = useState<string>("families");
    const [propositionFamilies, setPropositionFamilies] = useState<Family[]>([]);
    const [propositionMonster, setPropositionMonster] = useState<Monster[]>([]);

    const handleChangeSearchMode = () => {
        setPropositionFamilies([]);
        setPropositionMonster([]);
        setSearch("");
        setSearchMode(searchMode === "families" ? "monsters" : "families");
        Cookies.set("searchMode", searchMode === "families" ? "monsters" : "families");
    }

    useEffect(() => {
        setPropositionFamilies([]);
        setPropositionMonster([]);
        setSearch("");
    }, [refresh]);

    useEffect(() => {
        
        if(search === ""){
            setPropositionFamilies([]);
            setPropositionMonster([]);
            setStatus("void");
        } else {
            setStatus("pending");
            axios.get(`${apiUrl}/search`, {
                params: {
                    search: debouncedValue,
                    searchMode: searchMode
                }
            }).then((res) => {
                if(searchMode === "families"){
                    setPropositionFamilies(
                        res.data.families.map((family: Family) => {
                            return {
                                ...family,
                                monsters: family.monsters.filter((monster: Monster) => {
                                    return triesMonster.findIndex((guessMonster) => guessMonster.information.id_monster === monster.monster_id) === -1;
                                })
                            }
                        })
                    );
                } else {
                    setPropositionMonster(
                        res.data.monsters.filter((monster: Monster) => {
                            return triesMonster.findIndex((guessMonster) => guessMonster.information.id_monster === monster.monster_id) === -1;
                        })
                    );
                }
            })
        }

    }, [debouncedValue]);

    useEffect(() => {

        if(status === "pending"){
            if(searchMode === "families"){
                if(propositionFamilies.length === 0){
                    setStatus("not found");
                } else {
                    setStatus("found");
                }
            } else {
                if(propositionMonster.length === 0){
                    setStatus("not found");
                } else {
                    setStatus("found");
                }
            }
        }

    }, [propositionFamilies, propositionMonster]);

    return (
        <div className="SearchBar">
            <Tooltip
                id="buttonChangeSearchMode"
                place="bottom"
                content="Changer le mode de recherche"
                className="tooltip"
            />
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

            <div className="btns">
                <button
                    data-tooltip-id="buttonChangeSearchMode"
                    className='btn'
                    onClick={handleChangeSearchMode}
                >
                    {
                        searchMode === "families" ? "Famille" : "Monstre"
                    }
                </button>
            </div>

            {
                status !== "void" && (
                    <Proposition
                        status={status}
                        propositionFamilies={propositionFamilies}
                        propositionMonster={propositionMonster}
                        searchMode={searchMode}
                        handleSubmitProposition={handleSubmitProposition}
                    />
                )
            }

            
        </div>
    )
}

export default SearchBar;