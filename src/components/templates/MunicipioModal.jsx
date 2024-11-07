import React from 'react';
import FormMunicipios from '../moleculas/FormMunicipio.jsx';
import { ModalAcciones } from '../organismos/Modal.jsx';
//se renderiza el formulario
function MunicipioModal({ open, onClose, handleSubmit, actionLabel, title, initialData, mode }) {
    return (
        <>
            <ModalAcciones open={open} title={title} onClose={onClose} >
                <FormMunicipios initialData={initialData} mode={mode} handleSubmit={handleSubmit} onClose={onClose} actionLabel={actionLabel} />
            </ModalAcciones>

        </>
    )
}
export default MunicipioModal