import React, { useContext, useState } from 'react';
import '@styles/Admin/AddForm.css';
import Button from '@components/Button';
import Input from '@components/admin/Input';
import { IoAddCircleOutline } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '@/contexts/UserContext';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

interface AddFamilyProps {
    closeModal: () => void;
    updateData: () => void;
}

function AddFamily({ closeModal, updateData }: AddFamilyProps){
    
    const { getToken } = useContext(UserContext) || {};
    const navigate = useNavigate();
    const [familyInformation, setFamilyInformation] = useState<{
        name: string
    }>({
        name: ''
    });
    const [status, setStatus] = useState<string>('idle'); // ['success', 'error', 'pending', 'idle']
    const [error, setError] = useState<string>('');

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

        axios.post(`${apiUrl}/admin/families/add`, familyInformation, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            },
        }).then(res => {
            if(res.data.success){
                setStatus('success');
                toast.success("Famille ajoutée avec succès");
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
                    <IoAddCircleOutline />
                    Ajouter une nouvelle famille
                </Button>
            </div>
        </form>
    )
}

export default AddFamily;