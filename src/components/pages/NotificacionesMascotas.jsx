import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, Image, Chip, Skeleton } from "@nextui-org/react";
import axiosClient from '../axiosClient.js';

const NotificacionesAdopciones = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [adopciones, setAdopciones] = useState([]);
    const [userRole, setUserRole] = useState('');

    const statusColorMap = {
        'proceso de adopcion': "primary",
    };

    // Fetch adopciones on mount and determine user role
    useEffect(() => {
        const fetchData = async () => {
            await petAdopciones();
            const storedUser = localStorage.getItem('user');
            const user = JSON.parse(storedUser);
            setUserRole(user.rol); // Obtener rol del usuario
            setIsLoaded(true);
        };
        fetchData();
    }, []);

    // Function to fetch adopciones
    const petAdopciones = async () => {
        try {
            const response = await axiosClient.get('/adopciones/listar');
            setAdopciones(response.data);
        } catch (error) {
            console.error('Error al obtener las adopciones:', error);
        }
    };

    // Function to handle aceptar adopcion
    const handleAceptar = async (id_adopcion) => {
        try {
            await axiosClient.post(`/adopciones/administrar/${id_adopcion}`, { accion: 'aceptar' });

            Swal.fire({
                title: 'Éxito',
                text: 'La adopción ha sido aceptada',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });

            // Actualizar el estado local eliminando la adopción aceptada
            setAdopciones(adopciones.filter(adopcion => adopcion.id_adopcion !== id_adopcion));
        } catch (error) {
            console.error('Error al aceptar la adopción: ', error);
            Swal.fire('Error', 'No se pudo aceptar la adopción', 'error');
        }
    };

    // Function to handle denegar adopcion
    const handleDenegar = async (id_adopcion) => {
        try {
            await axiosClient.post(`/adopciones/administrar/${id_adopcion}`, { accion: 'denegar' });

            Swal.fire({
                title: 'Éxito',
                text: 'La adopción ha sido denegada',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });

            // Actualizar el estado local eliminando la adopción denegada
            setAdopciones(adopciones.filter(adopcion => adopcion.id_adopcion !== id_adopcion));
        } catch (error) {
            console.error('Error al denegar la adopción: ', error);
            Swal.fire('Error', 'No se pudo denegar la adopción', 'error');
        }
    };

    // Render card for each adopcion
    const renderCard = useCallback((mascota) => {
        return (
            <Card key={mascota.id_mascota} className="p-4 m-4 bg-gray-300 shadow-lg">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="font-bold text-2xl mb-1 text-gray-800">Nombre: {mascota.nombre_mascota}</h4>
                    <small className="text-gray-600 mb-2">Género: {mascota.sexo}</small>
                    <h4 className="font-semibold text-lg mb-2 text-gray-700">Raza: {mascota.raza}</h4>
                    <Chip className="capitalize" color={statusColorMap[mascota.estado_adopcion]} size="sm" variant="flat">
                        {mascota.estado_adopcion}
                    </Chip>
                    <p className="text-sm text-gray-700 mt-2"><strong>Solicitante:</strong> {mascota.usuario_nombre} {mascota.usuario_apellido}</p>
                    <p className="text-sm text-gray-700"><strong>Correo:</strong> {mascota.usuario_correo}</p>
                    <p className="text-sm text-gray-700"><strong>Teléfono:</strong> {mascota.usuario_telefono}</p>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    {/* <Skeleton isLoaded={isLoaded} className="rounded-lg">
                        <div className="relative w-full h-52 mb-4 overflow-hidden">
                            {mascota && mascota.imagenes ? (
                                <div className={`grid ${mascota.imagenes.split(',').length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                                    {mascota.imagenes.split(',').map((imagen, index) => (
                                        <div key={index} className={`flex items-center justify-center ${mascota.imagenes.split(',').length === 1 && index === 0 ? 'col-span-2' : ''}`}>
                                            <Image
                                                alt={`Imagen ${index + 1}`}
                                                className="object-cover rounded-xl w-full h-full"
                                                src={`${axiosClient.defaults.baseURL}/uploads/${imagen}`}
                                                width="auto"
                                                height="auto"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Image
                                    alt="Imagen por defecto"
                                    className="object-cover rounded-xl w-full h-full"
                                    src="https://nextui.org/images/hero-card-complete.jpeg"
                                    width="auto"
                                    height="auto"
                                />
                            )}
                        </div>
                    </Skeleton> */}
                    <p className="text-sm text-gray-700 font-medium mb-4">{mascota.descripcion}</p>

                    {/* Botones de acción solo para el superusuario */}
                    {userRole === 'superusuario' && (
                        <div className="flex justify-start gap-2">
                            <Button color="warning" onClick={() => handleAceptar(mascota.id_adopcion)}>
                                Aceptar
                            </Button>
                            <Button color="danger" onClick={() => handleDenegar(mascota.id_adopcion)}>
                                Rechazar
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        );
    }, [adopciones, isLoaded, userRole]);

    return (
        <div className="z-0 w-full sm:w-full lg:w-12/12 xl:w-11/12 mt-20">
            {adopciones.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <h2 className="text-center text-2xl font-bold text-red-500">
                        No tienes notificaciones de adopciones pendientes
                    </h2>
                </div>
            ) : (
                <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xxl:grid-cols-4">
                    {adopciones.map(renderCard)}
                </div>
            )}
        </div>
    );
};

export default NotificacionesAdopciones;
