import React, { useState, useEffect } from "react";
import Header from '../moleculas/Header.jsx';
import axiosClient from '../axiosClient.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const FiltrosReporteAdoptadas = () => {
  const [tipoFecha, setTipoFecha] = useState("dia"); // 'dia', 'mes', 'rango'
  const [fechaDia, setFechaDia] = useState(new Date());
  const [fechaMes, setFechaMes] = useState(new Date());
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [categorias, setCategorias] = useState([]);
  const [razas, setRazas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [razaSeleccionada, setRazaSeleccionada] = useState("");

  // Obtener categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axiosClient.get("/categorias/listar");
        if (res.data.length === 0) {
          alert("No se encontraron categorías disponibles.");
        }
        setCategorias(res.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        alert("Error al obtener categorías.");
      }
    };
    fetchCategorias();
  }, []);

  // Obtener razas cuando cambia la categoría
  useEffect(() => {
    const fetchRazas = async () => {
      try {
        if (categoriaSeleccionada) {
          const res = await axiosClient.get(`/razas/listar?categoria=${categoriaSeleccionada}`);
          if (res.data.length === 0) {
            alert("No se encontraron razas para la categoría seleccionada.");
          }
          setRazas(res.data);
        } else {
          setRazas([]);
        }
      } catch (error) {
        console.error("Error al obtener razas:", error);
        alert("Error al obtener razas.");
      }
    };
    fetchRazas();
  }, [categoriaSeleccionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let params = { tipo_fecha: tipoFecha };

    // Validaciones de fecha
    if (tipoFecha === "dia") {
        params.fecha_inicio = moment(fechaDia).format("YYYY-MM-DD");
    } else if (tipoFecha === "mes") {
        params.fecha_inicio = moment(fechaMes).format("MM-YYYY");
    } else if (tipoFecha === "rango") {
        params.fecha_inicio = moment(fechaInicio).format("YYYY-MM-DD");
        params.fecha_fin = moment(fechaFin).format("YYYY-MM-DD");
    }

    // Validación de categorías y razas seleccionadas
    if (categoriaSeleccionada) {
        params.categoria = categoriaSeleccionada;
    }

    if (razaSeleccionada) {
        params.raza = razaSeleccionada;
    }

    try {
        console.log("Parámetros enviados:", params);

        const res = await axiosClient.get("/reportes/reportea", { // Modifica la ruta según sea necesario
            params,
            responseType: "blob", // Descargar PDF
        });
        console.log("Datos de la respuesta:", res.data);

        if (res.data.size === 0) {
            console.warn("El reporte generado está vacío. No se encontraron registros para los filtros seleccionados.");
            alert("No se encontraron registros para los filtros seleccionados.");
            return;
        }

        const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Reporte_Adopciones_${Date.now()}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();

    }catch (error) {
      console.error("Error al generar el reporte:", error);
      
      // Detallar error específico
      if (error.response) {
          console.error("Error de respuesta del servidor:", error.response);
          if (error.response.status === 404) {
              alert("No se encontraron registros con los filtros proporcionados.");
          } else {
              alert("Error al generar el reporte. Por favor, verifica los filtros.");
          }
      } else if (error.request) {
          console.error("No se recibió respuesta del servidor. Detalles de la solicitud:", error.request);
          alert("No se recibió respuesta del servidor. Por favor, intente nuevamente.");
      } else {
          console.error("Error al configurar la solicitud:", error.message);
          alert("Ocurrió un error al preparar la solicitud. Intente nuevamente.");
      }
  }
};

  return (
    <div className="flex flex-col items-center mt-24 justify-center">
      <Header title="Reporte de Adopciones" />
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 mt-16 pl-52">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Generar Reporte de Mascotas Adoptadas
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Fecha */}
            <div className="flex flex-col space-y-2">
              <label className="text-lg font-medium text-gray-800">Tipo de Fecha:</label>
              <select
                value={tipoFecha}
                onChange={(e) => setTipoFecha(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300"
              >
                <option value="dia">Día</option>
                <option value="mes">Mes</option>
                <option value="rango">Rango de Fechas</option>
              </select>
            </div>

            {/* Fecha (Día, Mes, o Rango) */}
            {tipoFecha === "dia" && (
              <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium text-gray-800">Selecciona el Día Adoptado:</label>
                <DatePicker
                  selected={fechaDia}
                  onChange={(date) => setFechaDia(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300"
                />
              </div>
            )}

            {tipoFecha === "mes" && (
              <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium text-gray-800">Selecciona el Mes Adoptado:</label>
                <DatePicker
                  selected={fechaMes}
                  onChange={(date) => setFechaMes(date)}
                  dateFormat="MM-yyyy"
                  showMonthYearPicker
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300"
                />
              </div>
            )}

            {tipoFecha === "rango" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-lg font-medium text-gray-800">Fecha de Inicio:</label>
                  <DatePicker
                    selected={fechaInicio}
                    onChange={(date) => setFechaInicio(date)}
                    dateFormat="yyyy-MM-dd"
                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-lg font-medium text-gray-800">Fecha de Fin:</label>
                  <DatePicker
                    selected={fechaFin}
                    onChange={(date) => setFechaFin(date)}
                    dateFormat="yyyy-MM-dd"
                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300"
                  />
                </div>
              </div>
            )}

            {/* Categoría */}
            <div className="flex flex-col space-y-2">
              <label className="text-lg font-medium text-gray-800">Categoría:</label>
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300"
              >
                <option value="">Seleccionar Categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Raza */}
            <div className="flex flex-col space-y-2">
              <label className="text-lg font-medium text-gray-800">Raza:</label>
              <select
                value={razaSeleccionada}
                onChange={(e) => setRazaSeleccionada(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300"
            
              >
                <option value="">Seleccionar Raza</option>
                {razas.map((raza) => (
                  <option key={raza.id_raza} value={raza.id_raza}>
                    {raza.nombre_raza}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            Generar Reporte
          </button>
        </form>
      </div>
    </div>
  );
};

export default FiltrosReporteAdoptadas;
