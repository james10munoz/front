import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosClient from '../axiosClient.js';
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { FaTrash } from 'react-icons/fa'; // Importar el ícono
import Header from '../moleculas/Header.jsx';

export function NotificacionesUsuario() {
    const [notifications, setNotifications] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;
                const response = await axiosClient.get(`/usuarios/listarNoti/${id_usuario}`, { headers: { token: token } });

                setNotifications(response.data);
                setIsLoaded(true);
            } catch (error) {
                console.log('Error en el servidor: ' + error);
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        notifications.forEach(notification => {
            if (notification.estado === 'denegado') {
                Swal.fire({
                    icon: 'error',
                    title: 'Solicitud Denegada',
                    text: notification.mensaje,
                });
            }
        });
    }, [notifications]);

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

    const handleWhatsAppRedirect = (whatsapp) => {
        const url = `https://wa.me/${whatsapp}`;
        window.open(url, '_blank');
    };

    const renderNotificationCard = (notification) => {
        return (
            <Card key={notification.id_notificacion} className="p-4 m-4 bg-gray-200 shadow-lg relative ">
                <button
                    onClick={() => handleDelete(notification.id_notificacion)}
                    className="absolute top-2 right-2 text-gray-800 hover:text-red-600 active:text-red-500"
                >
                    <FaTrash size={20} />
                </button>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <div className="w-full text-center">
                        <h4 className="font-bold text-3xl mb-2 text-gray-900">Notificación</h4>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{notification.mensaje}</p>
                </CardHeader>
                {notification.mensaje.includes("WhatsApp") && (
                    <CardBody className="overflow-visible py-2">
                        <Button color="success" onClick={() => handleWhatsAppRedirect(notification.mensaje.match(/\d+/)[0])}>
                            Contactar por WhatsApp
                        </Button>
                    </CardBody>
                )}
            </Card>
        );
    };

    return (
        <>
            {/* <Header /> */}
            <div className="z-0 w-full sm:w-full lg:w-12/12 xl:w-11/12 mt-20">
                {notifications.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <h2 className="text-center text-2xl font-bold text-red-500">
                            No tienes notificaciones  disponibles
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

export default NotificacionesUsuario;