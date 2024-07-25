import React from "react";
import "@styles/admin/Radio.css";

interface RadioProps {
    defaultValue?: any[];
    name: string;
    options: Option[];
    require: boolean;
    width?: number;
    label: string;
    value: string;
    setValue: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

interface Option {
    value: string;
    label: string;
    icon?: string;
}

function Radio({ defaultValue = [], name, options = [], require = false, width, label, value, setValue }: RadioProps){
    return (
        <div className="Radio" style={{"width": `${width}%`}}>
            <label htmlFor={name}>
                {label} {require && <span>*</span>} :
            </label>
            <div className="inputs-radio">
                {
                    options.map((option, index) => {
                        return (
                            <div key={index} className="input-radio">
                                {
                                    option.icon && <label htmlFor={option.value}><img src={option.icon} alt={option.label} /></label>
                                }
                                <input type="radio" name={name} id={option.value} value={option.value} checked={value === option.value} onChange={setValue} />
                                {
                                    !option.icon && <label htmlFor={option.value}>{option.label}</label>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Radio;