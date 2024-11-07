import React, { useEffect, useState, useCallback } from 'react';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axiosClient from '../axiosClient.js';
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, Chip } from "@nextui-org/react";


export function NotificacionesSuperU() {
    const [notifications, setNotifications] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;
                const response = await axiosClient.get(`/usuarios/listarNoti/${id_usuario}`, { headers: { token: token } });

                console.log('Respuesta de la API:', response.data); // Verificar la respuesta de la API

                setNotifications(response.data);
                setIsLoaded(true);
            } catch (error) {
                console.log('Error en el servidor: ' + error);
            }
        };

        fetchNotifications();
    }, []);



    const handleApprove = async (id_notificacion) => {
        const notification = notifications.find(notif => notif.id_notificacion === id_notificacion);
    
        if (notification.estado === 'aceptada') {
            Swal.fire('Advertencia', 'La solicitud ya está en estado aceptada', 'warning');
            return; // No hacer la solicitud al backend
        }
    
        try {
            const response = await axiosClient.put(`/usuarios/manejar/${id_notificacion}`, { estado: 'aceptada' });
            Swal.fire('Éxito', response.data.message, 'success');
    
            // Actualizar el estado de la notificación en la lista
            const updatedNotifications = notifications.map(notif =>
                notif.id_notificacion === id_notificacion ? { ...notif, estado: 'aceptada' } : notif
            );
            setNotifications(updatedNotifications);
        } catch (error) {
            console.error('Error al aprobar la solicitud', error);
            Swal.fire('Error', 'No se pudo aprobar la solicitud', 'error');
        }
    };
    
    const handleDeny = async (id_notificacion) => {
        const notification = notifications.find(notif => notif.id_notificacion === id_notificacion);
    
        if (notification.estado === 'rechazada') {
            Swal.fire('Advertencia', 'La solicitud ya está en estado rechazada', 'warning');
            return; // No hacer la solicitud al backend
        }
    
        try {
            const response = await axiosClient.put(`/usuarios/manejar/${id_notificacion}`, { estado: 'rechazada' });
            Swal.fire('Éxito', response.data.message, 'success');
    
            // Actualizar el estado de la notificación en la lista
            const updatedNotifications = notifications.map(notif =>
                notif.id_notificacion === id_notificacion ? { ...notif, estado: 'rechazada' } : notif
            );
            setNotifications(updatedNotifications);
        } catch (error) {
            console.error('Error al denegar la solicitud', error);
            Swal.fire('Error', 'No se pudo denegar la solicitud', 'error');
        }
    };
    


    const handleDelete = async (id_notificacion) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás deshacer esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosClient.delete(`/usuarios/eliminarNotificacion/${id_notificacion}`);
                Swal.fire('Eliminada', response.data.message, 'success');

                // Actualizar la lista de notificaciones
                setNotifications(notifications.filter(notif => notif.id_notificacion !== id_notificacion));
            } catch (error) {
                console.error('Error al eliminar la notificación', error);
                Swal.fire('Error', 'No se pudo eliminar la notificación', 'error');
            }
        }
    };

    const renderNotificationCard = useCallback((notification) => {
        return (
            <Card key={notification.id_notificacion} className="p-4 m-4 bg-gray-200 shadow-lg relative">
                <button
                    onClick={() => handleDelete(notification.id_notificacion)}
                    className="absolute top-2 right-2 text-gray-800 hover:text-red-600 active:text-red-500"
                >
                    <FaTrash size={20} />
                </button>

                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="font-bold text-2xl mb-1 text-gray-800">Solicitud de: {notification.nombre_solicitante}</h4>
                    <p className="text-sm text-gray-700 mt-2"><strong>Correo Solicitante:</strong> {notification.correo_solicitante}</p>
                    <p className="text-sm text-gray-700 mt-2"><strong>Rol Solicitado:</strong> Administrador</p>
                    <p className="text-sm text-gray-700 mt-2"><strong>Fecha:</strong> {new Date(notification.fecha).toLocaleString()}</p>
                    <Chip className="capitalize" color={notification.estado === 'denegado' ? 'danger' : 'primary'} size="sm" variant="flat">
                        {notification.estado || 'Pendiente'}
                    </Chip>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <div className="flex justify-start gap-2">
                        <Button color="warning" onClick={() => handleApprove(notification.id_notificacion)}>
                            Aceptar
                        </Button>
                        <Button color="danger" onClick={() => handleDeny(notification.id_notificacion)}>
                            Rechazar
                        </Button>
                    </div>
                </CardBody>
            </Card>
        );
    }, [notifications]);

    return (
        <>

            <div className="z-0 w-full sm:w-full lg:w-12/12 xl:w-11/12 mt-20">
                {notifications.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <h2 className="text-center text-2xl font-bold text-red-500">
                            No tienes notificaciones de solicitudes de cambio de rol disponibles
                        </h2>
                    </div>
                ) : (
                    <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xxl:grid-cols-4">
                        {notifications.map(renderNotificationCard)}
                    </div>
                )}
            </div>
        </>
    );
}

export default NotificacionesSuperU;