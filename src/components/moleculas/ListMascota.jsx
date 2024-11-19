import React, { useContext, useEffect, useState } from 'react';
import { Image } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import axiosClient from '../axiosClient';
import MascotasContext from '../../context/MascotasContext';
import Swal from 'sweetalert2';
import { FaPaw, FaStar, FaCalendarDay, FaCheckCircle, FaMapMarkerAlt, FaWeight, FaMars, FaVenus } from "react-icons/fa";
import { Tooltip } from "@nextui-org/react";

function ListMascota({ initialData, onClose }) {
    const [vacunas, setVacunas] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const genderIcon = initialData.sexo === "Macho" ? <FaMars className="text-blue-500" /> : <FaVenus className="text-pink-500" />;
    const stored = localStorage.getItem('user');
    const user = stored && stored !== 'undefined' ? JSON.parse(stored) : null;

    const imagenesArray = typeof initialData.imagenes === 'string'
        ? initialData.imagenes.split(',').filter(imagen => imagen.trim() !== '')
        : [];

    useEffect(() => {
        const fetchVacunas = async () => {
            try {
                const response = await axiosClient.get(`/vacunas/listar/${initialData.id_mascota}`);
                setVacunas(response.data);
            } catch (error) {
                console.error('Error al listar vacunas:', error);
            }
        };
        fetchVacunas();
    }, [initialData.id_mascota]);

    useEffect(() => {
        peticionGet();
    }, []);

    const peticionGet = async () => {
        try {
            const response = await axiosClient.get('/mascotas/listar');
            setMascotas(response.data);
        } catch (error) {
            console.log('Error en el servidor ' + error);
        }
    };

    const handleAdoptar = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser || storedUser === 'undefined') {
                Swal.fire({
                    title: 'Error',
                    text: 'Debe iniciar sesión para adoptar.',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }

            const user = JSON.parse(storedUser);
            const id_usuario = user?.id_usuario;
            if (!id_usuario) {
                throw new Error('No se ha encontrado un ID de usuario');
            }

            const result = await Swal.fire({
                title: '¿Deseas adoptar este amiguito?',
                text: 'Comunicaremos al administrador que deseas adoptar este amiguito.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                const data = {
                    fk_id_mascota: initialData.id_mascota,
                    fk_id_usuario_adoptante: id_usuario,
                    fecha_adopcion: new Date().toISOString(),
                    estado: 'aceptada'
                };

                const response = await axiosClient.post(`/adopciones/iniciar/${initialData.id_mascota}`, data);

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Éxito',
                        text: response.data.message,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    setMascotas((prevMascotas) =>
                        prevMascotas.map((mascota) =>
                            mascota.id_mascota === initialData.id_mascota ? { ...mascota, estado: 'Reservado' } : mascota
                        )
                    );

                    peticionGet();
                    onClose();
                } else {
                    throw new Error(response.data.message);
                }
            }
        } catch (error) {
            console.error('Error al iniciar adopción:', error);

            Swal.fire({
                title: 'Error',
                text: error.message || 'Error al poner en proceso de adopción',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const statusColorMap = {
        'En Adopcion': "success",
        Urgente: "danger",
        Reservado: "secondary",
        Adoptado: "warning",
        todos: "primary",
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let ageYears = today.getFullYear() - birth.getFullYear();
        let ageMonths = today.getMonth() - birth.getMonth();

        if (ageMonths < 0) {
            ageYears--;
            ageMonths += 12;
        }

        if (today.getDate() < birth.getDate()) {
            ageMonths--;
            if (ageMonths < 0) {
                ageYears--;
                ageMonths += 12;
            }
        }

        return { years: ageYears, months: ageMonths };
    };

    const { years, months } = calculateAge(initialData.fecha_nacimiento);

    return (
        <div className="max-h-[80vh] overflow-y-auto p-4">
            {mascotas.length === 0 ? (
                <p className="text-center font-medium text-gray-600">No hay mascotas ragistradas para mostrar</p>
            ) : (
                <>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    {/* Información de la mascota */}
                    <Tooltip content="Nombre de la mascota">
                        <h4 className="font-semibold text-lg flex items-center space-x-2">
                            <FaPaw className="text-indigo-600" />
                            <span>{initialData.nombre_mascota}</span>
                        </h4>
                    </Tooltip>
                    <Tooltip content="Sexo de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                {genderIcon}
                                <span>{initialData.sexo}</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Raza de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaPaw className="text-indigo-600" />
                                <span>{initialData.raza}</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Categoría de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaStar className="text-yellow-500" />
                                <span>{initialData.categoria}</span>
                            </h4>
                        </Tooltip>
                </div>
                <div>
                <Tooltip content="Edad de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaCalendarDay className="text-green-500" />
                                <span>{years} Años y {months} Meses</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Esterilización">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaCheckCircle className="text-blue-500" />
                                <span>{initialData.esterilizado}</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Departamento">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span>{initialData.departamento}</span>
                            </h4>
                        </Tooltip>
                </div>
                <div>
                <Tooltip content="Municipio">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span>{initialData.municipio}</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Tamaño de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaWeight className="text-gray-500" />
                                <span>{initialData.tamano}</span>
                            </h4>
                        </Tooltip>
                        <Tooltip content="Peso de la mascota">
                            <h4 className="font-semibold text-base flex items-center space-x-2 mt-2">
                                <FaWeight className="text-gray-500" />
                                <span>{initialData.peso} kg</span>
                            </h4>
                        </Tooltip>
                </div>
            </div>

            {/* Estado */}
            <div className="capitalize mt-4 text-center text-sm font-medium">
                <span className={`px-4 py-2 rounded-full text-white bg-${statusColorMap[initialData.estado]}`}>
                    {initialData.estado}
                </span>
            </div>

            {/* Imágenes */}
            <div className="py-4 flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 w-full max-h-[250px] overflow-y-auto">
                    {imagenesArray.length > 0 ? (
                        imagenesArray.map((imagen, index) => (
                            <Image
                                key={index}
                                alt={`Imagen ${index + 1}`}
                                className="object-cover rounded-lg shadow-md"
                                src={`${axiosClient.defaults.baseURL}/uploads/${imagen}`}
                                width="100%"
                                height="auto"
                            />
                        ))
                    ) : (
                        <Image
                            alt="Imagen por defecto"
                            className="object-cover rounded-lg shadow-md"
                            src="https://nextui.org/images/hero-card-complete.jpeg"
                            width="100%"
                            height="auto"
                        />
                    )}
                </div>
            </div>


            {/* Descripción */}
            <p className="text-sm text-gray-700 font-medium">{initialData.descripcion}</p>

            {/* Vacunas */}
            <div className="flex flex-wrap -mx-2">
                {vacunas.length > 0 ? (
                    vacunas.map((vacuna) => (
                        <div key={vacuna.id_vacuna} className="w-full md:w-1/2 px-2">
                            <div className="border p-4 rounded-lg shadow-sm bg-white">
                                <h5 className="font-bold text-gray-800 mb-1 text-sm">Enfermedad: {vacuna.enfermedad}</h5>
                                <p className="text-gray-600 mb-1 text-xs">Fecha: {formatDate(vacuna.fecha_vacuna)}</p>
                                <p className="text-gray-600 text-xs">Estado: {vacuna.estado}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-700 font-medium mb-4">Esta mascota no tiene vacunas.</p>
                )}
            </div>

            {/* Botones */}
            {/* Botones */}
            <div className="flex justify-end mt-2">
    <Button color="danger" onClick={onClose}>Cancelar</Button>
    {user && user.rol !== 'superusuario' && initialData.estado !== 'Reservado' && initialData.estado !== 'Adoptado' && (
        <Button color="primary" onClick={handleAdoptar}>Adoptar</Button>
    )}
</div>

            </>
            )}
        </div>
    );
}

export default ListMascota;
