import React, { useState } from "react";
import "@styles/admin/ImageUpload.css";

interface ImageUploadProps {
    width: number;
    require?: boolean;
    name: string;
    label: string;
    value: string | undefined;
    setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ImageUpload({ width, require = false, name, label, value, setValue }: ImageUploadProps){
    return (
        <div className="ImageUpload" style={{
            "width": `${width}%`
        }}>
            <label htmlFor={name}>
                {label} {require && <span>*</span>} :
            </label>

            <div className="images">
                <div className="imageField">
                    <span>Déposer l'image ici ou cliquer ici</span>
                    <input 
                        type="file"
                        name={name}
                        id={name}
                        accept="image/*"
                        onChange={(e) => setValue(e)} 
                    />
                </div>

                <div className="imageRender">
                    {
                        !value ? <span>Aucune image</span> : <img src={value} alt="image" />
                    }
                </div>
            </div>
            
        </div>
    )
}

export default ImageUpload;