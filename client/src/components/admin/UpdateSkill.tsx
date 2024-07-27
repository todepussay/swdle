import React, { useContext, useState, useEffect } from 'react';
import '@styles/Admin/AddForm.css';
import Button from '@components/admin/Button';
import Input from '@components/admin/Input';
import Select from '@components/admin/Select';
import Boolean from '@components/admin/Boolean';
import ImageUpload from '@components/admin/ImageUpload';
import { IoAddCircleOutline } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '@/contexts/UserContext';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

interface AddMonsterProps {
    id: number;
    closeModal: () => void;
    updateData: () => void;
}

function UpdateSkill({ id, closeModal, updateData }: AddMonsterProps){
    
    const [name, setName] = useState<string>('');
    const [monstersId, setMonstersId] = useState<number>(0);
    const [slot, setSlot] = useState<number>(0);
    const [passive, setPassive] = useState<boolean>(false);
    
    const { getToken } = useContext(UserContext) || {};
    const navigate = useNavigate();
    const [monsters, setMonsters] = useState<any[]>([]);
    const [status, setStatus] = useState<string>('idle'); // ['success', 'error', 'pending', 'idle']
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        switch(name){
            case 'name':
                setName(value);
                break;
            case 'slot':
                setSlot(parseInt(value));
                break;
            case 'monster':
                setMonstersId(parseInt(value));
                break;
            default:
                break;
        }

        setError('');
        setStatus('idle');
    }

    const handleClick = (name: string, e: React.FormEvent<Element> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        switch(name){
            case 'passive':
                setPassive(!passive);
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

        if(name === "" || monstersId === 0 || slot === 0){
            setError("Veuillez remplir les champs obligatoires");
            setStatus('error');
            return;
        }

        const skillInformation = {
            name,
            monsterId: monstersId,
            slot,
            passive
        };

        axios.put(`${apiUrl}/admin/skills/${id}`, skillInformation, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            },
        }).then(res => {
            if(res.data.success){
                setStatus('success');
                toast.success("Compétence modifiée avec succès");
                updateData();
                setName('');
                setMonstersId(0);
                setSlot(0);
                setPassive(false);
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
        axios.get(`${apiUrl}/admin/skills/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            }
        }).then(res => {
            if(res.data.success){
                setName(res.data.data.name);
                setMonstersId(res.data.data.monster_id);
                setSlot(res.data.data.slot);
                setPassive(res.data.data.passive);
            } else {
                if(res.data.cause === "unauthorized"){
                    navigate('/login');
                }
            }
        }).catch(err => {
            console.log(err);
        }
        )

        axios.get(`${apiUrl}/admin/monsters`, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            },
            params: {
                minimumInformation: true
            }
        }).then(res => {
            if(res.data.success){
                setMonsters(
                    res.data.data.map((monster: any) => ({
                        value: monster.id,
                        label: `${monster.name} - ${monster.skill_count} compétences`
                    }))
                );
                console.log(res.data.data);
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
                    label="Nom de la compétence" 
                    type='text' 
                    name="name" 
                    id='name' 
                    value={name} 
                    setValue={handleChange} 
                    disabled={status === 'pending'}
                    placeholder="Nom de la compétence"
                />

                <Select
                    width={30}   
                    require
                    name='monster'
                    firstOption='Choisir un monstre'
                    label='Choisir un monstre'
                    options={monsters}
                    value={monstersId}
                    setValue={handleChange}
                />
                
                <Input
                    width={30}
                    require
                    label='Slot de la compétence'
                    type='number'
                    name='slot'
                    id='slot'
                    value={slot}
                    setValue={handleChange}
                    disabled={status === 'pending'}
                />
            </div>

            <div className="row">
                <Boolean 
                    width={30}
                    require
                    name='passive'
                    label='Compétence passive'
                    value={passive}
                    setValue={handleClick}
                />
            </div>

            <div className="submit-btn">
                <p className="error">
                    {error}
                </p>
                <Button status={status} color="success" onClick={handleSubmit}>
                    <IoAddCircleOutline />
                    Ajouter un nouveau monstre
                </Button>
            </div>
        </form>
    )
}

export default UpdateSkill;