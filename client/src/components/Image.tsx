import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@components/Loader";

const apiUrl = import.meta.env.VITE_API_URL;

interface ImageProps {
    path: string;
    folder: string;
    alt: string;
    className?: string;
    data_tooltip_id?: string;
    data_tooltip_content?: string;
}

function Image({ path, folder, alt, className, data_tooltip_id, data_tooltip_content }: ImageProps){

    const [image, setImage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get(`${apiUrl}/image/${folder}/${path}`)
        .then((res) => {
            console.log(res.data);
            setImage(res.data.data);
            setLoading(false);
        })
    }, []);

    return (
        <>
            {
                loading ? (
                    <Loader />
                ) : (
                    <img 
                        src={image} 
                        alt={alt} 
                        className={className} 
                        data-tooltip-id={data_tooltip_id}
                        data-tooltip-content={data_tooltip_content}
                    />
                )
            }
        </>
    );
}

export default Image;