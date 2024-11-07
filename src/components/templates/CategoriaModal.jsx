import React from 'react';
import { ModalAcciones } from '../organismos/Modal';
import FormCategoria from '../moleculas/FormCategoria';

function CategoriaModal({ open, onClose, handleSubmit, actionLabel, title, initialData, mode }) {
    return (
        <>
            <ModalAcciones open={open} title={title} onClose={onClose} >
                <FormCategoria initialData={initialData} mode={mode} handleSubmit={handleSubmit} onClose={onClose} actionLabel={actionLabel} />
            </ModalAcciones>
        </>
    );
}

export default CategoriaModal;
