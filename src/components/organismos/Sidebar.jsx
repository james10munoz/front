import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { AiOutlineUser, AiOutlineBell, AiOutlinePieChart } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { MdOutlinePets } from "react-icons/md";
import Control from './../../assets/control.png';
import logo from './../../assets/logo.png';

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [sidebar, setSidebar] = useState(false);

  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;

  // Manejar la visibilidad del sidebar en función del tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setSidebar(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Guardar el estado del sidebar en el localStorage
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(open));
  }, [open]);

  // Menús para los diferentes roles
  const Menus = [
    { title: "Usuarios", link: "/usuarios", icon: FaUsers },
    { title: "Mascotas", link: "/mascotas", icon: MdOutlinePets },
    { title: "Notificaciones", link: "/notificaciones", icon: AiOutlineBell },
    { title: "Gráficas", link: "/graficas", icon: AiOutlinePieChart },
    { title: "Perfil", link: "/perfil", icon: AiOutlineUser },
  ];

  const MenusAdmin = [
    { title: "Mascotas", link: "/mascotas", icon: MdOutlinePets },
    { title: "Gráficas", link: "/graficas", icon: AiOutlinePieChart },
    { title: "Perfil", link: "/perfil", icon: AiOutlineUser },
  ];

  const MenusUser = [
    { title: "Lista Mascotas", link: "/listmascotas", icon: MdOutlinePets },
    { title: "Notificaciones", link: "/notificaciones", icon: AiOutlineBell },
    { title: "Perfil", link: "/perfil", icon: AiOutlineUser },
  ];

  const GuestMenu = [
    { title: "Lista Mascotas", link: "/listmascotas", icon: MdOutlinePets },
  ];

  // Efectos personalizados para hover en cada opción del menú
  const customHoverEffects = {
    Usuarios: "hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg",
    Mascotas: "hover:bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105",
    Notificaciones: "hover:bg-gradient-to-r from-yellow-400 to-orange-500 hover:rotate-6",
    Gráficas: "hover:bg-gradient-to-r from-red-400 to-yellow-500 hover:skew-y-3",
    Perfil: "hover:bg-gradient-to-r from-indigo-400 to-purple-600 hover:-translate-x-2",
    "Mis Mascotas": "hover:bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105",
  };

  const renderMenu = () => {
    if (!user) return GuestMenu;
    switch (user.rol) {
      case "superusuario":
        return Menus;
      case "administrador":
        return MenusAdmin;
      case "usuario":
        return MenusUser;
      default:
        return GuestMenu;
    }
  };

  return (
    <div className="flex min-h-screen z-20">
      {sidebar && (
        <div
          className={`${open ? "w-56" : "w-20"} bg-gradient-to-b text-white max-h-full p-5 pt-5 h-full fixed duration-300`}
        >
          <img
            src={Control}
            className={`absolute cursor-pointer -right-3 mt-11 w-7 border-dark-purple border-2 rounded-full ${
              !open && "rotate-180"
            }`}
            onClick={() => setOpen(!open)}
          />
          <div className="flex items-center">
            <img
              src={logo}
              className={`cursor-pointer duration-500 h-10 w-10 rounded-full ${
                open ? "rotate-[360deg] w-40 h-20 rounded-full" : ""
              }`}
            />
          </div>
          <ul className="pt-6">
            {renderMenu().map((Menu, index) => (
              <Link
                to={Menu.link}
                key={index}
                onClick={() => setActiveLink(Menu.link)}
                className={`flex rounded-md p-2 cursor-pointer text-lg font-bold items-center gap-x-4 ${
                  activeLink === Menu.link ? "border-2 border-[#EAEDF6]" : ""
                } ${customHoverEffects[Menu.title]} ${!open && "justify-center"}`}
              >
                <div>{React.createElement(Menu.icon, { size: "20" })}</div>
                <span className={`${!open && "hidden"} origin-left duration-200`}>
                  {Menu.title}
                </span>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
