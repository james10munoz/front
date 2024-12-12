import React from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Municipios from './Municipios.jsx';
import Departamentos from './Departamentos.jsx';
import Mascotas from './Mascota.jsx';
import Razas from './Razas.jsx';
import Vacunas from './Vacunas.jsx';
import Categorias from './Categoria.jsx';
import Header from '../moleculas/Header.jsx';

const TabMascotas = () => {
    return (
        <div className='bg-[#EAEDF6] min-h-screen mt-20 h-full'>
            <Header title="Datos Mascotas" />
            <div className='bg-[#EAEDF6] flex flex-col items-center'>
                <div className='w-full max-w-[100%] pl-6 pt-6 flex-grow'>
                    <div className="flex flex-col gap-6 w-full h-full bg-[#EAEDF6] pl-52">
                        <Tabs aria-label="Options" color="default" variant="bordered">
                            <Tab key="mascotas" title="Mascotas">
                                <Card className="h-full">
                                    <CardBody className="flex justify-center items-center">
                                        <Mascotas />
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="vacunas" title="Vacunas">
                                <Card className="h-full">
                                    <CardBody className="flex justify-center items-center">
                                        <Vacunas />
                                    </CardBody>
                                </Card>
                            </Tab> 
                            <Tab key="categorias" title="Categorías">
                                <Card className="h-full">
                                    <CardBody className="flex justify-center items-center">
                                        <Categorias />
                                    </CardBody>
                                </Card>
                            </Tab> 
                            <Tab key="razas" title="Razas">
                                <Card className="h-full">
                                    <CardBody className="flex justify-center items-center">
                                        <Razas />
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="departamentos" title="Departamentos">
                                <Card className="h-full">
                                    <CardBody className="flex justify-center items-center">
                                        <Departamentos />
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="municipios" title="Municipios">
                                <Card className="h-full">
                                    <CardBody className="flex justify-center items-center">
                                        <Municipios />
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                        {/* Agrega el mensaje aquí, fuera del componente Tabs */}
                        <div className="text-gray-400 text-center mt-4">
                            Recuerda hacer registros en las tablas que te ayudarán para la información de las mascotas.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabMascotas;
