import React, { useContext, useEffect, useState, useRef, createRef } from "react";
import axios from "axios";
import UserContext from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Input from "@components/admin/Input";
import Button from '@components/admin/Button';
import "@styles/Admin/Attribution.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";


const apiUrl = import.meta.env.VITE_API_URL;

interface AttributionProps {
    id: number;
    onglet: string;
    closeModal: () => void;
    updateData: () => void;
}

function Attribution({ id, onglet, closeModal, updateData }: AttributionProps){

    const { getToken } = useContext(UserContext) || {};
    const navigate = useNavigate();
    const [data, setData] = useState<any>({});
    const [leftArray, setLeftArray] = useState<any[]>([]);
    const [searchLeft, setSearchLeft] = useState<string>("");
    const [selectedMonstersLeft, setSelectedMonstersLeft] = useState<any[]>([]);
    const [rightArray, setRightArray] = useState<any[]>([]);
    const [searchRight, setSearchRight] = useState<string>("");
    const [selectedMonstersRight, setSelectedMonstersRight] = useState<any>([]);
    const [status, setStatus] = useState<string>("idle"); // idle, pending, success, error
    const [error, setError] = useState<string>("");
    const inputLeft = createRef<HTMLInputElement>();
    const inputRight = createRef<HTMLInputElement>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.name === "searchLeft"){
            setSearchLeft(e.target.value);
        } else if(e.target.name === "searchRight"){
            setSearchRight(e.target.value);
        }

        setError("");
        setStatus("idle");
    };

    const handleSubmitAddMonsters = () => {
        setStatus("pending");

        if(selectedMonstersLeft.length === 0){
            setError("Veuillez sélectionner au moins un monstre");
            setStatus("error");
            return;
        }

        axios.post(`${apiUrl}/admin/affecter`, {
            monsters: selectedMonstersLeft.map((monster: any) => monster.id)
        }, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            },
            params: {
                id: id,
                onglet: onglet
            }
        }).then(res => {
            if(res.data.success){
                toast.success("Monstre(s) ajouté(s) à l'effect avec succès");
                updateData();
                setSelectedMonstersLeft([]);
                setSelectedMonstersRight([]);
                fetchMonsters();
                setStatus("idle");
            } else {
                if(res.data.cause === "unauthorized"){
                    navigate("/login");
                } else {
                    setError("Une erreur est survenue");
                    setStatus("error");
                }
            }
        }).catch(err => {
            console.log(err);
            setError("Une erreur est survenue");
            setStatus("error");
        });
    }

    const handleSubmitRemoveMonsters = () => {
        setStatus("pending");

        if(selectedMonstersRight.length === 0){
            setError("Veuillez sélectionner au moins un monstre");
            setStatus("error");
            return;
        }

        axios.post(`${apiUrl}/admin/desaffecter`, {
            monsters: selectedMonstersRight.map((monster: any) => monster.id)
        }, {
            headers: {
                Authorization: `Bearer ${getToken!()}`
            },
            params: {
                id: id,
                onglet: onglet
            }
        }).then(res => {
            if(res.data.success){
                toast.success("Monstre(s) retiré(s) de l'effect avec succès");
                updateData();
                setSelectedMonstersRight([]);
                setSelectedMonstersLeft([]);
                fetchMonsters();
                setStatus("idle");
            } else {
                if(res.data.cause === "unauthorized"){
                    navigate("/login");
                } else {
                    setError("Une erreur est survenue");
                    setStatus("error");
                }
            }
        }).catch(err => {
            console.log(err);
            setError("Une erreur est survenue");
            setStatus("error");
        });
    }

    const fetchMonsters = async () => {
        setLeftArray([]);
        setRightArray([]);
        try {
            const res = await axios.get(`${apiUrl}/admin/monsters/`, {
                headers: {
                    Authorization: `Bearer ${getToken!()}`
                },
                params: {
                    debuffAndBuff: true,
                }
            });

            if(res.data.success){
                console.log(res.data.data);
                res.data.data.map((monster: any) => {
                    if(onglet === "buffs"){
                        if(monster.buff_count > 0){
                            if(monster.buffs.find((buff: any) => buff === id)){
                                setRightArray(prevArray => [...prevArray, monster]);
                            } else {
                                setLeftArray(prevArray => [...prevArray, monster]);
                            }
                        } else {
                            setLeftArray(prevArray => [...prevArray, monster]);
                        }
                    } else if(onglet === "debuffs"){
                        if(monster.debuff_count > 0){
                            if(monster.debuffs.find((debuff: any) => debuff === id)){
                                setRightArray(prevArray => [...prevArray, monster]);
                            } else {
                                setLeftArray(prevArray => [...prevArray, monster]);
                            }
                        } else {
                            setLeftArray(prevArray => [...prevArray, monster]);
                        }
                    }
                })
            } else {
                if(res.data.cause === "unauthorized"){
                    navigate("/login");
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    
    useEffect(() => {
        fetchMonsters();

        axios.get(`${apiUrl}/admin/${onglet}/${id}`, {
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
        });

        inputLeft.current?.focus();
    }, [])
    
    return (
        <div className="Attribution">
            <div className="header">
                <h2>Attribution pour l'effet {data.name}</h2>
                <img src={data.image} alt="Image effet" />
            </div>

            <div className="content">
                <div className="left">

                    <Input 
                        id="searchLeft"
                        width={100}
                        type="text"
                        name="searchLeft"
                        value={searchLeft}
                        setValue={handleChange}
                        placeholder="Rechercher un monstre"
                        label="Rechercher un monstre"
                        ref={inputLeft}
                    />

                    <ul>
                        {
                            leftArray.filter((monster: any) => monster.name.toLowerCase().includes(searchLeft.toLowerCase()))
                            .map((monster: any, index) => (
                                <li key={index} className={
                                    selectedMonstersLeft.includes(monster) ? "selected" : ""
                                } onClick={() => {
                                    if(selectedMonstersLeft.includes(monster)){
                                        setSelectedMonstersLeft(selectedMonstersLeft.filter((selectedMonster: any) => selectedMonster !== monster));
                                    } else {
                                        setSelectedMonstersLeft([...selectedMonstersLeft, monster]);
                                    }
                                    inputLeft.current?.focus();
                                }}>
                                    <p>{monster.family_name} - {monster.name} - {
                                        monster.element === "fire" ? "Feu" :
                                        monster.element === "water" ? "Eau" :
                                        monster.element === "wind" ? "Vent" :
                                        monster.element === "light" ? "Lumière" :
                                        monster.element === "dark" ? "Ténèbres" : ""    
                                    }</p>
                                </li>
                            ))
                        }
                    </ul>
                    {
                        selectedMonstersLeft.length !== 0 ? (
                            <p>{selectedMonstersLeft.length} monstre{selectedMonstersLeft.length > 1 ? "s" : ""} sélectionné{selectedMonstersLeft.length > 1 ? "s" : ""}</p>
                        ) : null
                    }
                </div>
                <div className="center">
                    <Button
                        onClick={handleSubmitAddMonsters}
                        disabled={selectedMonstersLeft.length === 0 || status === "pending" || status === "error"}
                    >
                        <FaArrowRight />
                        Ajouter
                    </Button>
                    <Button
                        onClick={handleSubmitRemoveMonsters}
                        disabled={selectedMonstersRight.length === 0 || status === "pending" || status === "error"}
                    >
                        <FaArrowLeft />
                        Retirer
                    </Button>
                </div>
                <div className="right">
                    <Input 
                        id="searchRight"
                        width={100}
                        type="text"
                        name="searchRight"
                        value={searchRight}
                        setValue={handleChange}
                        placeholder="Rechercher un monstre"
                        label="Rechercher un monstre"
                        ref={inputRight}
                    />

                    <ul>
                        {
                            rightArray.length === 0 ? <p>Aucun monstre</p> : (
                                rightArray.filter((monster: any) => monster.name.toLowerCase().includes(searchRight.toLowerCase()))
                                .map((monster: any, index) => (
                                    <li key={index} className={
                                        selectedMonstersRight.includes(monster) ? "selected" : ""
                                    } onClick={() => {
                                        if(selectedMonstersRight.includes(monster)){
                                            setSelectedMonstersRight(selectedMonstersRight.filter((selectedMonster: any) => selectedMonster !== monster));
                                        } else {
                                            setSelectedMonstersRight([...selectedMonstersRight, monster]);
                                        }
                                        inputRight.current?.focus();
                                    }}>
                                        <p>{monster.family_name} - {monster.name} - {
                                        monster.element === "fire" ? "Feu" :
                                        monster.element === "water" ? "Eau" :
                                        monster.element === "wind" ? "Vent" :
                                        monster.element === "light" ? "Lumière" :
                                        monster.element === "dark" ? "Ténèbres" : ""    
                                    }</p>
                                    </li>
                                ))
                            )
                        }
                    </ul>
                    {
                        selectedMonstersRight.length !== 0 ? (
                            <p>{selectedMonstersRight.length} monstre{selectedMonstersRight.length > 1 ? "s" : ""} sélectionné{selectedMonstersRight.length > 1 ? "s" : ""}</p>
                        ) : null
                    }
                </div>
            </div>

            <div className="error">
                {error}
            </div>
        </div>
    )
}

export default Attribution;