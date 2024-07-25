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

type TableMonsterProps = {
    openModalDelete: (id: number) => void;
    openModalUpdate: (id: number) => void;
    updateData: boolean;
}

function TableMonster({ openModalDelete, openModalUpdate, updateData }: TableMonsterProps){

    const { getToken } = useContext(UserContext) || {};
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [ debouncedValue ] = useDebounce(search, 500);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${apiUrl}/admin/monsters?page=${page}`, {
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
                        <th>Nom</th>
                        <th>Famille</th>
                        <th>Element</th>
                        <th>Type</th>
                        <th>Etoile</th>
                        <th>Second éveil</th>
                        <th>Fusion</th>
                        <th>Compétences</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((monster, index) => (
                            <tr key={index}>
                                <td style={{
                                    width: "5%"
                                }} className="imgs small">
                                    <img src={monster.image} alt={monster.name} />
                                </td>
                                <td style={{
                                    width: "8%"
                                }} className='text'>{monster.name}</td>
                                <td style={{
                                    width: "10%"
                                }} className='text'>{monster.family_name}</td>
                                <td style={{
                                    width: "5%"
                                }} className="imgs small">
                                    <img src={monster.element === "fire" ? fire : monster.element === "water" ? water : monster.element === "wind" ? wind : monster.element === "light" ? light : dark} alt={monster.element} />
                                </td>
                                <td style={{
                                    width: "5%"
                                }} className="imgs small">
                                    <img src={monster.archetype === "attack" ? attack : monster.archetype === "defense" ? defense : monster.archetype === "hp" ? hp : monster.archetype === "support" ? support : ""} alt={monster.type} />
                                </td>
                                <td style={{
                                    width: "5%"
                                }} className='text'>
                                    <img src={star} alt="Star" />
                                    <span>{monster.natural_stars}</span>
                                </td>
                                <td style={{
                                    width: "12%"
                                }} className={monster.awaken_level === 1 ? "text danger" : "text success"}>
                                    {
                                        monster.awaken_level === 1 ? "Non" : "Oui"
                                    }
                                </td>
                                <td style={{
                                    width: "5%"
                                }} className={monster.fusion_food === 0 ? "text danger" : "text success"}>
                                    {
                                        monster.fusion_food === 0 ? "Non" : "Oui"
                                    }
                                </td>
                                <td style={{
                                    width: "25%"
                                }} className="imgs small">
                                    {
                                        monster.skills.map((skill: any, index: number) => (
                                            <img key={index} src={skill.image} alt={skill.name} />
                                        ))
                                    }
                                </td>
                                <td style={{
                                    width: "20%"
                                }} className="actions">
                                    <Button 
                                        color="primary" 
                                        onClick={() => {
                                            openModalUpdate(monster.id);
                                        }}
                                    >
                                        <FaEdit />
                                        <span>Modifier</span>
                                    </Button>

                                    <Button 
                                        color="danger" 
                                        disabled={
                                            monster.skills.length > 0
                                        }
                                        onClick={() => {
                                            openModalDelete(monster.id);
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

export default TableMonster;