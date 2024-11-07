import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from "@nextui-org/link";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient.js';
import MascotasContext from '../../context/MascotasContext.jsx';
import {
    Input,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Button,
    Card,
    CardHeader,
    CardBody,
    Image,
    Skeleton
} from "@nextui-org/react";
import ListMascotaModal from '../templates/ListsMascotaModal.jsx';
import AccionesModal from '../organismos/ModalAcciones.jsx';
import Header from '../moleculas/Header.jsx';

export function ListsMascotas() {
    const navigate = useNavigate();
    const statusColorMap = {
        'En Adopcion': "success",
        Urgente: "danger",
        Reservado: "secondary",
        Adoptado: "warning",
        todos: "primary",
    };

    const statusOptions = [
        { name: "Todos", uid: "todos" },
        { name: "En Adopcion", uid: "En Adopcion" },
        { name: "Urgente", uid: "Urgente" },
        { name: "Reservado", uid: "Reservado" },
        { name: "Adoptado", uid: "Adoptado" },
    ];

    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set(["todos"]));
    const [mascotas, setMascotas] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAcciones, setModalAcciones] = useState(false);
    const [mode, setMode] = useState('view');
    const [initialData, setInitialData] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const { idMascota, setMascotaId } = useContext(MascotasContext);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoaded(false); 
        peticionGet();
    }, []);

    const peticionGet = async () => {
        try {
            const response = await axiosClient.get('/mascotas/listar');
            setMascotas(response.data);
            setIsLoaded(true);
            if (response.data.length === 0) {
                setMensaje("No hay mascotas para mostrar");
              }
              setMascotas(response.data);
            } catch (error) {
              console.error("Error en el servidor", error);
              setMensaje("Error al cargar mascotas.");
            }
    };

    const handleToggle = (mode, initialData) => {
        setInitialData(initialData);
        setModalOpen(true);
        setMode(mode);
    };

    const handleModalClose = async () => {
        setModalOpen(false);
        setModalAcciones(false);
        peticionGet();
    };

    const filteredItems = useMemo(() => {
        return mascotas.filter(mascota => {
            const matchesSearch = String(mascota.id_mascota).toLowerCase().includes(filterValue.toLowerCase()) ||
                                  mascota.nombre_mascota.toLowerCase().includes(filterValue.toLowerCase()) ||
                                  mascota.raza.toLowerCase().includes(filterValue.toLowerCase()) ||
                                  mascota.genero.toLowerCase().includes(filterValue.toLowerCase());
            const matchesStatus = selectedKeys.has("todos") || mascota.estado === Array.from(selectedKeys)[0];
            return matchesSearch && matchesStatus;
        });
    }, [mascotas, filterValue, selectedKeys]);

    if (error) {
        return <div>{error}</div>;
    }

    const renderCard = useCallback((mascota) => (
        <Card className="p-2 mt-4 bg-gray-200" key={mascota.id_mascota}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-2xl mb-1 text-gray-800">Nombre: {mascota.nombre_mascota}</h4>
                <small className="text-gray-600 mb-2">Género: {mascota.sexo}</small>
                <h4 className="font-semibold text-lg mb-2 text-gray-700">Raza: {mascota.raza}</h4>
                <Chip className="capitalize" color={statusColorMap[mascota.estado]} size="sm" variant="flat">
                    {mascota.estado}
                </Chip>
            </CardHeader>
            <CardBody className="overflow-visible py-4">
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                    <div className="relative w-full mb-4 overflow-hidden">
                        {mascota.imagenes && mascota.imagenes.length > 0 ? (
                            <div className={`grid ${mascota.imagenes.split(',').length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                                {mascota.imagenes.split(',').map((imagen, index) => (
                                    <div key={index} className={`flex items-center justify-center ${mascota.imagenes.split(',').length === 1 && index === 0 ? 'col-span-2' : ''}`}>
                                        <Image
                                            alt={`Imagen ${index + 1}`}
                                            className="object-cover rounded-xl"
                                            src={`${axiosClient.defaults.baseURL}/uploads/${imagen}`}
                                            width='auto'
                                            height='auto'
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-2 flex items-center justify-center">
                                    <Image
                                        alt="Imagen por defecto"
                                        className="object-cover rounded-xl"
                                        src="https://nextui.org/images/hero-card-complete.jpeg"
                                        width='auto'
                                        height='auto'
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </Skeleton>
                <p className="text-sm text-gray-700 font-medium mb-4">{mascota.descripcion}</p>
                <div className="flex justify-start gap-10">
                    <Link className='text-blue-600 underline cursor-pointer font-semibold' to='#' onClick={() => handleToggle('view', mascota)}>
                        Ver más
                    </Link>
                    <Button color="primary" variant="ghost" onPress={() => handleDownloadPDF(mascota.id_mascota)}>
                        Ficha Técnica
                    </Button>
                </div>
            </CardBody>
        </Card>
    ), [isLoaded, mascotas]);

    return (
        <>
            <Header title="Lista de mascotas" />
            <div className='pl-24'>
                <AccionesModal
                    isOpen={modalAcciones}
                    onClose={() => setModalAcciones(false)}
                    label={mensaje}
                />
                <ListMascotaModal
                    open={modalOpen}
                    onClose={handleModalClose}
                    title='Mascota'
                    actionLabel='Cerrar'
                    initialData={initialData}
                    handleSubmit={handleModalClose}
                    mode={mode}
                    className="overflow-auto"
                />
                <div className="flex flex-col mt-3">
                    <div className="flex justify-between gap-3 items-end">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
                            placeholder="Buscar..."
                            value={filterValue}
                            onClear={() => setFilterValue('')}
                            onChange={e => setFilterValue(e.target.value)}
                        />
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered" className="capitalize">
                                    {selectedKeys.has("todos") ? "Todos" : Array.from(selectedKeys)[0]}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Single selection example"
                                selectionMode="single"
                                selectedKeys={selectedKeys}
                                onSelectionChange={setSelectedKeys}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize w-55">
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {isLoaded ? (
                            filteredItems.length > 0 ? (
                                filteredItems.map(renderCard)
                            ) : (
                                <Card className="p-4 mt-4 bg-gray-200 col-span-full text-center">
                                    <p className="text-lg text-gray-600">{mensaje}</p>
                                </Card>
                            )
                        ) : (
                            <Skeleton />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
    
    
}
