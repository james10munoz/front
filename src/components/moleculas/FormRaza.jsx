import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../axiosClient'; // Asegúrate de que axiosClient esté configurado correctamente
import { ModalFooter, Button, Input } from "@nextui-org/react";
import RazasContext from '../../context/RazasContext';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    nombre_raza: yup
        .string()
        .required('El nombre de la raza es obligatorio')
        .matches(/^[a-zA-Z\s]{1,50}$/, 'El nombre de la raza debe tener máximo 50 caracteres, y solo puede contener letras y espacios'),
    fk_id_categoria: yup
        .string()
        .required('La categoría es obligatoria')
});

const FormRazas = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const [categorias, setCategorias] = useState([]);
    const { idRaza } = useContext(RazasContext);

    useEffect(() => {
        // Obtener categorías disponibles para asociar con la raza
        axiosClient.get('/categorias/listar').then((response) => {
            setCategorias(response.data);
        }).catch((error) => {
            console.log('Error fetching categories: ', error);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            nombre_raza: '',
            fk_id_categoria: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        if (mode === 'update' && idRaza) {
            formik.setValues({
                nombre_raza: idRaza.nombre_raza,
                fk_id_categoria: idRaza.fk_id_categoria,
            });
        }
    }, [mode, idRaza]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='ml-5 align-items-center'>
                <div className="py-2">
                    <Input
                        className='w-80'
                        color='warning'
                        variant="bordered"
                        type="text"
                        label='Nombre de la Raza'
                        id='nombre_raza'
                        name="nombre_raza"
                        value={formik.values.nombre_raza}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.nombre_raza && !!formik.errors.nombre_raza}
                        errorMessage={formik.errors.nombre_raza}
                    />
                </div>
                <div className='py-2'>
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                        name="fk_id_categoria"
                        value={formik.values.fk_id_categoria}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.fk_id_categoria && !!formik.errors.fk_id_categoria}
                    >
                        <option value="" hidden>
                            Seleccionar Categoría
                        </option>
                        {categorias.map(categoria => (
                            <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                {categoria.nombre_categoria}
                            </option>
                        ))}
                    </select>
                    {formik.touched.fk_id_categoria && formik.errors.fk_id_categoria ? (
                        <div className="text-red-500">{formik.errors.fk_id_categoria}</div>
                    ) : null}
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

export default FormRazas;
