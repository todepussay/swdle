import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '@/contexts/UserContext';
import { useState } from 'react';
import Button from '@components/admin/Button';
import "@styles/admin/AddForm.css";
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

interface DeleteMonsterProps {
    id: number;
    closeModal: () => void;
    updateData: () => void;
}

function DeleteSkill({ id, closeModal, updateData }: DeleteMonsterProps){
    
    const { getToken } = useContext(UserContext) || {};
    const navigate = useNavigate();
    const [data, setData] = useState<any>({});
    const [disabled, setDisabled] = useState<boolean>(false);

    const deleteSkill = (e: React.FormEvent) => {
        e.preventDefault();
        setDisabled(true);
        axios.delete(`${apiUrl}/admin/skills/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            }
        }).then(res => {
            if(res.data.success){
                toast.success("Compétence supprimée avec succès");
                updateData();
                setTimeout(() => {
                    closeModal();
                    navigate("/admin/skills");
                }, 1000)
            } else {
                if(res.data.cause === "unauthorized"){
                    navigate("/login");
                } else {
                    toast.error("Erreur lors de la suppression de la compétence");
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        axios.get(`${apiUrl}/admin/skills/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            }
        }).then(res => {
            if(res.data.success){
                setData(res.data.data);
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
                <p>Voulez-vous supprimer la compétence <strong>{data.name}({data.slot})</strong> de <strong>{data.monster_name}</strong> ?</p>
            </div>

            <div className="row center">
                <Button disabled={disabled} color="success" onClick={(e: React.FormEvent) => {deleteSkill(e)}}>
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

export default DeleteSkill;