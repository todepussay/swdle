import React from "react";
import "@styles/Family.css";

import type Monster from "@models/Monster";
import type Family from "@models/Family";
import GuessMonster from "@/models/GuessMonster";
import Monsters from "@components/Monsters";

interface FamilyProps {
    family: Family;
    handleSubmitProposition: (monster_id: number) => void;
}

function FamilyComponent({ family, handleSubmitProposition }: FamilyProps) {
    return (
        <div className="Family">
            <p className="name">
                {family.family_name}
            </p>
            <Monsters 
                monsters={family.monsters}
                handleSubmitProposition={handleSubmitProposition}
            />
        </div>
    )
}

export default FamilyComponent;