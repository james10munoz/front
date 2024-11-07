import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imagenes from '../../styles/imagenes';
import iconos from '../../styles/iconos';
import Icon from '../atomos/IconVolver';
import axiosClient from '../axiosClient';
import { EyeFilledIcon } from '../nextUI/EyeFilledIcon';
import { CameraIcon } from '../nextUI/CameraIcon.jsx';
import { EyeSlashFilledIcon } from '../nextUI/EyeSlashFilledIcon';
import { Input, Select, SelectItem, Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as yup from 'yup';

function RegistroUser() {
    const navigate = useNavigate();

    const typeDocument = [
        { key: "tarjeta", label: "Tarjeta de Identidad" },
        { key: "cedula", label: "Cédula de Ciudadanía" },
        { key: "tarjeta_de_extranjeria", label: "Tarjeta de Extranjería" },
    ];

    const [foto, setFoto] = useState(null);
    const [fotoUrl, setFotoUrl] = useState('');
    const fileInputRef = useRef(null);

    const validationSchema = yup.object({
        nombre: yup.string()
            .matches(/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras y espacios')
            .required('El nombre es obligatorio'),
        apellido: yup.string()
            .matches(/^[a-zA-Z\s]+$/, 'El apellido solo puede contener letras y espacios')
            .required('El apellido es obligatorio'),
        direccion: yup.string().required('La dirección es obligatoria'),
        correo: yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
        telefono: yup.string()
            .matches(/^[0-9]{10}$/, 'El teléfono debe contener exactamente 10 dígitos')
            .required('El teléfono es obligatorio'),
        documento_identidad: yup.string()
            .matches(/^[0-9]{10}$/, 'La identificación debe contener exactamente 10 dígitos')
            .required('La identificación es obligatoria'),
        password: yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(16, 'La contraseña no puede tener más de 16 caracteres').required('La contraseña es obligatoria'),
        tipo_documento: yup.string().required('Debe seleccionar un tipo de documento')
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            direccion: '',
            correo: '',
            telefono: '',
            documento_identidad: '',
            password: '',
            tipo_documento: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const { data: correoExiste } = await axiosClient.get(`/usuarios/verificar/correo/${values.correo}`);
            if (correoExiste.existe) {
                Swal.fire({
                    position: "top-center",
                    icon: 'warning',
                    title: 'El correo electrónico ya está registrado',
                    text: 'Por favor, utilice otro correo electrónico.',
                    showConfirmButton: true
                });
                return;
            }

            const { data: documentoExiste } = await axiosClient.get(`/usuarios/verificar/documento_identidad/${values.documento_identidad}`);
            if (documentoExiste.existe) {
                Swal.fire({
                    position: "top-center",
                    icon: 'warning',
                    title: 'El documento de identidad ya está registrado',
                    text: 'Por favor, utilice otro documento de identidad.',
                    showConfirmButton: true
                });
                return;
            }

            if (!foto) {
                Swal.fire({
                    position: "top-center",
                    icon: 'warning',
                    title: 'Debe seleccionar una imagen',
                    text: 'Por favor, seleccione una imagen antes de continuar.',
                    showConfirmButton: true
                });
                return;
            }

            const formDataUser = new FormData();
            formDataUser.append('nombre', values.nombre);
            formDataUser.append('apellido', values.apellido);
            formDataUser.append('direccion', values.direccion);
            formDataUser.append('correo', values.correo);
            formDataUser.append('telefono', values.telefono);
            formDataUser.append('documento_identidad', values.documento_identidad);
            formDataUser.append('password', values.password);
            formDataUser.append('rol', 'usuario');
            formDataUser.append('tipo_documento', values.tipo_documento);
            if (foto) {
                formDataUser.append('img', foto);
            }

            try {
                const response = await axiosClient.post('/usuarios/registrar', formDataUser);
                Swal.fire({
                    position: "top-center",
                    icon: 'success',
                    title: 'Usuario registrado con éxito',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/iniciosesion');
            } catch (error) {
                Swal.fire({
                    position: "top-center",
                    icon: 'error',
                    title: 'Error al registrar usuario, intente de nuevo',
                    text: 'Por favor, intente nuevamente.',
                    showConfirmButton: true
                });
            }
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFoto(file);
        if (file) {
            setFotoUrl(URL.createObjectURL(file));
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div className="flex items-center justify-center bg-gradient-to-r from-teal-700 via-emerald-600 to-amber-600 min-h-screen p-2 w-full">
            <div className="relative flex flex-col m-2 space-y-5 bg-[#ffffff] shadow-xl rounded-2xl p-3">
                <div className="flex flex-col p-4 md:p-10">
                    <Link className="mb-2" to="/">
                        <Icon icon={iconos.iconoVolver} className="w-6 h-6 text-[#00000]" />
                    </Link>
                    <span className="mb-2 text-4xl font-bold text-center text-[#00000]">Registro</span>
                    <form onSubmit={formik.handleSubmit}>
                        {/* Avatar con imagen */}
                        <div className="flex flex-col items-center mb-4">
                            <Avatar
                                showFallback
                                className="w-24 h-24 cursor-pointer mb-4 border-4 border-[#0070f3]"
                                onClick={handleClick}
                                src={fotoUrl || 'https://images.unsplash.com/broken'}
                                fallback={
                                    <CameraIcon className="animate-pulse w-12 h-12 text-[#0070f3]" fill="currentColor" size={20} />
                                }
                            />
                            <input
                                type="file"
                                accept="image/*"
                                name="img"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* Campo Nombre */}
                        <div className="py-2">
                            <Input
                                type="text"
                                label="Ingrese sus nombres completos"
                                color="primary"
                                variant="bordered"
                                className="w-80"
                                name="nombre"
                                id="nombre"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.nombre && !!formik.errors.nombre}
                                errorMessage={formik.errors.nombre}
                            />
                        </div>

                        {/* Campo Apellido */}
                        <div className="py-2">
                            <Input
                                type="text"
                                label="Ingrese sus apellidos completos"
                                color="primary"
                                variant="bordered"
                                className="w-80"
                                name="apellido"
                                id="apellido"
                                value={formik.values.apellido}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.apellido && !!formik.errors.apellido}
                                errorMessage={formik.errors.apellido}
                            />
                        </div>

                        {/* Campo Correo */}
                        <div className="py-2">
                            <Input
                                type="email"
                                label="Ingrese su correo"
                                color="primary"
                                variant="bordered"
                                className="w-80"
                                name="correo"
                                id="correo"
                                value={formik.values.correo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.correo && !!formik.errors.correo}
                                errorMessage={formik.errors.correo}
                            />
                        </div>

                        {/* Campo Dirección */}
                        <div className="py-2">
                            <Input
                                type="text"
                                label="Ingrese su dirección"
                                color="primary"
                                variant="bordered"
                                className="w-80"
                                name="direccion"
                                id="direccion"
                                value={formik.values.direccion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.direccion && !!formik.errors.direccion}
                                errorMessage={formik.errors.direccion}
                            />
                        </div>

                        {/* Campo Teléfono */}
                        <div className="py-2">
                            <Input
                                type="tel"
                                label="Ingrese su teléfono"
                                color="primary"
                                variant="bordered"
                                className="w-80"
                                name="telefono"
                                id="telefono"
                                value={formik.values.telefono}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.telefono && !!formik.errors.telefono}
                                errorMessage={formik.errors.telefono}
                            />
                        </div>

                        {/* Campo Tipo de Documento */}
                        <Select
                            label="Seleccione su tipo de documento"
                            color="primary"
                            variant="bordered"
                            className="w-80"
                            placeholder="Seleccione una opción"
                            name="tipo_documento"
                            id="tipo_documento"
                            value={formik.values.tipo_documento}  // Asegúrate de que sea una cadena
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.tipo_documento && !!formik.errors.tipo_documento}
                            errorMessage={formik.errors.tipo_documento}
                            >
                            {typeDocument.map((tipo) => (
                                <SelectItem key={tipo.key} value={tipo.key}>
                                {tipo.label}
                                </SelectItem>
                            ))}
                        </Select>

                        {/* Campo Documento de Identidad */}
                        <div className="py-2">
                            <Input
                                type="text"
                                label="Ingrese su documento de identidad"
                                color="primary"
                                variant="bordered"
                                className="w-80"
                                name="documento_identidad"
                                id="documento_identidad"
                                value={formik.values.documento_identidad}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.documento_identidad && !!formik.errors.documento_identidad}
                                errorMessage={formik.errors.documento_identidad}
                            />
                        </div>

                         {/* Campo Rol */}
                         <Select
                            color="warning"
                            variant="bordered"
                            className='w-80'
                            label='Usuario'
                            isDisabled
                        />

                        {/* Campo Contraseña */}
                        <div className="py-2">
                            <Input
                                type={isVisible ? 'text' : 'password'}
                                label="Ingrese su contraseña"
                                color="primary"
                                variant="bordered"
                                className="w-80"
                                name="password"
                                id="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.password && !!formik.errors.password}
                                errorMessage={formik.errors.password}
                                endContent={
                                    <button
                                        type="button"
                                        className="focus:outline-none"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? <EyeFilledIcon size={20} fill="currentColor" /> : <EyeSlashFilledIcon size={20} fill="currentColor" />}
                                    </button>
                                }
                            />
                        </div>

                        <div className="py-4">
                            <Button
                                type="submit"
                                color="primary"
                                variant="flat"
                                className="w-80 bg-gradient-to-r from-[#0070f3] to-[#0070f3] text-white"
                            >
                                Registrarse
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegistroUser;
