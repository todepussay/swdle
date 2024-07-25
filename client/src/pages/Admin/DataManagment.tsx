import React, { useEffect, useState } from "react";
import "@styles/admin/DataManagment.css";
import { IoAddCircleOutline } from "react-icons/io5";
import Button from "@components/Button";
import Modal from "@components/admin/Modal";
import { useNavigate } from "react-router-dom";

import TableFamilies from "@components/admin/TableFamilies";
import TableMonsters from "@components/admin/TableMonsters";
import TableSkills from "@components/admin/TableSkills";
import TableBuffs from "@components/admin/TableBuffs";
import TableDebuffs from "@components/admin/TableDebuffs";

import AddFamily from "@components/admin/AddFamily";
import DeleteFamily from "@components/admin/DeleteFamily";
import UpdateFamily from "@components/admin/UpdateFamily";

import AddMonster from "@components/admin/AddMonster";
import DeleteMonster from "@components/admin/DeleteMonster";
import UpdateMonster from "@components/admin/UpdateMonster";

import AddSkill from "@components/admin/AddSkill";
import DeleteSkill from "@components/admin/DeleteSkill";
import UpdateSkill from "@components/admin/UpdateSkill";

import AddBuff from "@components/admin/AddBuff";
import DeleteBuff from "@components/admin/DeleteBuff";
import UpdateBuff from "@components/admin/UpdateBuff";
import Attribution from "@components/admin/Attribution";

import AddDebuff from "@components/admin/AddDebuff";
import DeleteDebuff from "@components/admin/DeleteDebuff";
import UpdateDebuff from "@components/admin/UpdateDebuff";

type DataManagmentProps = {
    onglet: string;
    title: string;
    add: string;
}

function DataManagment({ onglet, title, add }: DataManagmentProps){
    
    const [ addModalOpen, setAddModalOpen ] = useState<boolean>(false);
    const [ deleteModalOpen, setDeleteModalOpen ] = useState<boolean>(false);
    const [ deleteId, setDeleteId ] = useState<number>(0);
    const [ updateModalOpen, setUpdateModalOpen ] = useState<boolean>(false);
    const [ updateId, setUpdateId ] = useState<number>(0);
    const [ attributionModalOpen, setAttributionModalOpen ] = useState<boolean>(false);
    const [ attributionId, setAttributionId ] = useState<number>(0);
    const navigate = useNavigate();
    const [updateData, setUpdateData] = useState<boolean>(false);

    const openModalDelete = (id: number) => {
        setDeleteId(id);
        setDeleteModalOpen(true);
    }

    const openModalUpdate = (id: number) => {
        setUpdateId(id);
        setUpdateModalOpen(true);
    }

    const openModalAttribution = (id: number) => {
        setAttributionId(id);
        setAttributionModalOpen(true);
    }

    useEffect(() => {
        if(addModalOpen){
            setAddModalOpen(false);
        }
    }, [onglet])

    return (
        <div className="DataManagment">

            {
                onglet === "families" ? (
                    addModalOpen ? (
                        <Modal title="Ajout d'une famille" closeModal={() => {setAddModalOpen(false)}} large>
                            <AddFamily closeModal={() => {setAddModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : deleteModalOpen ? (
                        <Modal title="Supprimer une famille" closeModal={() => {setDeleteModalOpen(false)}}>
                            <DeleteFamily id={deleteId} closeModal={() => {setDeleteModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : updateModalOpen ? (
                        <Modal title="Modifier une famille" closeModal={() => {setUpdateModalOpen(false)}} large>
                            <UpdateFamily id={updateId} closeModal={() => {setUpdateModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : null
                ) : onglet === "monsters" ? (
                    addModalOpen ? (
                        <Modal title="Ajout d'un monstre" closeModal={() => {setAddModalOpen(false)}} large>
                            <AddMonster closeModal={() => {setAddModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : deleteModalOpen ? (
                        <Modal title="Supprimer un monstre" closeModal={() => {setDeleteModalOpen(false)}}>
                            <DeleteMonster id={deleteId} closeModal={() => {setDeleteModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : updateModalOpen ? (
                        <Modal title="Modifier un monstre" closeModal={() => {setUpdateModalOpen(false)}} large>
                            <UpdateMonster id={updateId} closeModal={() => {setUpdateModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : null
                ) : onglet === "skills" ? (
                    addModalOpen ? (
                        <Modal title="Ajout d'une compétence" closeModal={() => {setAddModalOpen(false)}} large>
                            <AddSkill closeModal={() => {setAddModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : deleteModalOpen ? (
                        <Modal title="Supprimer une compétence" closeModal={() => {setDeleteModalOpen(false)}}>
                            <DeleteSkill id={deleteId} closeModal={() => {setDeleteModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : updateModalOpen ? (
                        <Modal title="Modifier une compétence" closeModal={() => {setUpdateModalOpen(false)}} large>
                            <UpdateSkill id={updateId} closeModal={() => {setUpdateModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : null
                ) : onglet === "buffs" ? (
                    addModalOpen ? (
                        <Modal title="Ajout d'un effet de renforcement" closeModal={() => {setAddModalOpen(false)}} large>
                            <AddBuff closeModal={() => {setAddModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : deleteModalOpen ? (
                        <Modal title="Supprimer un effet de renforcement" closeModal={() => {setDeleteModalOpen(false)}}>
                            <DeleteBuff id={deleteId} closeModal={() => {setDeleteModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : updateModalOpen ? (
                        <Modal title="Modifier un effet de renforcement" closeModal={() => {setUpdateModalOpen(false)}} large>
                            <UpdateBuff id={updateId} closeModal={() => {setUpdateModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : attributionModalOpen ? (
                        <Modal title="Attribution d'un effet de renforcement" closeModal={() => {setAttributionModalOpen(false)}} large>
                            <Attribution id={attributionId} onglet="buffs" closeModal={() => {setAttributionModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : null
                ) : onglet === "debuffs" ? (
                    addModalOpen ? (
                        <Modal title="Ajout d'un effet nocif" closeModal={() => {setAddModalOpen(false)}} large>
                            <AddDebuff closeModal={() => {setAddModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : deleteModalOpen ? (
                        <Modal title="Supprimer un effet nocif" closeModal={() => {setDeleteModalOpen(false)}}>
                            <DeleteDebuff id={deleteId} closeModal={() => {setDeleteModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : updateModalOpen ? (
                        <Modal title="Modifier un effet nocif" closeModal={() => {setUpdateModalOpen(false)}} large>
                            <UpdateDebuff id={updateId} closeModal={() => {setUpdateModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : attributionModalOpen ? (
                        <Modal title="Attribution d'un effet nocif" closeModal={() => {setAttributionModalOpen(false)}} large>
                            <Attribution id={attributionId} onglet="debuffs" closeModal={() => {setAttributionModalOpen(false)}} updateData={() => setUpdateData((prev) => !prev)} />
                        </Modal>
                    ) : null
                ) : null
            }

            <div className="header">
                <h2>Gestion des données - {title}</h2>

                <Button color="success" onClick={
                    () => {
                        setAddModalOpen(true);
                    }
                }>
                    <IoAddCircleOutline />
                    <span>{add}</span>
                </Button>
            </div>

            {
                onglet === "families" ? <TableFamilies openModalDelete={openModalDelete} openModalUpdate={openModalUpdate} updateData={updateData} /> :
                onglet === "monsters" ? <TableMonsters openModalDelete={openModalDelete} openModalUpdate={openModalUpdate} updateData={updateData} /> : 
                onglet === "skills" ? <TableSkills openModalDelete={openModalDelete} openModalUpdate={openModalUpdate} updateData={updateData} /> : 
                onglet === "buffs" ? <TableBuffs openModalDelete={openModalDelete} openModalUpdate={openModalUpdate} updateData={updateData} openModalAttribution={openModalAttribution} /> : 
                onglet === "debuffs" ? <TableDebuffs openModalDelete={openModalDelete} openModalUpdate={openModalUpdate} updateData={updateData} openModalAttribution={openModalAttribution} /> : null
            }
        </div>
    )
}

export default DataManagment;