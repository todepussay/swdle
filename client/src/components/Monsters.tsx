import React from "react";
import "@styles/Monsters.css";
import GuessMonster from "@models/GuessMonster";
import type Monster from "@models/Monster";
import MonsterComponent from "@components/Monster";

interface MonstersProps {
    monsters: Monster[];
    handleSubmitProposition: (monster_id: number) => void;
}

function Monsters({ monsters, handleSubmitProposition }: MonstersProps) {
    return (
        <div className="Monsters">
            {
                monsters.map((monster, index) => {
                    return (
                        <MonsterComponent
                            key={index}
                            monster={monster}
                            handleSubmitProposition={handleSubmitProposition}
                        />
                    )
                })
            }
        </div>
    )
}

export default Monsters;