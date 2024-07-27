import React, { useContext, useState, useEffect } from 'react';
import axios from "axios";
import UserContext from "@/contexts/UserContext";
import Pagination from "@components/admin/Pagination";
import { useNavigate } from 'react-router-dom';
import Button from '@components/admin/Button';
import "@styles/admin/TableData.css";
import { FaEdit, FaTrash  } from "react-icons/fa";
import useDebounce from "@services/useDebounce";


const apiUrl = import.meta.env.VITE_API_URL;

type TableFamilyProps = {
    openModalDelete: (id: number) => void;
    openModalUpdate: (id: number) => void;
    updateData: boolean;
}

function TableFamily({ openModalDelete, openModalUpdate, updateData }: TableFamilyProps){

    const { getToken } = useContext(UserContext) || {};
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [ debouncedValue ] = useDebounce(search, 500);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${apiUrl}/admin/families?page=${page}`, {
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
                        <th>Nom</th>
                        <th>Monstres</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((family, index) => (
                            <tr key={index}>
                                <td className='text' style={{
                                    width: "20%"
                                }}>{family.name}</td>
                                <td className='imgs small' style={{
                                    width: "60%"
                                }}>
                                    {
                                        family.monsters.length === 0 ? <span>Aucun monstre</span> :
                                        family.monsters.map((monster: any, index: number) => (
                                            <img key={monster.monster_id} src={monster.image} alt={monster.monster_name} />
                                        ))
                                    }
                                </td>
                                <td className='actions' style={{
                                    width: "20%"
                                }}>
                                    <Button 
                                        color="primary" 
                                        onClick={() => {
                                            openModalUpdate(family.id);
                                        }}
                                    >
                                        <FaEdit />
                                        <span>Modifier</span>
                                    </Button>

                                    <Button 
                                        color="danger" 
                                        disabled={family.monsters.length !== 0} 
                                        onClick={() => {
                                            openModalDelete(family.id);
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

export default TableFamily;