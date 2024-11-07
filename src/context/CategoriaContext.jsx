import React, { createContext, useState } from 'react';
import axiosClient from '../components/axiosClient';

const CategoriasContext = createContext();

export const CategoriasProvider = ({ children }) => {
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState({});
    const [idCategoria, setCategoriaId] = useState(null);

    const getCategorias = async () => {
        try {
            const response = await axiosClient.get('/categorias/listar');
            console.log(response.data);
            setCategorias(response.data);
        } catch (error) {
            console.error('Error del servidor: ' + error);
        }
    };

    const getCategoria = async (id_categoria) => {
        try {
            const response = await axiosClient.get(`/categorias/buscar/${id_categoria}`);
            console.log(response.data);
            setCategoria(response.data);
        } catch (error) {
            console.error('Error: ' + error);
        }
    };

    return (
        <CategoriasContext.Provider
            value={{
                categorias,
                categoria,
                idCategoria,
                setCategorias,
                setCategoria,
                setCategoriaId,
                getCategorias,
                getCategoria,
            }}
        >
            {children}
        </CategoriasContext.Provider>
    );
};

export default CategoriasContext;
