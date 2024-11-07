import React, { createContext, useState } from 'react'
import axiosClient from '../components/axiosClient'


const MunicipiosContext = createContext()

export const MunicipiosProvider = ({ children }) => {

    const [municipios, setMunicipios] = useState([])
    const [municipio, setMunicipio] = useState([])
    const [idMunicipio, setMunicipioId] = useState([])

    const getMunicipios = () => {
        try {
            axiosClient.get('/municipios/listar').then((response) => {
                console.log(response.data)
                setMunicipios(response.data)
            })
        } catch (error) {
            console.log('Error del servidor' + error);
        }
    }

    const getMunicipio = (id_municipio) => {
        try {
            axiosClient.get(`/municipios/buscar/${id_municipio}`).then((response) => {
                console.log(response.data)
                setMunicipio(response.data)
            })
        } catch (error) {
            console.log('Error' + error);
        }
    }
    return (
        <MunicipiosContext.Provider
            value={{
                municipios,
                municipio,
                idMunicipio,
                setMunicipios,
                setMunicipio,
                setMunicipioId,
                getMunicipios,
                getMunicipio
            }}
        >
            {children}
        </MunicipiosContext.Provider>
    )
}

export default MunicipiosContext
