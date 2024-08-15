import React from "react";
import "@styles/Indice.css";
import IndiceType from '@models/Indice';
import { IoIosClose } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";

interface IndiceProps {
    indice: IndiceType;
    id: number;
    tryNumber: number;
    selected: boolean;
    handleClick: () => void;
    correct: boolean;
}

function Indice({ indice, id, tryNumber, selected, handleClick, correct }: IndiceProps) {
    return (
        <div className="Indice">
            {
                (indice.unlock - tryNumber <= 0) || correct ? (
                    <div className="unlock">
                        <p>Indice {id + 1}</p>
                        <div className="revealZone">
                            {
                                selected ? (
                                    <div className="selected">
                                        <button onClick={handleClick}>
                                            <img src={indice.img} alt={`Indice ${id + 1}`} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="notSelected">
                                        <button onClick={handleClick}>
                                            <FaRegEye />
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div className="lock">
                        <p>Indice {id + 1}</p>
                        <span>dans {indice.unlock - tryNumber} essaies</span>
                        <IoIosClose />
                    </div>
                )
            }
        </div>
    )
}

export default Indice;