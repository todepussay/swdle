import React from "react";
import "@styles/Buff.css";
import Buff from "@models/Buff";
import { Tooltip } from "react-tooltip";
import Image from "@components/Image";

interface BuffProps {
    buff: Buff;
}

function BuffComponent({ buff }: BuffProps) {
    return (
        <div className="Buff" key={buff.id}>
            <Image 
                path={buff.image_path} 
                folder="buffs" 
                alt={`Buff image ${buff.id}`} 
                data_tooltip_id="tooltip-buff" 
                data_tooltip_content={buff.name}
            />
            <Tooltip
                id="tooltip-buff"
                place="top"
                className="tooltip"
            />
        </div>
    )
}

export default BuffComponent;