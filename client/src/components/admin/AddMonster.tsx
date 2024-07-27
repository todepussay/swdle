import React, { useContext, useState, useEffect } from 'react';
import '@styles/Admin/AddForm.css';
import Button from '@components/admin/Button';
import Input from '@components/admin/Input';
import Select from '@components/admin/Select';
import Boolean from '@components/admin/Boolean';
import Radio from '@components/admin/Radio';
import ImageUpload from '@components/admin/ImageUpload';
import { IoAddCircleOutline } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '@/contexts/UserContext';
import { toast } from 'react-toastify';
import fire from "@assets/fire.png";
import water from "@assets/water.png";
import wind from "@assets/wind.png";
import light from "@assets/light.png";
import dark from "@assets/dark.png";
import attack from "@assets/attack.png";
import defense from "@assets/defense.png";
import support from "@assets/support.png";
import hp from "@assets/hp.png";

const elements = [
    {
        value: 'fire',
        label: 'Feu',
        icon: fire
    },
    {
        value: 'water',
        label: 'Eau',
        icon: water
    },
    {
        value: 'wind',
        label: 'Vent',
        icon: wind
    },
    {
        value: 'light',
        label: 'Lumière',
        icon: light
    },
    {
        value: 'dark',
        label: 'Ténèbres',
        icon: dark
    }
]

const types = [
    {
        value: 'attack',
        label: 'Attaque',
        icon: attack
    },
    {
        value: 'defense',
        label: 'Défense',
        icon: defense
    },
    {
        value: 'support',
        label: 'Support',
        icon: support
    },
    {
        value: 'hp',
        label: 'HP',
        icon: hp
    }
]

const natural_stars = [
    {
        value: 1,
        label: '1 étoile'
    },
    {
        value: 2,
        label: '2 étoiles'
    },
    {
        value: 3,
        label: '3 étoiles'
    },
    {
        value: 4,
        label: '4 étoiles'
    },
    {
        value: 5,
        label: '5 étoiles'
    }
]

const apiUrl = import.meta.env.VITE_API_URL;

interface AddMonsterProps {
    closeModal: () => void;
    updateData: () => void;
}

function AddMonster({ closeModal, updateData }: AddMonsterProps){
    
    const [name, setName] = useState<string>('');
    const [familyId, setFamilyId] = useState<number>(0);
    const [baseStars, setBaseStars] = useState<number>(1);
    const [element, setElement] = useState<string>("fire");
    const [type, setType] = useState<string>("attack");
    const [skillUp, setSkillUp] = useState<number>(0);
    const [awakened, setAwakened] = useState<boolean>(false);
    const [leaderSkill, setLeaderSkill] = useState<boolean>(false);
    const [homunculus, setHomunculus] = useState<boolean>(false);
    const [farmable, setFarmable] = useState<boolean>(false);
    const [fusion, setFusion] = useState<boolean>(false);
    const [image, setImage] = useState<string | undefined>();
    
    const { getToken } = useContext(UserContext) || {};
    const navigate = useNavigate();
    const [families, setFamilies] = useState<any[]>([]);
    const [status, setStatus] = useState<string>('idle'); // ['success', 'error', 'pending', 'idle']
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        switch(name){
            case 'name':
                setName(value);
                break;
            case 'family':
                setFamilyId(parseInt(value));
                break;
            case 'base_stars':
                setBaseStars(parseInt(value));
                break;
            case 'element':
                setElement(value);
                break;
            case 'type':
                setType(value);
                break;
            case 'skillUp':
                setSkillUp(parseInt(value));
                break;
            default:
                break;
        }

        setError('');
        setStatus('idle');
    }

    const handleClick = (name: string, e: React.FormEvent<Element> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        switch(name){
            case 'awakened':
                setAwakened((prev) => !prev);
                break;
            case 'leader_skill':
                setLeaderSkill((prev) => !prev);
                break;
            case 'homunculus':
                setHomunculus((prev) => !prev);
                break;
            case 'farmable':
                setFarmable((prev) => !prev);
                break;
            case 'fusion':
                setFusion((prev) => !prev);
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

        if(name === "" || familyId === 0 || baseStars === 0 || skillUp === 0 || image === undefined){
            setError("Veuillez remplir les champs obligatoires");
            setStatus('error');
            return;
        }

        if(image === undefined){
            setError("Veuillez ajouter une image");
            setStatus('error');
            return;
        }

        const monsterInformation = {
            name,
            familyId,
            baseStars,
            element,
            type,
            skillUp,
            awakened,
            leaderSkill,
            homunculus,
            farmable,
            fusion,
            image
        };

        axios.post(`${apiUrl}/admin/monsters/add`, monsterInformation, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            },
        }).then(res => {
            if(res.data.success){
                setStatus('success');
                toast.success("Monstre ajouté avec succès");
                updateData();
                setName('');
                setFamilyId(0);
                setBaseStars(1);
                setElement('fire');
                setType('attack');
                setSkillUp(0);
                setAwakened(false);
                setLeaderSkill(false);
                setHomunculus(false);
                setFarmable(false);
                setFusion(false);
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

    useEffect(() => {
        axios.get(`${apiUrl}/admin/families`, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            },
            params: {
                withoutMonster: true
            }
        }).then(res => {
            if(res.data.success){
                setFamilies(
                    res.data.data.map((family: any) => ({
                        value: family.id,
                        label: `${family.name} - ${family.monster_count} monstres`
                    }))
                );
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
                    label="Nom du monstre" 
                    type='text' 
                    name="name" 
                    id='name' 
                    value={name} 
                    setValue={handleChange} 
                    disabled={status === 'pending'}
                    placeholder="Nom du monstre"
                />

                <Select
                    width={30}   
                    require
                    name='family'
                    firstOption='Choisir une famille'
                    label='Choisir une famille'
                    options={families}
                    value={familyId}
                    setValue={handleChange}
                />

                <Select
                    width={30}
                    require
                    name="base_stars"
                    label="Nombre d'étoiles"
                    options={natural_stars}
                    value={baseStars}
                    setValue={handleChange}
                />
            </div>

            <div className="row">
                
                <Radio
                    width={30}
                    require
                    name='element'
                    label='Choisir un élément'
                    options={elements}   
                    value={element}
                    setValue={handleChange}            
                />

                <Radio
                    width={30}
                    require
                    name='type'
                    label='Choisir un type'
                    options={types}       
                    value={type}
                    setValue={handleChange}         
                />

                <Input
                    width={30}
                    require
                    label='Nombre de skill up'
                    type='number'
                    name='skillUp'
                    id='skillUp'
                    value={skillUp}
                    setValue={handleChange}
                    disabled={status === 'pending'}
                />
            </div>

            <div className="row">

                <Boolean 
                    width={30}
                    require
                    name='awakened'
                    label='Second éveil'
                    value={awakened}
                    setValue={handleClick}
                />

                <Boolean
                    width={30}
                    require
                    name='leader_skill'
                    label='Leader Skill'
                    value={leaderSkill}
                    setValue={handleClick}
                />
                
                <Boolean
                    width={30}
                    require
                    name='homunculus'
                    label='Homunculus'
                    value={homunculus}
                    setValue={handleClick}
                />
            </div>

            <div className="row">
                
                <Boolean
                    width={30}
                    require
                    name='farmable'
                    label='Farmable'
                    value={farmable}
                    setValue={handleClick}
                />

                <Boolean
                    width={30}
                    require
                    name='fusion'
                    label='Fusion'
                    value={fusion}
                    setValue={handleClick}
                />
            </div>

            <div className="row">
                <ImageUpload 
                    width={100}
                    require
                    name='image'
                    label='Image du monstre'
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
                    Ajouter un nouveau monstre
                </Button>
            </div>
        </form>
    )
}

export default AddMonster;