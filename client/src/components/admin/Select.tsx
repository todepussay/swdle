import React from "react";
import "@styles/admin/Select.css";

interface SelectProps {
    defaultValue?: any[];
    isMulti?: boolean;
    name: string;
    options: any[];
    require: boolean;
    width?: number;
    label: string;
    firstOption?: string;
    value: number;
    setValue: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,) => void;
}

function Select({ defaultValue = [], isMulti = false, name, options = [], require = false, width, label, firstOption, value, setValue }: SelectProps){
    return (
        <div className="Select" style={{"width": `${width}%`}}>
            <label htmlFor={name}>
                {label} {require && <span>*</span>} :
            </label>
            <select 
                name={name} 
                id={name} 
                required={require} 
                multiple={isMulti}
                value={value}
                onChange={(e) => {setValue(e)}}
            >
                {firstOption && <option disabled selected value="0">--- {firstOption} ---</option>}
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Select;