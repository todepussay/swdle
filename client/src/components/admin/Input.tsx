import React, { forwardRef } from 'react';
import '@styles/admin/Input.css';
import { spacing } from 'react-select/dist/declarations/src/theme';

interface InputProps {
    label: string;
    type: string;
    name: string;
    id: string;
    value: string | number;
    setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
    width: number;
    require?: boolean;
    disabled?: boolean;
    placeholder?: string;
    reference?: any;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, type = "text", name, id, value, setValue, width, require= false, disabled = false, placeholder = "" }, ref) => {
        return (
            <div className='Input' style={{ width: `${width}%` }}>
                <label htmlFor={id}>{label} {require ? <span>*</span> : ""} :</label>
                <input 
                    placeholder={placeholder} 
                    disabled={disabled} 
                    required={require} 
                    type={type} 
                    name={name} 
                    id={id} 
                    value={value} 
                    onChange={(e) => {setValue(e)}} 
                    ref={ref} 
                />
            </div>
        )
    }
);

export default Input;