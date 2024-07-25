import React, { useState } from 'react';
import "@styles/Admin/NavList.css"
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';



type NavListProps = {
    title: string;
    icon?: React.ReactNode | undefined;
    setOnglet?: React.Dispatch<React.SetStateAction<string>>;
    onglet?: string;
    name?: string;
    children?: React.ReactNode | undefined;
}

function NavList({ title, icon, name, children }: NavListProps){

    const [open, setOpen] = useState<boolean>(true);
    const location = useLocation().pathname.split("/").pop();
    const navigate = useNavigate();

    const handleClick = () => {
        if(!children){
            navigate("/admin/" + name);
        } else {
            setOpen(!open)
        }
    };

    return (
        <div className={location === name ? "NavList active" : "NavList"}>
            <div className="information" onClick={handleClick}>
                <h2>
                    {icon}
                    {title}
                </h2>
                {
                    children ? (
                        <div className="arrow">
                            <FaAngleDown />
                        </div> 
                        ) : (
                            null
                        )
                }
            </div>

            {
                children ? (
                    <div className={open ? "subList open" : "subList"}>
                        {children}
                    </div>
                    ) : (
                        null
                    )
            }
        </div>
    )
}

export default NavList;