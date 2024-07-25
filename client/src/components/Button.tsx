import React from 'react';
import '@styles/Button.css';
import { FaRegCheckCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

interface ButtonProps {
    color?: string;
    disabled?: boolean;
    onClick?: (e: React.FormEvent) => void;
    children: React.ReactNode;
    status?: string;
}

function Button ({ color = "", disabled, onClick, children, status="idle" }: ButtonProps) {
    return (
        <button className={`button ${
            status === "idle" ? color : 
            status === "error" ? "danger" :
            status === "success" ? "success" :
            status === "pending" ? "primary" : color
        }`} onClick={onClick} disabled={disabled || status !== "idle"}>
            
            {
                status === 'idle' ? children :
                status === 'pending' ? "Chargement..." :
                status === 'success' ? <FaRegCheckCircle /> :
                status === 'error' ? <MdErrorOutline /> : null
            }
        </button>
    )
}

export default Button;