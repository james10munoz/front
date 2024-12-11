import { Sidebar } from "../organismos/Sidebar.jsx"; 
import { SideBarUser } from "../organismos/SideBarUser.jsx";
import { useState, useEffect } from "react";  // Usamos useState y useEffect para manejar el estado del Sidebar

const Header = (props) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Estado para controlar el Sidebar

    // Usamos un useEffect para escuchar el estado del Sidebar, el cual debería provenir del Sidebar
    useEffect(() => {
        const storedState = localStorage.getItem("sidebarOpen");
        if (storedState) {
            setIsSidebarOpen(JSON.parse(storedState));
        }
    }, []);

    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-900 w-full h-20 flex justify-between shadow-3xl shadow-gray-900 border-b-2 border-gray-300 fixed top-0 left-0 z-50">
            <Sidebar />  {/* Sidebar que ya gestiona su propio estado */}

            {/* Título en el Header */}
            <h2 className={`text-white text-2xl font-bold flex items-center transition-all duration-300 ${isSidebarOpen ? "ml-80" : "ml-20"}`}>
                {props.title}
            </h2>

            <SideBarUser />  {/* Componente de usuario en el Header */}
        </div>
    );
};

export default Header;
