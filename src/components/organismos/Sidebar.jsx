import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { AiOutlineUser, AiOutlineBell, AiOutlinePieChart } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { MdOutlinePets } from "react-icons/md";
import Control from "./../../assets/control.png";
import logo from "./../../assets/logo.png";       

export const Sidebar = () => {
  const [open, setOpen] = useState(
    JSON.parse(localStorage.getItem("sidebarOpen")) ?? false
  );
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [sidebar, setSidebar] = useState(false);  // Controla el sidebar en pantallas pequeñas

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  // Manejar la visibilidad del sidebar en función del tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setSidebar(window.innerWidth >= 768);  // Mostrar el sidebar solo en pantallas grandes
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

  const toggleSidebar = () => setOpen(!open);

  return (
    <div
      className={`${
        open ? "w-56" : "w-20"
      } bg-gradient-to-b from-gray-900 to-gray-900 text-white min-h-screen p-5 fixed left-0 top-0 transition-all duration-300`}
    >
      {/* Botón de control */}
      {/* <img
        src={Control}
        alt="Control"
        className={`absolute cursor-pointer -right-3 top-10 w-7 border-dark-purple border-2 rounded-full ${
          !open && "rotate-180"
        }`}
        onClick={toggleSidebar}
      /> */}
      
      <div className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          className={`cursor-pointer duration-500 h-10 w-10 rounded-full ${
            open ? "w-40 h-20 rounded-full" : ""
          }`}
        />
      </div>
      <ul className="pt-6">
        {Menus.map((Menu, index) => (
          <Link
            to={Menu.link}
            key={index}
            onClick={() => setActiveLink(Menu.link)}
            className={`flex rounded-md p-2 cursor-pointer text-lg font-bold items-center gap-x-4 ${
              activeLink === Menu.link ? "bg-gray-700" : ""
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
  );
};
