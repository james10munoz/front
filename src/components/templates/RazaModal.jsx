import React from 'react';
import FormRazas from '../moleculas/FormRaza.jsx';
import { ModalAcciones } from '../organismos/Modal.jsx';
//se renderiza el formulario
function RazaModal({ open, onClose, handleSubmit, actionLabel, title, initialData, mode }) {
    return (
        <>
            <ModalAcciones open={open} title={title} onClose={onClose} >
                <FormRazas initialData={initialData} mode={mode} handleSubmit={handleSubmit} onClose={onClose} actionLabel={actionLabel} />
            </ModalAcciones>

        </>
    )
}
export default RazaModal