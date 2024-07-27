import React, { useContext, useState, useEffect } from 'react';
import axios from "axios";
import UserContext from "@/contexts/UserContext";
import Pagination from "@components/admin/Pagination";
import { useNavigate } from 'react-router-dom';
import Button from '@components/admin/Button';
import "@styles/admin/TableData.css";
import { FaEdit, FaTrash, FaArrowsAltH } from "react-icons/fa";
import useDebounce from "@services/useDebounce";



const apiUrl = import.meta.env.VITE_API_URL;

type TableBuffProps = {
    openModalDelete: (id: number) => void;
    openModalUpdate: (id: number) => void;
    updateData: boolean;
    openModalAttribution: (id: number) => void;
}

function TableBuffs({ openModalDelete, openModalUpdate, updateData, openModalAttribution }: TableBuffProps){

    const { getToken } = useContext(UserContext) || {};
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [ debouncedValue ] = useDebounce(search, 500);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${apiUrl}/admin/buffs?page=${page}`, {
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
        <div className='table-container'>
            <Pagination search={search} setSearch={setSearch} page={page} setPage={setPage} totalPage={totalPage} />
            <table className='tableData'>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Nom</th>
                        <th>Nombre de monstre</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((buff, index) => (
                            <tr key={index}>
                                <td className='imgs small' style={{
                                    width: "5%"
                                }}>
                                    {
                                        buff.buff_image ? (
                                            <img src={buff.buff_image} alt={buff.name} />
                                        ) : (
                                            <div className='no-image'>NaN</div>
                                        )
                                    }
                                </td>
                                <td className='text' style={{
                                    width: "20%"
                                }}>{buff.name}</td>
                                <td className='text' style={{
                                    width: "45%"
                                }}>
                                    {buff.monster_count} monstre{buff.monster_count > 1 ? 's' : ''} associé{buff.monster_count > 1 ? 's' : ''}
                                </td>
                                <td className='actions' style={{
                                    width: "30%"
                                }}>
                                    <Button
                                        onClick={() => {
                                            openModalAttribution(buff.id);
                                        }}
                                    >
                                        <FaArrowsAltH />
                                        <span>Attribution</span>
                                    </Button>

                                    <Button 
                                        color="primary" 
                                        onClick={() => {
                                            openModalUpdate(buff.id);
                                        }}
                                    >
                                        <FaEdit />
                                        <span>Modifier</span>
                                    </Button>

                                    <Button 
                                        color="danger" 
                                        disabled={buff.monster_count !== 0} 
                                        onClick={() => {
                                            openModalDelete(buff.id);
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

export default TableBuffs;