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

type TableDebuffProps = {
    openModalDelete: (id: number) => void;
    openModalUpdate: (id: number) => void;
    updateData: boolean;
    openModalAttribution: (id: number) => void;
}

function TableDebuffs({ openModalDelete, openModalUpdate, updateData, openModalAttribution }: TableDebuffProps){

    const { getToken } = useContext(UserContext) || {};
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [ debouncedValue ] = useDebounce(search, 500);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${apiUrl}/admin/debuffs?page=${page}`, {
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
                        data.map((debuff, index) => (
                            <tr key={index}>
                                <td className='imgs small' style={{
                                    width: "5%"
                                }}>
                                    {
                                        debuff.debuff_image ? (
                                            <img src={debuff.debuff_image} alt={debuff.name} />
                                        ) : (
                                            <div className='no-image'>NaN</div>
                                        )
                                    }
                                </td>
                                <td className='text' style={{
                                    width: "20%"
                                }}>{debuff.name}</td>
                                <td className='text' style={{
                                    width: "45%"
                                }}>
                                    {debuff.monster_count} monstre{debuff.monster_count > 1 ? 's' : ''} associé{debuff.monster_count > 1 ? 's' : ''}
                                </td>
                                <td className='actions' style={{
                                    width: "30%"
                                }}>
                                    <Button
                                        onClick={() => {
                                            openModalAttribution(debuff.id);
                                        }}
                                    >
                                        <FaArrowsAltH />
                                        <span>Attribution</span>
                                    </Button>

                                    <Button 
                                        color="primary" 
                                        onClick={() => {
                                            openModalUpdate(debuff.id);
                                        }}
                                    >
                                        <FaEdit />
                                        <span>Modifier</span>
                                    </Button>

                                    <Button 
                                        color="danger" 
                                        disabled={debuff.monster_count !== 0} 
                                        onClick={() => {
                                            openModalDelete(debuff.id);
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

export default TableDebuffs;