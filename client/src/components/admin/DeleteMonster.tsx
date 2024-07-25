import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '@/contexts/UserContext';
import { useState } from 'react';
import Button from '@components/Button';
import "@styles/admin/AddForm.css";
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

interface DeleteMonsterProps {
    id: number;
    closeModal: () => void;
    updateData: () => void;
}

function DeleteMonster({ id, closeModal, updateData }: DeleteMonsterProps){
    
    const { getToken } = useContext(UserContext) || {};
    const navigate = useNavigate();
    const [data, setData] = useState<any>({});
    const [disabled, setDisabled] = useState<boolean>(false);

    const deleteMonster = (e: React.FormEvent) => {
        e.preventDefault();
        setDisabled(true);
        axios.delete(`${apiUrl}/admin/monsters/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            }
        }).then(res => {
            if(res.data.success){
                toast.success("Monstre supprimé avec succès");
                updateData();
                setTimeout(() => {
                    closeModal();
                    navigate("/admin/monsters");
                }, 1000)
            } else {
                if(res.data.cause === "unauthorized"){
                    navigate("/login");
                } else {
                    toast.error("Erreur lors de la suppression du monstre");
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        axios.get(`${apiUrl}/admin/monsters/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            }
        }).then(res => {
            if(res.data.success){
                setData(res.data.data);
                console.log(res.data.data);
            } else {
                if(res.data.cause === "unauthorized"){
                    navigate("/login");
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }, [])
    
    return (
        <form className='AddForm'>
            <div className="row center margin">
                <p>Voulez-vous supprimer le monstre <strong>{data.name}</strong> ?</p>
            </div>

            <div className="row center">
                <Button disabled={disabled} color="success" onClick={(e: React.FormEvent) => {deleteMonster(e)}}>
                    Oui
                </Button>
                <Button disabled={disabled} color='danger' onClick={(e: React.FormEvent) => {
                    e.preventDefault();
                    closeModal();
                }}>
                    Non
                </Button>
            </div>
        </form>
    )
}

export default DeleteMonster;