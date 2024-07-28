import React from "react";
import "@styles/Buff.css";
import Buff from "@models/Buff";
import { Tooltip } from "react-tooltip";

interface BuffProps {
    buff: Buff;
}

function BuffComponent({ buff }: BuffProps) {
    return (
        <div className="Buff">
            <img
                data-tooltip-id="tooltip-buff"
                data-tooltip-content={buff.name} 
                src={buff.image} 
                alt="Buff Img" 
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