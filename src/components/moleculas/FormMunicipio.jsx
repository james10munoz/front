import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../axiosClient';
import { ModalFooter, Button, Input } from "@nextui-org/react";
import MunicipiosContext from '../../context/MunicipiosContext';
import { useFormik } from 'formik';
import * as yup from 'yup';



const FormMunicipios = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const { idMunicipio } = useContext(MunicipiosContext);

    // Esquema de validación con yup
    const validationSchema = yup.object().shape({
        nombre_municipio: yup
            .string()
            .required('El nombre del municipio es obligatorio')
            .matches(/^[a-zA-Z\s]{1,50}$/, 'El nombre del municipio debe tener máximo 50 caracteres, y solo puede contener letras y espacios'),
        codigo_dane: yup
            .string()
            .required('El código DANE es obligatorio')
            .matches(/^\d{1,10}$/, 'El código DANE debe tener máximo 10 caracteres numéricos'),
        fk_id_departamento: yup
            .string()
            .required('Seleccionar un departamento es obligatorio')
    });

    useEffect(() => {
        // Obtener departamentos disponibles para asociar con el municipio
        axiosClient.get('/departamentos/listar')
            .then((response) => {
                setDepartamentos(response.data);
            })
            .catch((error) => {
                console.log('Error fetching departments: ', error);
            });
    }, []);

    const formik = useFormik({
        initialValues: {
            nombre_municipio: '',
            codigo_dane: '',
            fk_id_departamento: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            handleSubmit(values);
            resetForm();
        },
    });

    useEffect(() => {
        if (mode === 'update' && idMunicipio) {
            formik.setValues({
                nombre_municipio: idMunicipio.nombre_municipio,
                codigo_dane: idMunicipio.codigo_dane,
                fk_id_departamento: idMunicipio.fk_id_departamento,
            });
        }
    }, [mode, idMunicipio]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='ml-5 align-items-center'>
                <div className="py-2">
                    <Input
                        className='w-80'
                        color='warning'
                        variant="bordered"
                        type="text"
                        label='Nombre del Municipio'
                        id='nombre_municipio'
                        name="nombre_municipio"
                        value={formik.values.nombre_municipio}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.nombre_municipio && !!formik.errors.nombre_municipio}
                        errorMessage={formik.errors.nombre_municipio}
                    />
                </div>
                <div className="py-2">
                    <Input
                        className='w-80'
                        color='warning'
                        variant="bordered"
                        type="text"
                        label='Código DANE'
                        id='codigo_dane'
                        name="codigo_dane"
                        value={formik.values.codigo_dane}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.codigo_dane && !!formik.errors.codigo_dane}
                        errorMessage={formik.errors.codigo_dane}
                    />
                </div>
                <div className='py-2'>
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                        name="fk_id_departamento"
                        value={formik.values.fk_id_departamento}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.fk_id_departamento && !!formik.errors.fk_id_departamento}
                    >
                        <option value="" hidden>
                            Seleccionar Departamento
                        </option>
                        {departamentos.map(departamento => (
                            <option key={departamento.id_departamento} value={departamento.id_departamento}>
                                {departamento.nombre_departamento}
                            </option>
                        ))}
                    </select>
                    {formik.touched.fk_id_departamento && formik.errors.fk_id_departamento && (
                        <div className="text-red-500 text-xs mt-1">
                            {formik.errors.fk_id_departamento}
                        </div>
                    )}
                </div>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                    </Button>
                    <Button type="submit" color="warning" className='text-white p-2'>
                        {actionLabel}
                    </Button>
                </ModalFooter>
            </div>
        </form>
    );
};

export default FormMunicipios;
