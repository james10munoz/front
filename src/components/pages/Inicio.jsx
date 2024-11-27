import React from 'react'; 
import { Link } from 'react-router-dom';
import imagenes from "../../styles/imagenes";

function Inicio() {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
            {/* Superposición oscura */}
            <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white py-6 px-4 md:px-8">
                {/* Logo centrado */}
                <img 
                    alt="logo" 
                    className="w-32 sm:w-48 md:w-56 lg:w-72 rounded-full shadow-lg transform hover:rotate-6 transition-transform duration-500 mb-8 md:mb-10" 
                    src={imagenes.imgLogo} 
                />

                <div className="text-center max-w-xl md:max-w-3xl lg:max-w-4xl">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 md:mb-8 tracking-wide drop-shadow-lg">
                        ¡Descubre BuddyPet!
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 md:mb-8 leading-relaxed drop-shadow-md">
                        Tu nuevo compañero te espera. Explora, adopta, y encuentra un amigo fiel en BuddyPet.
                    </p>
                </div>
                
                <ul className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 mt-6 md:mt-10">
                    <li>
                        <Link to='/registro'>
                            <button className="text-white font-medium rounded-full text-base sm:text-lg px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 transition duration-200 shadow-md">
                                Regístrate
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/iniciosesion'>
                            <button className="px-4 sm:px-6 py-2 text-base sm:text-lg font-medium text-blue-500 border-2 border-blue-500 rounded-full bg-transparent hover:bg-blue-500 hover:text-white transition duration-200 shadow-md">
                                Iniciar Sesión
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/listmascotas'>
                            <button className="px-4 sm:px-6 py-2 text-base sm:text-lg font-medium text-blue-500 border-2 border-blue-500 rounded-full bg-transparent hover:bg-blue-500 hover:text-white transition duration-200 shadow-md">
                                Modo Invitado
                            </button>
                        </Link>
                    </li>
                </ul>

                {/* Enlace a WhatsApp */}
                <div className="mt-8 md:mt-12 text-center">
                    <p className="text-sm sm:text-base md:text-lg">
                        Si presenta fallas con la plataforma o necesitas ayuda, comunícate con el administrador de BuddyPet: 
                        <a 
                            href="https://wa.me/573222851652" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline ml-2"
                        >
                            WhatsApp
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Inicio;
