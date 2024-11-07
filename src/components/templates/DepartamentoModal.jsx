import React from 'react';
import FormDepartamentos from '../moleculas/FormDepartamento.jsx';
import { ModalAcciones } from '../organismos/Modal.jsx';
//se renderiza el formulario
function DepartamentoModal({ open, onClose, handleSubmit, actionLabel, title, initialData, mode }) {
    return (
        <>
            <ModalAcciones open={open} title={title} onClose={onClose} >
                <FormDepartamentos initialData={initialData} mode={mode} handleSubmit={handleSubmit} onClose={onClose} actionLabel={actionLabel} />
            </ModalAcciones>

        </>
    )
}
export default DepartamentoModal