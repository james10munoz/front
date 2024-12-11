import React from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Header from '../moleculas/Header.jsx';
import NotificacionesMascotas from './NotificacionesMascotas.jsx';
import NotificacionesSuperU from './NotificacionesSuperU.jsx';
import NotificacionesUsuario from './NotificacionesUsuario.jsx';

const TabNotificaciones = () => {
    const stored = localStorage.getItem('user');
    const user = stored && stored !== 'undefined' ? JSON.parse(stored) : null;

    // Definimos un arreglo de tabs basado en el rol del usuario
    const tabs = [];

    if (user && user.rol === 'superusuario') {
        tabs.push(
            { key: 'mascotas', title: 'Mascotas', component: <NotificacionesMascotas /> },
            { key: 'usuariosSU', title: 'Usuarios', component: <NotificacionesSuperU /> }
        );
    } else if (user && user.rol === 'usuario') {
        tabs.push(
            { key: 'usuariosU', title: 'Usuarios', component: <NotificacionesUsuario /> }
        );
    }

    return (
        <div className='bg-[#EAEDF6] min-h-screen mt-20 h-full'>
            <Header title="Notificaciones" />
            <div className='bg-[#EAEDF6] flex flex-col items-center'>
                <div className='w-full max-w-[95%] p-6 flex-grow pl-52'>
                    <div className="flex flex-col gap-6 w-full h-full bg-[#EAEDF6] pl-10">
                        <Tabs aria-label="Options" variant="bordered">
                            {tabs.map(tab => (
                                <Tab key={tab.key} title={tab.title}>
                                    <Card className="h-full">
                                        <CardBody>
                                            {tab.component}
                                        </CardBody>
                                    </Card>
                                </Tab>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabNotificaciones;
