// src/components/ModoInvitado.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ModoInvitado = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir a la lista de mascotas al montar el componente
        navigate('/listmascotas');
    }, [navigate]);

    return null; // Este componente no renderiza nada
};

export default ModoInvitado;
