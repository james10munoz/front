import React, { createContext, useState } from 'react'
import axiosClient from '../components/axiosClient'


const DepartamentosContext = createContext()

export const DepartamentosProvider = ({ children }) => {

    const [departamentos, setDepartamentos] = useState([])
    const [departamento, setDepartamento] = useState([])
    const [idDepartamento, setDepartamentoId] = useState([])

    const getDepartamentos = () => {
        try {
            axiosClient.get('/departamentos/listar').then((response) => {
                console.log(response.data)
                setDepartamentos(response.data)
            })
        } catch (error) {
            console.log('Error del servidor' + error);
        }
    }

    const getDepartamento = (id_departamento) => {
        try {
            axiosClient.get(`/departamentos/buscar/${id_departamento}`).then((response) => {
                console.log(response.data)
                setDepartamento(response.data)
            })
        } catch (error) {
            console.log('Error' + error);
        }
    }
    return (
        <DepartamentosContext.Provider
            value={{
                departamentos,
                departamento,
                idDepartamento,
                setDepartamentos,
                setDepartamento,
                setDepartamentoId,
                getDepartamentos,
                getDepartamento
            }}
        >
            {children}
        </DepartamentosContext.Provider>
    )
}

export default DepartamentosContext
