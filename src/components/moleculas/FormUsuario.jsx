import React, { useRef, useEffect, useState, useContext } from 'react';
import { ModalFooter, Input, Select, Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import UsuarioContext from '../../context/UsuariosContext.jsx';
import { EyeFilledIcon } from "../nextUI/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../nextUI/EyeSlashFilledIcon";
import axiosClient from '../axiosClient.js';

const FormUsuarios = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const [rol, setRol] = useState([]);
    const [tipo_documento, setTipoDocumento] = useState([]);

    // Estados para los valores de los campos
    const [tipoDocumentoOp, setTipoDocumentoOp] = useState('');
    const [rolOp, setRolOp] = useState('');
    const [documento_identidad, setDocumentoIdentidad] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [direccion, setDireccion] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Mostrar/Ocultar contraseña
    const [foto, setFoto] = useState(null);
    const [fotoUrl, setFotoUrl] = useState('');
    const fileInputRef = useRef(null);

    // Estados para los errores
    const [correoError, setCorreoError] = useState('');
    const [nombreError, setNombreError] = useState('');
    const [apellidoError, setApellidoError] = useState('');
    const [direccionError, setDireccionError] = useState('');
    const [telefonoError, setTelefonoError] = useState('');
    const [documentoError, setDocumentoError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [rolError, setRolError] = useState('');
    const [tipoDocumentoError, setTipoDocumentoError] = useState('');
    const [fotoError, setFotoError] = useState('');

    const { idUsuario } = useContext(UsuarioContext);

    // Cargar tipo de documento y roles
    useEffect(() => {
        const enumDataTipoDocumento = [
            { key: "tarjeta", label: "Tarjeta" },
            { key: "cedula", label: "Cédula" },
            { key: "tarjeta de extranjeria", label: "Tarjeta de extranjería" },
        ];
        setTipoDocumento(enumDataTipoDocumento);
    }, []);

    useEffect(() => {
        const enumDataRol = [
            { key: "superusuario", label: "Super usuario" },
            { key: "administrador", label: "Administrador" },
            { key: "usuario", label: "Usuario" },
        ];
        setRol(enumDataRol);
    }, []);

    // Cargar datos cuando se edita un usuario
    useEffect(() => {
        if (mode === 'update' && idUsuario) {
            setTipoDocumentoOp(idUsuario.tipo_documento || '');
            setDocumentoIdentidad(idUsuario.documento_identidad || '');
            setNombre(idUsuario.nombre || '');
            setApellido(idUsuario.apellido || '');
            setDireccion(idUsuario.direccion || '');
            setCorreo(idUsuario.correo || '');
            setTelefono(idUsuario.telefono || '');
            setPassword('');
            setRolOp(idUsuario.rol || '');
            setFotoUrl(idUsuario.img ? `${axiosClient.defaults.baseURL}/uploads/${idUsuario.img}` : '');
        }
    }, [mode, idUsuario]);

    // Funciones de validación para cada campo
    const handleCorreoChange = (e) => {
        const value = e.target.value;
        setCorreo(value);
        setCorreoError(value.includes('@') ? '' : "El correo debe contener un '@'.");
    };

    const handleNombreChange = (e) => {
        const value = e.target.value;
        setNombre(value);
        setNombreError(value ? '' : 'El nombre es obligatorio.');
    };

    const handleApellidoChange = (e) => {
        const value = e.target.value;
        setApellido(value);
        setApellidoError(value ? '' : 'El apellido es obligatorio.');
    };

    const handleDireccionChange = (e) => {
        const value = e.target.value;
        setDireccion(value);
        setDireccionError(value ? '' : 'La dirección es obligatoria.');
    };

    const handleTelefonoChange = (e) => {
        const value = e.target.value;
        setTelefono(value);
        setTelefonoError(value.length === 10 ? '' : 'El teléfono debe tener 10 dígitos.');
    };

    const handleDocumentoChange = (e) => {
        const value = e.target.value;
        setDocumentoIdentidad(value);
        setDocumentoError(value.length >= 7 && value.length <= 10 ? '' : 'El documento debe tener entre 7 y 10 dígitos.');
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(value.length >= 8 && value.length <= 16 ? '' : 'La contraseña debe tener entre 8 y 16 caracteres.');
    };

    const handleRolChange = (e) => {
        const value = e.target.value;
        setRolOp(value);
        setRolError(value ? '' : 'Debe seleccionar un rol.');
    };

    const handleTipoDocumentoChange = (e) => {
        const value = e.target.value;
        setTipoDocumentoOp(value);
        setTipoDocumentoError(value ? '' : 'Debe seleccionar un tipo de documento.');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validar que los campos estén completos
        if (!correo) setCorreoError('El correo es obligatorio.');
        if (!nombre) setNombreError('El nombre es obligatorio.');
        if (!apellido) setApellidoError('El apellido es obligatorio.');
        if (!direccion) setDireccionError('La dirección es obligatoria.');
        if (!telefono) setTelefonoError('El teléfono es obligatorio.');
        if (!documento_identidad) setDocumentoError('El documento de identidad es obligatorio.');
        if (!password && mode === 'create') setPasswordError('La contraseña es obligatoria.');
        if (!rolOp) setRolError('Debe seleccionar un rol.');
        if (!tipoDocumentoOp) setTipoDocumentoError('Debe seleccionar un tipo de documento.');
        if (mode === 'create' && !foto) setFotoError('Debe cargar una imagen.');

        // Verificar que no haya errores antes de enviar
        if (correoError || nombreError || apellidoError || direccionError || telefonoError || documentoError || passwordError || rolError || tipoDocumentoError || (mode === 'create' && fotoError)) {
            return; // No enviar el formulario si hay errores
        }

        try {
            const formData = new FormData();
            formData.append('tipo_documento', tipoDocumentoOp);
            formData.append('documento_identidad', documento_identidad);
            formData.append('nombre', nombre);
            formData.append('apellido', apellido);
            formData.append('direccion', direccion);
            formData.append('correo', correo);
            formData.append('telefono', telefono);
            if (password) formData.append('password', password); // Enviar la contraseña solo si es necesaria
            formData.append('rol', rolOp);

            if (foto) {
                formData.append('img', foto);
            }

            handleSubmit(formData, e);
        } catch (error) {
            alert('Hay un error en el sistema ' + error);
        }
    };

    return (
        <form method='post' onSubmit={handleFormSubmit}>
            <div className='flex flex-col items-center mb-4'>
                <Avatar
                    showFallback
                    className="w-24 h-24 cursor-pointer mb-4"
                    onClick={() => fileInputRef.current.click()}
                    src={fotoUrl}
                />
                <input
                    type="file"
                    accept="image/*"
                    name="img"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        const file = e.target.files[0];
                        setFoto(file);
                        setFotoUrl(URL.createObjectURL(file));
                        setFotoError(''); // Quitar el error al cargar la imagen
                    }}
                />
                {fotoError && <p className="text-red-500 text-xs mt-1">{fotoError}</p>}
            </div>

            <div className='flex flex-wrap justify-between'>
                <div className='flex flex-col w-full md:w-1/2 p-2'>

                    {/* Nombre */}
                    <div className='py-2'>
                        <Input
                            type="text"
                            color='warning'
                            variant="bordered"
                            label="Nombre"
                            value={nombre}
                            onChange={handleNombreChange}
                        />
                        {nombreError && <p className="text-red-500 text-xs mt-1">{nombreError}</p>}
                    </div>

                    {/* Apellido */}
                    <div className='py-2'>
                        <Input
                            type="text"
                            color='warning'
                            variant="bordered"
                            label="Apellido"
                            value={apellido}
                            onChange={handleApellidoChange}
                        />
                        {apellidoError && <p className="text-red-500 text-xs mt-1">{apellidoError}</p>}
                    </div>


                    {/* Campo Tipo de Documento */}
                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl"
                            value={tipoDocumentoOp}
                            onChange={handleTipoDocumentoChange}
                        >
                            <option value="" hidden>
                                Seleccionar Tipo de documento
                            </option>
                            {tipo_documento.map((tipo) => (
                                <option key={tipo.key} value={tipo.key}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                        {tipoDocumentoError && <p className="text-red-500 text-xs mt-1">{tipoDocumentoError}</p>}
                    </div>

                    {/* Documento de identidad */}
                    <div className='py-2'>
                        <Input
                            type="number"
                            color='warning'
                            variant="bordered"
                            label="Documento de identidad"
                            value={documento_identidad}
                            onChange={handleDocumentoChange}
                        />
                        {documentoError && <p className="text-red-500 text-xs mt-1">{documentoError}</p>}
                    </div>

                    {/* Dirección */}
                    <div className='py-2'>
                        <Input
                            type="text"
                            color='warning'
                            variant="bordered"
                            label="Dirección"
                            value={direccion}
                            onChange={handleDireccionChange}
                        />
                        {direccionError && <p className="text-red-500 text-xs mt-1">{direccionError}</p>}
                    </div>
                </div>

                <div className='flex flex-col w-full md:w-1/2 p-2'>
                    {/* Correo */}
                    <div className='py-2'>
                        <Input
                            type="email"
                            color='warning'
                            variant="bordered"
                            label="Correo Electrónico"
                            value={correo}
                            onChange={handleCorreoChange}
                        />
                        {correoError && <p className="text-red-500 text-xs mt-1">{correoError}</p>}
                    </div>

                    {/* Contraseña */}
                    <div className='py-2'>
                        <Input
                            label="Contraseña"
                            color='warning'
                            variant="bordered"
                            type={isPasswordVisible ? "text" : "password"}
                            value={password}
                            onChange={handlePasswordChange}
                            endContent={
                                <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    {isPasswordVisible ? (
                                        <EyeFilledIcon size={20} />
                                    ) : (
                                        <EyeSlashFilledIcon size={20} />
                                    )}
                                </button>
                            }
                        />
                        {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                    </div>

                    {/* Teléfono */}
                    <div className='py-2'>
                        <Input
                            type="number"
                            color='warning'
                            variant="bordered"
                            label="Teléfono"
                            value={telefono}
                            onChange={handleTelefonoChange}
                        />
                        {telefonoError && <p className="text-red-500 text-xs mt-1">{telefonoError}</p>}
                    </div>

                    {/* Rol */}
                    <div className='py-2'>
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl"
                            value={rolOp}
                            onChange={handleRolChange}
                        >
                            <option value="" hidden>
                                Seleccionar Rol
                            </option>
                            {rol.map((rol) => (
                                <option key={rol.key} value={rol.key}>
                                    {rol.label}
                                </option>
                            ))}
                        </select>
                        {rolError && <p className="text-red-500 text-xs mt-1">{rolError}</p>}
                    </div>
                </div>
            </div>
            <ModalFooter>
                <Button color='danger' variant='flat' onClick={onClose}>
                    Cerrar
                </Button>
                <Button type='submit' color="warning" className='text-white'>
                    {actionLabel}
                </Button>
            </ModalFooter>
        </form>
    );
};

export default FormUsuarios;
