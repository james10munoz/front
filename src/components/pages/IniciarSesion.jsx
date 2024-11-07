import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imagenes from '../../styles/imagenes';
import iconos from '../../styles/iconos';
import Icon from '../atomos/IconVolver';
import axiosClient from '../axiosClient';
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from '../nextUI/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../nextUI/EyeSlashFilledIcon';
import { Button } from "@nextui-org/button";
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as yup from 'yup';

function IniciarSesion() {
    const navigate = useNavigate();

    // Esquema de validación con Yup
    const validationSchema = yup.object({
        correo: yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
        password: yup.string().required('La contraseña es obligatoria')
    });

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            correo: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axiosClient.post('/validacion', values);
                console.log('Datos enviados en la validación: ', response);

                if (response.status === 200) {
                    const { token, user } = response.data;
                    const userInfo = user[0] || user;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(userInfo));

                    const userRol = userInfo.rol;

                    if (userRol === 'usuario') {
                        navigate('/listmascotas');
                    } else if (userRol === 'administrador') {
                        navigate('/mascotas');
                    } else if (userRol === 'superusuario') {
                        navigate('/usuarios');
                    }

                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: `Bienvenido ${userRol}`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    console.log('Response', response);
                    Swal.fire({
                        position: "top-center",
                        icon: "error",
                        title: "Datos Incorrectos",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                Swal.fire({
                    position: "top-center",
                    icon: "error",
                    title: "Error en la solicitud",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    });

    // Estado para visibilidad de la contraseña
    const [isVisible, setIsVisible] = useState(false);

    // Alternar visibilidad de la contraseña
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 via-green-500 to-teal-400 min-h-screen p-4 w-full">
            <div className='relative flex flex-col m-2 space-y-5 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 overflow-hidden'>
                <div className="flex justify-center flex-col p-8 md:p-10 bg-gradient-to-tl from-white to-gray-100">
                    <Link className='mb-4' to='/'>
                        <Icon icon={iconos.iconoVolver} className='w-8 h-8 text-gray-700 hover:text-gray-900 transition-colors duration-300' />
                    </Link>

                    <h1 className="text-4xl font-bold text-gray-800 mb-6">Inicio De Sesión</h1>
                    <div className="flex justify-center mb-8">
                        <img src={imagenes.imgPrincipalPets} className='w-64 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300' alt="Imagen de Mascotas" />
                    </div>
                    <div className="py-2">
                        <Input
                            type='email'
                            label='Ingrese su correo'
                            color="primary"
                            variant="bordered"
                            className='w-80'
                            name='correo'
                            id='correo'
                            value={formik.values.correo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.correo && !!formik.errors.correo}
                            errorMessage={formik.errors.correo}
                        />
                    </div>

                    <div className="py-2">
                        <Input
                            label='Ingrese su contraseña'
                            color="primary"
                            variant="bordered"
                            name='password'
                            id='password'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.password && !!formik.errors.password}
                            errorMessage={formik.errors.password}
                            endContent={
                                <button type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none mb-2" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="max-w-xs"
                        />
                    </div>
                    
                    <Button color="primary" className='mt-6 w-full text-white p-3 font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300' onClick={formik.handleSubmit}>
                        Ingresar
                    </Button>
                </div>
                
            </div>
        </div>
    );
}

export default IniciarSesion;
