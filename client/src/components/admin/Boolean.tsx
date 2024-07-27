import React, { useState } from "react";
import "@styles/admin/Boolean.css";
import Button from '@components/admin/Button';

interface BooleanProps {
    defaultValue?: boolean;
    name: string;
    require: boolean;
    width?: number;
    label: string;
    value: boolean;
    setValue: (name: string, e: React.FormEvent<Element>) => void;
}

function Boolean({ defaultValue = false, name, require = false, width, label, value, setValue }: BooleanProps){
    return (
        <div className="Boolean" style={{"width": `${width}%`}}>
            <label htmlFor={name}>
                {label} {require && <span>*</span>} :
            </label>
            
            <div className="inputs-boolean">
                <Button
                    color={value ? "success" : "danger"}
                    onClick={(e) => {
                        e.preventDefault();
                        setValue(name, e);
                    }}
                >
                    {
                        value ? "Oui" : "Non"
                    }
                </Button>
            </div>

            <input 
                type="hidden"
                name={name}
                id={name}
                value={value ? "1" : "0"}
            />

        </div>
    )
}

export default Boolean;