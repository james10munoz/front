import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaX } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import { FaRegUserCircle } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

export const SideBarUser = () => {
    const [sidebar, setSideBar] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navRef = useRef(null);
    const navigate = useNavigate(); 

    const showSideBar = () => setSideBar(!sidebar);

    // Verificar si el usuario está en modo invitado
    const isGuest = !localStorage.getItem("token"); // Si no hay token, es invitado

    const handleClickOutside = (event) => {
        if (navRef.current && !navRef.current.contains(event.target)) {
            setSideBar(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user"); // Limpiar datos de usuario
        localStorage.removeItem("token"); // Limpiar token de autenticación
        console.log("Sesión cerrada: Token y datos de usuario eliminados."); // Confirmación en consola
        navigate('/'); // Redireccionar a la página de inicio
    };

    return (
        <div className='z-20'>
            <div className='h-20 flex justify-end items-center'>
                <Link to='#'>
                    <FaRegUserCircle size={40} className="cursor-pointer mr-8 text-white" onClick={showSideBar} />
                </Link>
            </div>
            <IconContext.Provider value={{ color: '#fff' }}>
                <nav 
                    ref={navRef} 
                    className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b transition-transform duration-300 ease-in-out ${sidebar ? 'translate-x-0' : 'translate-x-full'} shadow-lg transform-gpu`}
                >
                    <ul className='w-full mt-6 flex flex-col items-center p-4' onClick={showSideBar}>
                        <li className='mb-6 self-end'>
                            <Link to='#'>
                                <FaX size={20} className="text-white" />
                            </Link>
                        </li>
                        {!isGuest && ( // Muestra el perfil solo si no es invitado
                            <li className='flex items-center mb-4 w-full border-2 border-transparent hover:border-yellow-400 rounded-lg p-2 transition-transform duration-300 transform hover:scale-105'>
                                <Link to="/perfil" className='flex items-center w-full'>
                                    <CiUser className='text-3xl text-white' />
                                    <span className='text-white text-xl font-bold px-4'>Perfil de usuario</span>
                                </Link>
                            </li>
                        )}
                        <li className='flex items-center mb-4 w-full border-2 border-transparent hover:border-yellow-400 rounded-lg p-2 transition-transform duration-300 transform hover:scale-105'>
                            <IoLogOutOutline className='text-3xl text-white' />
                            <label className='text-white text-xl font-bold w-full h-full flex items-center px-4 rounded-lg cursor-pointer' onClick={onOpen}>
                                Cerrar sesión
                            </label>
                        </li>
                    </ul>
                </nav>
            </IconContext.Provider>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>Cerrar sesión</ModalHeader>
                    <ModalBody>
                        <p>¿Desea cerrar sesión?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={handleLogout}>Cerrar sesión</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
