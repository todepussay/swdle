import React from "react";
import "@styles/Debuff.css";
import Debuff from "@models/Debuff";
import { Tooltip } from "react-tooltip";
import Image from "@components/Image";

interface DebuffProps {
    debuff: Debuff;
}

function DebuffComponent({ debuff }: DebuffProps) {
    return (
        <div className="Debuff">
            <Image 
                path={debuff.image_path} 
                folder="debuffs" 
                alt={`Debuff image ${debuff.id}`} 
                data_tooltip_id="tooltip-debuff" 
                data_tooltip_content={debuff.name}
            />
            <Tooltip
                id="tooltip-debuff"
                place="top"
                className="tooltip"
            />
        </div>
    )
}

export default DebuffComponent;