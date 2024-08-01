import React from "react";
import "@styles/Monster.css";
import Monster from "@models/Monster";
import { Tooltip } from "react-tooltip";
import Image from "@components/Image";

interface MonsterProps {
    monster: Monster;
    handleSubmitProposition?: (monster_id: number) => void | undefined;
}

function MonsterComponent({ monster, handleSubmitProposition }: MonsterProps) {
    return (
        <div className="Monster" key={monster.monster_id}>
            <button 
                onClick={
                    handleSubmitProposition ? () => handleSubmitProposition(monster.monster_id) : undefined
                } 
                data-tooltip-id="tooltip-monster"
                data-tooltip-content={monster.monster_name}
                style={{ cursor: handleSubmitProposition ? "pointer" : "default" }}
            >
                {/* <img src={monster.monster_image} alt="Monster Img" /> */}
                <Image path={monster.monster_image_path} folder="monsters" alt={`Monster image ${monster.monster_id}`} />
            </button>
            <Tooltip
                id="tooltip-monster"
                place="top"
                className="tooltip"
            />
        </div>
    )
}

export default MonsterComponent;