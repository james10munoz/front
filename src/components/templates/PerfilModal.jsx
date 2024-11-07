import React from 'react';
import FormUsuarios from '../moleculas/FormPerfil.jsx';
import { ModalAcciones } from '../organismos/ModalUsuario.jsx';

function PerfilModal({ open, onClose, handleSubmit, title, initialData, mode, refreshPerfil }) {
  const handleClose = () => {
    onClose();
    refreshPerfil();
  };

  return (
    <ModalAcciones open={open} title={title} onClose={handleClose}>
      <div style={{ maxHeight: '80vh', overflowY: 'auto' }}> {/* Estilo agregado */}
        <FormUsuarios 
          initialData={initialData} 
          mode={mode} 
          handleSubmit={handleSubmit} 
          onClose={handleClose} 
        />
      </div>
    </ModalAcciones>
  );
}

export default PerfilModal;
