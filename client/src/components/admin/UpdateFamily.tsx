import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import UserContext from '@/contexts/UserContext';
import Input from '@components/admin/Input';
import Button from '@components/admin/Button';
import { FaEdit } from 'react-icons/fa';
import "@styles/admin/AddForm.css";
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

interface UpdateFamilyProps {
    id: number;
    closeModal: () => void;
    updateData: () => void;
}

function UpdateFamily({ id, closeModal, updateData }: UpdateFamilyProps){

    const { getToken } = useContext(UserContext) || {};
    const [familyInformation, setFamilyInformation] = useState<{
        name: string
    }>({
        name: ''
    });
    const [status, setStatus] = useState<string>('idle'); // ['success', 'error', 'pending', 'idle']
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFamilyInformation({
            ...familyInformation,
            [e.target.name]: e.target.value
        });
        setError('');
        setStatus('idle');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setStatus('pending');

        if(familyInformation.name === ""){
            setError("Veuillez remplir le champ obligatoire");
            setStatus('error');
            return;
        }

        axios.put(`${apiUrl}/admin/families/${id}`, familyInformation, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            },
        }).then(res => {
            if(res.data.success){
                setStatus('success');
                toast.success("Famille modifiée avec succès");
                updateData();
                setFamilyInformation({
                    name: ''
                });
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
        axios.get(`${apiUrl}/admin/families/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            }
        }).then(res => {
            if(res.data.success){
                setFamilyInformation({ name: res.data.data.name });
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
                    label="Nom de la famille" 
                    type='text' 
                    name="name" 
                    id='name' 
                    value={familyInformation.name} 
                    setValue={handleChange} 
                    disabled={status === 'pending'}
                />
            </div>

            <div className="submit-btn">
                <p className="error">
                    {error}
                </p>
                <Button status={status} color="success" onClick={handleSubmit}>
                    <FaEdit />
                    Modifier la famille
                </Button>
            </div>
        </form>
    )
}

export default UpdateFamily;