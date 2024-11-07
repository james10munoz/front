import React, { useEffect, useContext } from 'react';
import { ModalFooter, Button, Input } from "@nextui-org/react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import CategoriaContext from '../../context/CategoriaContext';

// Define the validation schema with yup
const validationSchema = yup.object().shape({
    nombre_categoria: yup
        .string()
        .required('El nombre de la categoría es obligatorio')
        .matches(/^[a-zA-Z\s]{1,50}$/, 'El nombre de la categoría debe tener máximo 50 caracteres, y solo puede contener letras y espacios'),
    estado: yup
        .string()
        .required('El estado de la categoría es obligatorio')
});

const FormCategoria = ({ mode, handleSubmit, onClose, actionLabel, initialData }) => {
    // Initialize formik with initial values and validation schema
    const formik = useFormik({
        initialValues: {
            nombre_categoria: '',
            estado: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    // Set form values when mode is 'update' and initialData is provided
    useEffect(() => {
        if (mode === 'update' && initialData) {
            formik.setValues({
                nombre_categoria: initialData.nombre_categoria,
                estado: initialData.estado
            });
        }
    }, [mode, initialData]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='ml-5 align-items-center'>
                <div className="py-2">
                    <Input
                        className='w-80'
                        color='warning'
                        variant="bordered"
                        type="text"
                        label='Nombre de la categoría'
                        id='nombre_categoria'
                        name="nombre_categoria"
                        value={formik.values.nombre_categoria}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.nombre_categoria && !!formik.errors.nombre_categoria}
                        errorMessage={formik.errors.nombre_categoria}
                    />
                </div>
                <div className='py-2'>
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                        name="estado"
                        value={formik.values.estado}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    >
                        <option value="" hidden>
                            Seleccionar Estado
                        </option>
                        <option value="activa">Activa</option>
                        <option value="inactiva">Inactiva</option>
                    </select>
                    {formik.touched.estado && formik.errors.estado && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.estado}</div>
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

export default FormCategoria;
