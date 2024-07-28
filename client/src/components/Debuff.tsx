import React from "react";
import "@styles/Debuff.css";
import Debuff from "@models/Debuff";
import { Tooltip } from "react-tooltip";

interface DebuffProps {
    debuff: Debuff;
}

function DebuffComponent({ debuff }: DebuffProps) {
    return (
        <div className="Debuff">
            <img
                data-tooltip-id="tooltip-debuff"
                data-tooltip-content={debuff.name} 
                src={debuff.image} 
                alt="Debuff Img" 
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