import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient.js';
import MascotasContext from '../../context/MascotasContext.jsx';
import {
    Input,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip, Modal
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { PlusIcon } from "../nextUI/PlusIcon.jsx";
import { SearchIcon } from "../nextUI/SearchIcon.jsx";
import { ChevronDownIcon } from "../nextUI/ChevronDownIcon.jsx";
import { Card, CardHeader, CardBody, Image, Skeleton } from "@nextui-org/react";
import MascotaModal from '../templates/MascotaModal.jsx';
import AccionesModal from '../organismos/ModalAcciones.jsx';
import ListMascotaModal from '../templates/ListsMascotaModal.jsx';
import { EyeIcon } from '../nextUI/EyeIcon.jsx';


export function Mascotas() {
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

    function Ejemplo({ mascotas }) {
        const [filterValue, setFilterValue] = useState("");
        const [selectedKeys, setSelectedKeys] = useState(new Set(["todos"]));
        const [isLoaded, setIsLoaded] = useState(false);

        const statusFilter = useMemo(() => {
            return Array.from(selectedKeys).join(", ");
        }, [selectedKeys]);

        const hasSearchFilter = Boolean(filterValue);

        const filteredItems = useMemo(() => {
            let filteredMascotas = mascotas;

            if (hasSearchFilter) {
                filteredMascotas = filteredMascotas.filter(mascota =>
                    mascota.nombre_mascota.toLowerCase().includes(filterValue.toLowerCase()) ||
                    mascota.sexo.toLowerCase().includes(filterValue.toLowerCase())
                );
            }

            if (statusFilter !== "todos") {
                filteredMascotas = filteredMascotas.filter(
                    (mascota) => mascota.estado === statusFilter
                );
            }

            return filteredMascotas;
        }, [mascotas, filterValue, statusFilter]);

        useEffect(() => {
            // Simulate fetching data with a delay
            setTimeout(() => {
                setIsLoaded(true);
            }, 1500);
        }, []);
        const onSearchChange = (e) => {
            setFilterValue(e.target.value);
        };

        const onClear = () => {
            setFilterValue('');
        };


        const renderCard = useCallback((mascota) => {
            const handleDownloadPDF = async (id_mascota) => {
                try {
                    const response = await axiosClient.get(`/mascotas/pdf/${id_mascota}`, {
                        responseType: 'blob', // Esperamos un archivo blob
                    });
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `mascota_${id_mascota}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                } catch (error) {
                    console.error('Error al descargar el PDF:', error);
                }
            };
            return (
            <Card className="p-2 bg-gray-200" key={mascota.id_mascota} style={{ maxWidth: '400px', height: '100%' }}>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="font-bold text-2xl mb-1 text-gray-800">Nombre: {mascota.nombre_mascota}</h4>
                    <small className="text-gray-600 mb-2">Género: {mascota.sexo}</small>
                    <h4 className="font-semibold text-lg mb-2 text-gray-700">Raza: {mascota.raza}</h4>
                    <Chip className="capitalize" color={statusColorMap[mascota.estado]} size="sm" variant="flat">
                        {mascota.estado}
                    </Chip>
                </CardHeader>
                <CardBody className="py-4 flex flex-col justify-between" style={{ maxHeight: '350px', overflow: 'hidden' }}>
                    <Skeleton isLoaded={isLoaded} className="rounded-lg">
                        <div className="relative w-full mb-4 overflow-hidden">
                            {mascota.imagenes && mascota.imagenes.length > 0 ? (
                                <div
                                    className={`grid ${mascota.imagenes.split(',').length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 overflow-y-auto`}
                                    style={{ maxHeight: '150px' }}
                                >
                                    {mascota.imagenes.split(',').map((imagen, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-center ${mascota.imagenes.split(',').length === 1 && index === 0 ? 'col-span-2' : ''}`}
                                        >
                                            <Image
                                                alt={`Imagen ${index + 1}`}
                                                className="object-cover rounded-xl"
                                                src={`${axiosClient.defaults.baseURL}/uploads/${imagen}`}
                                                width="100%"
                                                height="auto"
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
                                            width="100%"
                                            height="auto"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Skeleton>
                    <p className="text-sm text-gray-700 font-medium mb-4 overflow-y-auto" style={{ maxHeight: '100px' }}>
                        {mascota.descripcion}
                    </p>
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="flex justify-start gap-4">
                            <Button color="warning" variant="ghost" onPress={() => handleToggle('update', setMascotaId(mascota))}>
                                Editar
                            </Button>
                            <Button color="primary" variant="ghost" onPress={() => handleDownloadPDF(mascota.id_mascota)}>
                                Ficha Técnica
                            </Button>
                        </div>
                        <div className="flex justify-start">
                            <Button color="default" variant="ghost" onPress={() => handleViewDetails('view', mascota)}>
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <EyeIcon />
                                </span>
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            );
            
        }, [isLoaded]);

        return (
            <div className="flex flex-col items-center p-4 w-full">
                <div className="w-full sm:w-full lg:w-11/12 xl:w-11/12">
                    <div className="flex flex-col mt-3">
                        <div className="flex justify-between gap-3 items-end">
                            <Input
                                isClearable
                                className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
                                placeholder="Buscar..."
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onClear={onClear}
                                onChange={onSearchChange}
                            />
                            <div className="z-0 flex gap-3">
                                <Button as={Link} to="/reportes" color="primary" variant="bordered" className="text-gray-700">
                                    Reportes
                                </Button>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            variant="bordered"
                                            className="capitalize"
                                            endContent={<ChevronDownIcon className="text-small text-slate-700" />}
                                        >
                                            {statusFilter}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Single selection example"
                                        variant="flat"
                                        disallowEmptySelection
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
                                <Button color="warning" variant="bordered" className="z-1 text-orange-500" style={{ position: 'relative' }} endContent={<PlusIcon />} onClick={() => handleToggle('create')}>
                                    Registrar
                                </Button>
                            </div>

                        </div>
                        <div className="z-0 grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredItems.map(renderCard)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [modalAcciones, setModalAcciones] = useState(false);
    const [modalPetOpen, setModalPetOpen] = useState(false);
    const [modePet, setModePet] = useState('view');
    const [mode, setMode] = useState('create');
    const [initialData, setInitialData] = useState(null);
    const [mascotas, setMascotas] = useState([]);
    const { idMascota, setMascotaId } = useContext(MascotasContext);

    
    useEffect(() => {
        peticionGet();
    }, []);

    const peticionGet = async () => {
        try {
            const response = await axiosClient.get('/mascotas/listar');
            console.log(response.data);
            setMascotas(response.data);
        } catch (error) {
            console.log('Error en el servidor ' + error);
        }
    };

    const handleSubmit = async (formData, e) => {
        console.log('Datos enviados...:', formData);
        e.preventDefault();

        try {
            if (mode === 'create') {
                const response = await axiosClient.post('/mascotas/registrar', formData);
                console.log('API Response:', response);
                if (response.status === 200) {
                    Swal.fire({
                        position: "center", // Posición centrada
                        icon: "success",
                        title: "Mascota registrada con éxito",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    peticionGet();
                    setModalOpen(false); // Cierra el modal de registro
                } else {
                    alert('Error en el registro');
                }
            } else if (mode === 'update') {
                const response = await axiosClient.put(`/mascotas/actualizar/${idMascota.id_mascota}`, formData);
                if (response.status === 200) {
                    Swal.fire({
                        position: "center", // Posición centrada
                        icon: "success",
                        title: "Mascota actualizada con éxito",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    peticionGet();
                    setModalOpen(false); // Cierra el modal de actualización
                } else {
                    alert('Error en la actualización');
                }
            }
        } catch (error) {
            console.log(error);
        }


    };

    const handleToggle = (mode, initialData) => {
        setInitialData(initialData);
        setModalOpen(true);
        setMode(mode);
    };

    const handleViewDetails = (modePet, initialData) => {
        setInitialData(initialData);
        setModalPetOpen(true);
        setModePet(modePet);
    };

    return (
        <>
            <div className='pl-4'>
                <Ejemplo mascotas={mascotas} />
                <MascotaModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    handleSubmit={handleSubmit}
                    actionLabel={mode === 'create' ? 'Registrar' : 'Editar'}
                    title={mode === 'create' ? 'Registrar Mascota' : 'Editar Mascota'}
                    initialData={initialData}
                    mode={mode}
                />
                <ListMascotaModal
                    open={modalPetOpen}
                    onClose={() => setModalPetOpen(false)}
                    title='Mascota'
                    actionLabel='Cerrar'
                    initialData={initialData}
                    modePet={modePet}
                />
                <AccionesModal
                    open={modalAcciones}
                    onClose={() => setModalAcciones(false)}
                    handleSubmit={handleSubmit}
                    actionLabel={mode === 'create' ? 'Registrar' : 'Editar'}
                    title={mode === 'create' ? 'Registrar Mascota' : 'Editar Mascota'}
                    initialData={initialData}
                    mode={mode}
                />
            </div>
        </>
    );
}

export default Mascotas;