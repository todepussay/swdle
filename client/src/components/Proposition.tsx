import React from "react";
import "@styles/Proposition.css";
import Monster from "@models/Monster";
import GuessMonster from "@models/GuessMonster";
import Monsters from "@components/Monsters";
import FamilyComponent from "@components/Family";
import Family from "@models/Family";
import Loader from "@components/Loader";

interface PropositionProps {
    status: string;
    propositionMonster: Monster[];
    propositionFamilies: Family[];
    searchMode: string;
    handleSubmitProposition: (monster_id: number) => void;
}

function Proposition({ status, propositionMonster, propositionFamilies, searchMode, handleSubmitProposition }: PropositionProps) {
    return (
        <div className="Proposition">

            {
                status === "pending" && <div className="statusRender">
                    <Loader />
                </div>
            }

            {
                status === "not found" && <div className="statusRender">
                    <p>Aucun monstre trouvé</p>
                </div>
            }

            {
                searchMode === "families" && status === "found" ? (
                    propositionFamilies.map((family, index) => {
                        if(family.monsters.length === 0) return null;
                        return (
                            <React.Fragment key={index}>
                                {
                                    index > 0 && propositionFamilies[index - 1].family_name !== family.family_name && (
                                        <hr />
                                    )
                                }    

                                <FamilyComponent 
                                    key={index}
                                    family={family}
                                    handleSubmitProposition={handleSubmitProposition}            
                                />
                            </React.Fragment>
                        )
                    })
                ) : (
                    <Monsters 
                        monsters={propositionMonster}
                        handleSubmitProposition={handleSubmitProposition}
                    />
                )
            }


            {/* {
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
            } */}
        </div>
    )
}

export default Proposition;