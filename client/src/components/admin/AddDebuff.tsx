import React, { useContext, useState } from 'react';
import '@styles/Admin/AddForm.css';
import Button from '@components/admin/Button';
import Input from '@components/admin/Input';
import ImageUpload from '@components/admin/ImageUpload';
import { IoAddCircleOutline } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '@/contexts/UserContext';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

interface AddDebuffProps {
    closeModal: () => void;
    updateData: () => void;
}

function AddDebuff({ closeModal, updateData }: AddDebuffProps){
    
    const [name, setName] = useState<string>('');
    const [image, setImage] = useState<string | undefined>();
    
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

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    setImage(e.target.result);
                }
            }
            reader.readAsDataURL(file);
        }

        setError('');
        setStatus('idle');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setStatus('pending');

        if(name === "" || image === undefined){
            setError("Veuillez remplir les champs obligatoires");
            setStatus('error');
            return;
        }

        if(image === undefined){
            setError("Veuillez ajouter une image");
            setStatus('error');
            return;
        }

        const debuffInformation = {
            name,
            image
        };

        axios.post(`${apiUrl}/admin/debuffs/add`, debuffInformation, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            },
        }).then(res => {
            if(res.data.success){
                setStatus('success');
                toast.success("Effet nocif ajouté avec succès");
                updateData();
                setName('');
                setImage(undefined);
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

            <div className="row">
                <ImageUpload 
                    width={100}
                    require
                    name='image'
                    label="Image de l'effet nocif"
                    value={image}
                    setValue={handleImage}
                />
            </div>

            <div className="submit-btn">
                <p className="error">
                    {error}
                </p>
                <Button status={status} color="success" onClick={handleSubmit}>
                    <IoAddCircleOutline />
                    Ajouter un nouvelle effet nocif
                </Button>
            </div>
        </form>
    )
}

export default AddDebuff;