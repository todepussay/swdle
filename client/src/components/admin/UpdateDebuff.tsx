import React, { useContext, useState, useEffect } from 'react';
import '@styles/Admin/AddForm.css';
import Button from '@components/Button';
import Input from '@components/admin/Input';
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '@/contexts/UserContext';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

interface UpdateDebuffProps {
    id: number;
    closeModal: () => void;
    updateData: () => void;
}

function UpdateDebuff({ id, closeModal, updateData }: UpdateDebuffProps){
    
    const [name, setName] = useState<string>('');
    
    const { getToken } = useContext(UserContext) || {};
    const navigate = useNavigate();
    const [status, setStatus] = useState<string>('idle'); // ['success', 'error', 'pending', 'idle']
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        switch(name){
            case 'name':
                setName(value);
                break;
            default:
                break;
        }

        setError('');
        setStatus('idle');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setStatus('pending');

        if(name === ""){
            setError("Veuillez remplir les champs obligatoires");
            setStatus('error');
            return;
        }

        const debuffInformation = {
            name
        };

        axios.put(`${apiUrl}/admin/debuffs/${id}`, debuffInformation, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            },
        }).then(res => {
            if(res.data.success){
                setStatus('success');
                toast.success("Effet nocif modifié avec succès");
                updateData();
                setTimeout(() => {
                    closeModal();
                }, 1000)
            } else {
                if(res.data.cause === "unauthorized"){
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    toast.error(res.data.message);
                    setError(res.data.message);
                    setStatus('error');
                }
            }
        }).catch(err => {
            console.log(err);
            setError("Une erreur s'est produite, veuillez réessayer");
            setStatus('error');
        })
    }

    useEffect(() => {
        axios.get(`${apiUrl}/admin/debuffs/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            }
        }).then(res => {
            if(res.data.success){
                const debuff = res.data.data;
                setName(debuff.name);
            } else {
                if(res.data.cause === "unauthorized"){
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    toast.error(res.data.message);
                }
            }
        }).catch(err => {
            toast.error("Une erreur s'est produite, veuillez réessayer");
        })
    }, [])

    return (
        <form className='AddForm'>
            <div className="row">
                <p>
                    <span style={{
                        color: 'var(--danger)'
                    }}>*</span>
                    <span> : Champs obligatoire</span>
                </p>
            </div>
            <div className='row'>
                <Input
                    require 
                    width={30} 
                    label="Nom de l'effet nocif" 
                    type='text' 
                    name="name" 
                    id='name' 
                    value={name} 
                    setValue={handleChange} 
                    disabled={status === 'pending'}
                    placeholder="Nom de l'effet nocif"
                />
            </div>

            <div className="submit-btn">
                <p className="error">
                    {error}
                </p>
                <Button status={status} color="success" onClick={handleSubmit}>
                    <FaEdit />
                    Modifier un effet nocif
                </Button>
            </div>
        </form>
    )
}

export default UpdateDebuff;