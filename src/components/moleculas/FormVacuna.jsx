import React, { useEffect, useState, useContext } from 'react';
import { ModalFooter, Button, Input } from "@nextui-org/react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import axiosClient from '../axiosClient';
import VacunasContext from '../../context/VacunasContext';

// Esquema de validación con Yup
const validationSchema = yup.object().shape({
    fk_id_mascota: yup
        .string()
        .required('La mascota es obligatoria'),
    fecha_vacuna: yup
        .date()
        .required('La fecha de la vacuna es obligatoria'),
    enfermedad: yup
        .string()
        .required('La enfermedad es obligatoria')
        .matches(/^[a-zA-Z\s]{1,20}$/, 'El nombre de la enfermedad debe tener máximo 20 caracteres, y solo puede contener letras y espacios'),
    estado: yup
        .string()
        .required('El estado de la vacuna es obligatorio')
});

const FormVacunas = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const [mascotas, setMascotas] = useState([]);
    const [estado, setEstado] = useState([]);

    const { idVacuna } = useContext(VacunasContext);

    useEffect(() => {
        const enumData = [
            { value: 'Completa', label: 'Completa' },
            { value: 'Incompleta', label: 'Incompleta' },
            { value: 'En proceso', label: 'En proceso' },
            // { value: 'no se', label: 'no se' },
        ];
        setEstado(enumData);
    }, []);

    useEffect(() => {
        axiosClient.get('/mascotas/listar').then((response) => {
            const mascotaFilter = response.data.filter((mascota) => mascota.estado !== 'Adoptado');
            setMascotas(mascotaFilter);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            fk_id_mascota: '',
            fecha_vacuna: '',
            enfermedad: '',
            estado: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            handleSubmit(values);
            resetForm();
        },
    });

    useEffect(() => {
        if (mode === 'update' && idVacuna) {
            formik.setValues({
                fk_id_mascota: idVacuna.fk_id_mascota || '',
                fecha_vacuna: idVacuna.fecha_vacuna ? new Date(idVacuna.fecha_vacuna).toISOString().split('T')[0] : '',
                enfermedad: idVacuna.enfermedad || '',
                estado: idVacuna.estado || '',
            });
        }
    }, [mode, idVacuna]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='ml-5 align-items-center'>
                <div className="py-2">
                    <select
                        className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                        name="fk_id_mascota"
                        value={formik.values.fk_id_mascota}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.fk_id_mascota && !!formik.errors.fk_id_mascota}
                        required
                    >
                        <option value="" hidden className="text-gray-600">
                            Seleccionar Mascota
                        </option>
                        {mascotas.map(masco => (
                            <option key={masco.id_mascota} value={masco.id_mascota}>
                                {masco.nombre_mascota}
                            </option>
                        ))}
                    </select>
                    {formik.touched.fk_id_mascota && formik.errors.fk_id_mascota ? (
                        <div className="text-red-500 text-xs">{formik.errors.fk_id_mascota}</div>
                    ) : null}
                </div>
                <div className='py-2'>Fecha Aplicacion de la Vacuna
                    <input
                        type="date"
                        className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                        id='fecha_vacuna'
                        name="fecha_vacuna"
                        value={formik.values.fecha_vacuna}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.fecha_vacuna && !!formik.errors.fecha_vacuna}
                        required
                    />
                    {formik.touched.fecha_vacuna && formik.errors.fecha_vacuna ? (
                        <div className="text-red-500 text-xs">{formik.errors.fecha_vacuna}</div>
                    ) : null}
                </div>
                <div className='py-2'>
                    <Input
                        className='w-80'
                        color='warning'
                        variant="bordered"
                        type="text"
                        label='Ingrese la enfermedad'
                        id='enfermedad'
                        name="enfermedad"
                        value={formik.values.enfermedad}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.enfermedad && !!formik.errors.enfermedad}
                        errorMessage={formik.errors.enfermedad}
                        required
                    />
                </div>
                <div className="py-2">
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                        name="estado"
                        value={formik.values.estado}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.estado && !!formik.errors.estado}
                        required
                    >
                        <option value="" disabled hidden>
                            Seleccionar estado de la vacuna
                        </option>
                        {estado.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                    {formik.touched.estado && formik.errors.estado ? (
                        <div className="text-red-500 text-xs">{formik.errors.estado}</div>
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

export default FormVacunas;
