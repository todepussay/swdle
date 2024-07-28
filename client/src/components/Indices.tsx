import React, { useState, useEffect } from "react";
import "@styles/Indices.css";
import IndiceType from '@models/Indice';
import Indice from '@components/Indice';

interface IndicesProps {
    tryNumber: number;
    indices: IndiceType[];
    correct: boolean;
}

function Indices({ tryNumber, indices, correct }: IndicesProps) {

    const [selected, setSelected] = useState<number[]>([]);

    const handleClick = (index: number) => {
        if(correct) return;
        if (selected.includes(index)) {
            setSelected(selected.filter(i => i !== index));
        } else {
            setSelected([...selected, index]);
        }
    }

    return (
        <div className="Indices">
            {
                tryNumber > 0 && (
                    indices.map((indice, index) => (
                        <Indice 
                            key={index}
                            indice={indice}
                            id={index}
                            tryNumber={tryNumber}
                            selected={correct || selected.includes(index)}
                            handleClick={() => handleClick(index)}
                        />
                    ))
                )
            }
        </div>
    )
}

export default Indices;