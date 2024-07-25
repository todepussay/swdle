import React, { useContext, useState, useEffect } from 'react';
import axios from "axios";
import UserContext from "@/contexts/UserContext";
import Pagination from "@components/admin/Pagination";
import { useNavigate } from 'react-router-dom';
import "@styles/admin/TableData.css";
import fire from "@assets/fire.png";
import water from "@assets/water.png";
import wind from "@assets/wind.png";
import light from "@assets/light.png";
import dark from "@assets/dark.png";
import attack from "@assets/attack.png";
import defense from "@assets/defense.png";
import hp from "@assets/hp.png";
import support from "@assets/support.png";
import star from "@assets/star.png";
import Button from "@components/Button";
import { FaEdit, FaTrash  } from "react-icons/fa";
import useDebounce from '@/services/useDebounce';

const apiUrl = import.meta.env.VITE_API_URL;

interface TableSkillsProps {
    openModalDelete: (id: number) => void;
    openModalUpdate: (id: number) => void;
    updateData: boolean;
}

function TableSkills({ openModalDelete, openModalUpdate, updateData }: TableSkillsProps){

    const { getToken } = useContext(UserContext) || {};
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [ debouncedValue ] = useDebounce(search, 500);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${apiUrl}/admin/skills?page=${page}`, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            },
            params: {
                search: debouncedValue
            }
        }).then(res => {
            if(res.data.success){
                setData(res.data.data);
                setTotalPage(res.data.totalPage);
                console.log(res.data.data);
            } else {
                if(res.data.cause === "unauthorized"){
                    navigate("/login");
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }, [page, debouncedValue, updateData])

    useEffect(() => {
        setPage(1);
    }, [debouncedValue])

    return (
        <div>
            <Pagination search={search} setSearch={setSearch} page={page} setPage={setPage} totalPage={totalPage} />
            <table className='tableData'>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Monstre</th>
                        <th>Nom</th>
                        <th>Passif</th>
                        <th>Slot</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((skill, index) => (
                            <tr key={index}>
                                <td className='imgs small' style={{
                                    width: "5%"
                                }}>
                                    <img src={skill.skill_image} alt={skill.name} />
                                </td>
                                <td className='imgs small' style={{
                                    width: "5%"
                                }}>
                                    <img src={skill.monster_image} alt="Image monstre" />
                                </td>
                                <td className='text' style={{
                                    width: "60%"
                                }}>{skill.name}</td>
                                <td className={skill.passive ? "text success" : "text danger"} style={{
                                    width: "5%"
                                }}>{skill.passive ? "Oui" : "Non"}</td>
                                <td className='text' style={{
                                    width: "5%"
                                }}>{skill.slot}</td>
                                <td className='actions' style={{
                                    width: "20%"
                                }}>
                                    <Button 
                                        color="primary" 
                                        onClick={() => {
                                            openModalUpdate(skill.id);
                                        }}
                                    >
                                        <FaEdit />
                                        <span>Modifier</span>
                                    </Button>

                                    <Button 
                                        color="danger" 
                                        onClick={() => {
                                            openModalDelete(skill.id);
                                        }}
                                    >
                                        <FaTrash />
                                        <span>Supprimer</span>
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )   
}

export default TableSkills;