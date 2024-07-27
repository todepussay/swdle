import React from 'react';
import Button from '@components/admin/Button';
import { IoIosClose } from "react-icons/io";
import '@styles/admin/Modal.css';

interface ModalProps {
    title: string;
    children: React.ReactNode;
    closeModal: () => void;
    large?: boolean;
}

function Modal({ title, children, closeModal, large=false }: ModalProps){
    return (
        <div className='Modal'>
            <div className="modal-content" style={{
            width: large ? '70%' : '40%',
            height: large ? '80%' : '30%'
        }}>
                <div className="modal-header">
                    <h2>{title}</h2>

                    <Button color="danger" onClick={() => {
                        closeModal();
                    }}>
                        Fermer
                        <IoIosClose />
                    </Button>
                </div>

                <div className="modal-body" style={{
                    height: large ? '89%' : '65%'
                }}>
                    {children}
                </div>
            </div>
            <div className="modal-background"></div>
        </div>
    )    
}

export default Modal;