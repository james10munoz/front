import React, { createContext, useState } from 'react'
import axiosClient from '../components/axiosClient'


const AdopcionesContext = createContext()

export const AdopcionesProvider = ({ children }) => {

    const [adopciones, setAdopciones] = useState([])
    const [adopcion, setAdopcion] = useState([])
    const [idAdopcion, setAdopcionId] = useState([])

    const getAdopciones = () => {
        try {
            axiosClient.get('/adopciones/listar').then((response) => {
                console.log(response.data)
                setAdopciones(response.data)
            })
        } catch (error) {
            console.log('Error del servidor' + error);
        }
    }

    const getAdopcion = (id_adopcion) => {
        try {
            axiosClient.get(`/adopciones/buscar/${id_adopcion}`).then((response) => {
                console.log(response.data)
                setAdopcion(response.data)
            })
        } catch (error) {
            console.log('Error' + error);
        }
    }
    return (
        <AdopcionesContext.Provider
            value={{
                adopciones,
                adopcion,
                idAdopcion,
                setAdopciones,
                setAdopcion,
                setAdopcionId,
                getAdopciones,
                getAdopcion
            }}
        >
            {children}
        </AdopcionesContext.Provider>
    )
}

export default AdopcionesContext
