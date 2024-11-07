import React from 'react';
import { ModalAcciones } from '../organismos/ModalMascota';
import ListMascota from '../moleculas/ListMascota';

function ListMascotaModal({ open, onClose, handleSubmit, actionLabel, title, initialData, mode }) {
    return (
        <>
            <ModalAcciones open={open} title={title} onClose={onClose} >
                <ListMascota initialData={initialData} mode={mode} handleSubmit={handleSubmit} onClose={onClose} actionLabel={actionLabel} />
            </ModalAcciones>
        </>
    )
}

export default ListMascotaModal;
