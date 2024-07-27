import React from "react";
import "@styles/Indices.css";
import Indice from '@models/Indice';

interface IndicesProps {
    tries: number;
    indices: Indice[];
}

function Indices({ tries, indices }: IndicesProps) {
    return (
        <div className="indices">
            tries: {tries}
        </div>
    )
}

export default Indices;