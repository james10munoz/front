import React from "react";
import Header from '../moleculas/Header.jsx';
import { useNavigate } from 'react-router-dom';

const Reportes = () => {
  const navigate = useNavigate();

  const handleSubmitAdopcion = (e) => {
    e.preventDefault();
    navigate('/Filtrosreporte'); // Redirige a la vista de filtros de reportes para adopción
  };

  const handleSubmitAdoptadas = (e) => {
    e.preventDefault();
    navigate('/FiltrosreporteAdoptadas'); // Redirige a la vista de filtros de reportes para adoptadas
  };

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <Header title="Reportes de Mascotas" />

      {/* Diseño circular para los reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl w-full px-6 mt-16">
        
        {/* Botón circular: Reportes de Mascotas en Adopción */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 h-48 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-full shadow-md flex items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer"
               onClick={handleSubmitAdopcion}>
            <div className="text-center">
              <h2 className="text-xl font-bold">Mascotas en Adopción</h2>
              <p className="text-sm mt-2">Generar Reportes</p>
            </div>
          </div>
          <p className="text-gray-600 text-center mt-4 max-w-xs">
            Genera reportes detallados de las mascotas disponibles para adopción. Puedes filtrar por fechas, categoría, raza, y exportar en PDF.
          </p>
        </div>

        {/* Botón circular: Reportes de Mascotas Adoptadas */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 h-48 bg-green-400 hover:bg-green-500 text-white font-bold rounded-full shadow-md flex items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer"
               onClick={handleSubmitAdoptadas}>
            <div className="text-center">
              <h2 className="text-xl font-bold">Mascotas Adoptadas</h2>
              <p className="text-sm mt-2">Generar Reportes</p>
            </div>
          </div>
          <p className="text-gray-600 text-center mt-4 max-w-xs">
            Genera reportes de las mascotas que han sido adoptadas. Filtra por código del animal, rango de fechas, categoría, y raza, y exporta en PDF.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
