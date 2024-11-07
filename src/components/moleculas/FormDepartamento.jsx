import React, { useEffect, useContext } from 'react';
import { ModalFooter, Button, Input } from "@nextui-org/react";
import { useFormik } from 'formik';
import DepartamentosContext from '../../context/DepartamentosContext';
import * as yup from 'yup';

const FormDepartamentos = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const { idDepartamento } = useContext(DepartamentosContext);

    // Esquema de validación con yup
    const validationSchema = yup.object().shape({
        nombre_departamento: yup
            .string()
            .required('El nombre del departamento es obligatorio')
            .matches(/^[a-zA-Z\s]{1,50}$/, 'El nombre del departamento debe tener máximo 50 caracteres, y solo puede contener letras y espacios'),
        codigo_dane: yup
            .string()
            .required('El código DANE es obligatorio')
            .matches(/^\d{1,10}$/, 'El código DANE debe tener máximo 10 caracteres numéricos')
    });

    const formik = useFormik({
        initialValues: {
            nombre_departamento: '',
            codigo_dane: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        if (mode === 'update' && idDepartamento) {
            formik.setValues({
                nombre_departamento: idDepartamento.nombre_departamento,
                codigo_dane: idDepartamento.codigo_dane,
            });
        }
    }, [mode, idDepartamento]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='ml-5 align-items-center'>
                <div className="py-2">
                    <Input
                        className='w-80'
                        color='warning'
                        variant="bordered"
                        type="text"
                        label='Nombre del Departamento'
                        id='nombre_departamento'
                        name="nombre_departamento"
                        value={formik.values.nombre_departamento}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.nombre_departamento && !!formik.errors.nombre_departamento}
                        errorMessage={formik.errors.nombre_departamento}
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

export default FormDepartamentos;
