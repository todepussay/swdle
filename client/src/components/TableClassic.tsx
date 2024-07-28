import React from "react";
import "@styles/TableClassic.css";
import GuessMonster from "@/models/GuessMonster";
import Monster from "@components/Monster";

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
import Buffs from "@components/Buffs";
import Debuffs from "@components/Debuffs";
import { Tooltip } from "react-tooltip";

interface TableClassicProps {
    triesMonster: GuessMonster[];
}

function TableClassic({ triesMonster }: TableClassicProps) {
    return (
        <table className="TableClassic">
            <thead>
                <tr>
                    <th>Monstre</th>
                    <th>Etoile</th>
                    <th>Second Eveil</th>
                    <th>Elément</th>
                    <th>Type</th>
                    <th>Buffs</th>
                    <th>Debuffs</th>
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
                                <td className={
                                    element.correct ? "good" : "bad"
                                }>
                                    <Monster monster={
                                        {
                                            monster_id: element.information.id_monster + index,
                                            monster_name: element.information.name_monster,
                                            monster_image: element.information.image_monster
                                        }
                                    } />
                                </td>
                                <td 
                                    data-tooltip-id="tooltip-stars"
                                    data-tooltip-content={
                                        element.information.natural_stars_monster === 6 ? "6 étoiles" :
                                        element.information.natural_stars_monster === 5 ? "5 étoiles" :
                                        element.information.natural_stars_monster === 4 ? "4 étoiles" :
                                        element.information.natural_stars_monster === 3 ? "3 étoiles" :
                                        element.information.natural_stars_monster === 2 ? "2 étoiles" :
                                        "1 étoile"
                                    }
                                    className={
                                        element.information.natural_stars_good ? "good" : 
                                        element.information.natural_stars_more ? "bad more" :
                                        "bad less"
                                    }>
                                        {
                                            Array.from({ length: element.information.natural_stars_monster }, (_, i) => (
                                                <img key={i} src={star} alt="Star" />
                                            ))
                                        }
                                        <Tooltip
                                            id="tooltip-stars"
                                            place="top"
                                            className="tooltip"
                                        />
                                </td>
                                <td className={element.information.second_awakened_good ? "good" : "bad"}>
                                    <span>
                                        {element.information.second_awakened_monster ? "Oui" : "Non"}
                                    </span>
                                </td>
                                <td 
                                    data-tooltip-id="tooltip-element"
                                    data-tooltip-content={
                                        element.information.element_monster === "fire" ? "Feu" :
                                        element.information.element_monster === "water" ? "Eau" :
                                        element.information.element_monster === "wind" ? "Vent" :
                                        element.information.element_monster === "light" ? "Lumière" :
                                        "Ténèbres"
                                    }
                                    className={element.information.element_good ? "good" : "bad"}>
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
                                    <Tooltip
                                        id="tooltip-element"
                                        place="top"
                                        className="tooltip"
                                    />
                                </td>
                                <td 
                                    data-tooltip-id="tooltip-archetype"
                                    data-tooltip-content={
                                        element.information.archetype_monster === "attack" ? "Attaque" :
                                        element.information.archetype_monster === "defense" ? "Défense" :
                                        element.information.archetype_monster === "support" ? "Support" :
                                        "PV"
                                    }
                                    className={element.information.archetype_good ? "good" : "bad"}>
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
                                    <Tooltip
                                        id="tooltip-archetype"
                                        place="top"
                                        className="tooltip"
                                    />
                                </td>
                                <td
                                    className={
                                        element.information.buffs_good ? "good" : 
                                        element.information.buffs_partiel ? "particiel" :
                                        "bad"
                                    }
                                >
                                    {
                                        element.information.buffs.length === 0 ? (
                                            <span>
                                                Aucun
                                            </span>
                                        ) : <Buffs buffs={element.information.buffs} />
                                    }
                                </td>   
                                <td
                                    className={
                                        element.information.debuffs_good ? "good" : 
                                        element.information.debuffs_partiel ? "particiel" :
                                        "bad"
                                    }
                                >
                                    {
                                        element.information.debuffs.length === 0 ? (
                                            <span>
                                                Aucun
                                            </span>
                                        ) : <Debuffs debuffs={element.information.debuffs} />
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

export default TableClassic;