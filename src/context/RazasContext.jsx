import React, { createContext, useState } from 'react'
import axiosClient from '../components/axiosClient'


const RazasContext = createContext()

export const RazasProvider = ({ children }) => {

    const [razas, setRazas] = useState([])
    const [raza, setRaza] = useState([])
    const [idRaza, setRazaId] = useState([])

    const getRazas = () => {
        try {
            axiosClient.get('/razas/listar').then((response) => {
                console.log(response.data)
                setRazas(response.data)
            })
        } catch (error) {
            console.log('Error del servidor' + error);
        }
    }

    const getRaza = (id_raza) => {
        try {
            axiosClient.get(`/razas/buscar/${id_raza}`).then((response) => {
                console.log(response.data)
                setRaza(response.data)
            })
        } catch (error) {
            console.log('Error' + error);
        }
    }
    return (
        <RazasContext.Provider
            value={{
                razas,
                raza,
                idRaza,
                setRazas,
                setRaza,
                setRazaId,
                getRazas,
                getRaza
            }}
        >
            {children}
        </RazasContext.Provider>
    )
}

export default RazasContext
