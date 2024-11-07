import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, Avatar } from "@nextui-org/react";
import axiosClient from '../axiosClient';
import { FaUserCircle } from 'react-icons/fa';
import PerfilModal from '../templates/PerfilModal';
import Header from '../moleculas/Header';

const PerfilUsuario = () => {
  const [perfil, setPerfil] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [mode, setMode] = useState('update');

  const navigate = useNavigate();

  const refreshPerfil = async () => {
    await obtenerDatos(); // Obtén los datos más recientes
  };

  const obtenerDatos = async () => {
    try {
      const token = localStorage.getItem("token");
      const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;
      const response = await axiosClient.get(`/usuarios/perfil/${id_usuario}`, { headers: { token: token } });
      const data = response.data[0];

      const imageUrl = data && data.img
        ? `${axiosClient.defaults.baseURL}/uploads/${data.img}`
        : 'path/to/default-image.jpg';

      setPerfil({ ...data, imageUrl });
    } catch (error) {
      console.error("Error al obtener la información", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Datos enviados:', initialData);

    try {
      const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;

      if (mode === 'update') {
        const response = await axiosClient.put(`/usuarios/actualizar/${id_usuario}`, initialData);
        if (response.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se actualizó con éxito la información",
            showConfirmButton: false,
            timer: 1500
          });
          refreshPerfil(); // Llama a la función para actualizar el perfil en la vista
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al actualizar la información",
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error en el servidor",
        text: error.message,
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setModalOpen(false); // Cierra el modal después de intentar actualizar
    }
  };

  const handleToggle = () => {
    setModalOpen(true);
    setMode('update');
    setInitialData(perfil); // Pasa los datos actuales del perfil al modal
  };

  const handleRequestRoleChange = async () => {
    try {
      const token = localStorage.getItem("token");
      const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;
      const response = await axiosClient.post(`/usuarios/solicitarCambioRol/${id_usuario}`, {}, { headers: { token: token } });

      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Solicitud enviada",
          text: "Tu solicitud de cambio de rol ha sido enviada al Super-Usuario.",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error al enviar la solicitud",
        text: error.message,
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <>
      <Header title="Perfil" />
      {perfil && (
        <div className='my-12 mt-28 flex flex-col items-center'>
          
          <div className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg p-6 w-full max-w-4xl border border-gray-200">
            
            {/* Sección Izquierda: Imagen de perfil y botón Editar Perfil */}
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 flex flex-col items-center">
              
              <div
                className="relative flex justify-center items-center rounded-full overflow-hidden w-48 h-48"
                style={{ 
                  border: '4px solid #D1D5DB',
                  transition: 'border-color 0.3s, border-width 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'orange';
                  e.currentTarget.style.borderWidth = '6px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D1D5DB';
                  e.currentTarget.style.borderWidth = '4px';
                }}
              >
                {perfil.img ? (
                  <Avatar
                  src={perfil.img}
                  alt="Imagen de perfil"
                  css={{
                    borderRadius: "$full",
                  }}
                  className="w-40 h-40 border-gray-800 hover:border-warning-500 transition-colors duration-300"
                />
                ) : (
                  <FaUserCircle
                    size={130}
                    className="text-gray-400 border-4 border-gray-800 bg-gray-100 w-32 h-32 p-2 rounded-full transition-transform duration-300 hover:scale-105"
                  />
                )}
              </div>
  
              <Button
                radius="full"
                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg p-2 w-full md:w-auto mt-4"
                onClick={handleToggle}
                css={{
                  fontWeight: "bold",
                  fontSize: "1.125rem",
                  padding: "0.5rem 2rem",
                }}
              >
                Editar Perfil
              </Button>
            </div>
  
            {/* Sección Derecha: Información del perfil */}
            <div className="flex-1">
              <h6 className="text-3xl font-bold text-gray-800 mb-6">Tu Perfil</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {[
                  { label: "Nombre(s):", value: perfil.nombre },
                  { label: "Apellidos:", value: perfil.apellido },
                  { label: "Tipo de documento:", value: perfil.tipo_documento },
                  { label: "Número de documento:", value: perfil.documento_identidad },
                  { label: "Dirección:", value: perfil.direccion },
                  { label: "Correo Electrónico:", value: perfil.correo },
                  { label: "Teléfono:", value: perfil.telefono },
                  { label: "Rol:", value: perfil.rol }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-100 rounded-lg shadow-md border border-gray-300 hover:border-2 hover:border-warning-500 transition-colors"
                  >
                    <label className="font-semibold text-gray-700">{item.label}</label>
                    <p className="text-gray-600">{item.value || "No disponible"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {perfil.rol === 'usuario' && (
          <div className="absolute bottom-20 right-0 mr-4 flex flex-col items-center">
          <Button
            radius="full"
            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg h-24 w-24 flex items-center justify-center"
            onClick={handleRequestRoleChange}
            css={{
              borderRadius: "50%", // Hace el botón completamente redondeado
              '&:hover': {
                backgroundColor: '#f59e0b', // Color al hacer hover
              },
            }}
          >
            Click Aquí
          </Button>
          <p className="text-lg font-medium text-gray-700 text-center mt-4">
            <span className='block'>Esta opción te</span>
            <span className='block'>permite solicitar un</span>
            <span className='block'>cambio de rol superior</span>
              
          </p>
        </div>
        
        )}
        </div>
      )}
  
      {modalOpen && (
        <PerfilModal
          open={modalOpen}  // Aquí se pasa correctamente el estado
          onClose={() => setModalOpen(false)}  // Función para cerrar el modal
          handleSubmit={handleSubmit}
          title="Editar Perfil"
          initialData={initialData}
          mode={mode}
          refreshPerfil={refreshPerfil}
        />
      )}
    </>
  );
  
}

export default PerfilUsuario;
