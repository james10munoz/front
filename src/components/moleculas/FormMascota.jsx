import React, { useEffect, useState, useContext, useRef } from "react";
import { ModalFooter, Input, Textarea, Avatar, AvatarGroup } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { CameraIcon } from "../nextUI/CameraIcon.jsx";
import MascotasContext from "../../context/MascotasContext.jsx";
import axiosClient from "../axiosClient.js";

const FormMascotas = ({ mode, handleSubmit, onClose, actionLabel }) => {
  // Estados para manejar los datos del formulario
  const [categorias, setCategorias] = useState([]);
  const [razas, setRazas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [razaSeleccionada, setRazaSeleccionada] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState("");
  
  // Estados para los datos de la mascota
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [estado, setEstado] = useState("En Adopcion");
  const [descripcion, setDescripcion] = useState("");
  const [esterilizacion, setEsterilizacion] = useState("");
  const [tamano, setTamano] = useState("");
  const [peso, setPeso] = useState("");
  const [sexo, setSexo] = useState("");
  const [fotos, setFotos] = useState([null, null, null, null]);
  const [nuevasFotos, setNuevasFotos] = useState([]);
  const fileInputRef = useRef(null);
  const { idMascota } = useContext(MascotasContext);

  // Estados para errores
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const res = await axiosClient.get("/departamentos/listar");
        setDepartamentos(res.data);
      } catch (error) {
        console.error("Error al obtener departamentos:", error);
        alert("Error al obtener departamentos.");
      }
    };

    const fetchCategorias = async () => {
      try {
        const res = await axiosClient.get("/categorias/listar");
        setCategorias(res.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        alert("Error al obtener categorías.");
      }
    };

    fetchDepartamentos();
    fetchCategorias();
  }, []);

  // Obtener razas cuando cambia la categoría seleccionada
  useEffect(() => {
    const fetchRazas = async () => {
      try {
        if (categoriaSeleccionada) {
          const res = await axiosClient.get(`/razas/listar/${categoriaSeleccionada}`);
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

  // Obtener municipios cuando cambia el departamento seleccionado
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        if (departamentoSeleccionado) {
          const res = await axiosClient.get(`/municipios/listar/${departamentoSeleccionado}`);
          setMunicipios(res.data);
        } else {
          setMunicipios([]);
        }
      } catch (error) {
        console.error("Error al obtener municipios:", error);
        alert("Error al obtener municipios.");
      }
    };
    fetchMunicipios();
  }, [departamentoSeleccionado]);
  
 // useEffect para la edición
 useEffect(() => {
  console.log('Datos recibidos para edición:', idMascota);
  if (mode === "update" && idMascota) {
    setNombre(idMascota.nombre_mascota || "");
    setFechaNacimiento(idMascota.fecha_nacimiento ? new Date(idMascota.fecha_nacimiento).toISOString().split("T")[0] : "");
    setEstado(idMascota.estado || "En Adopcion");
    setDescripcion(idMascota.descripcion || "");
    setEsterilizacion(idMascota.esterilizado || "");
    setTamano(idMascota.tamano || "");
    setPeso(idMascota.peso || "");
    setCategoriaSeleccionada(idMascota.fk_id_categoria || "");
    setRazaSeleccionada(idMascota.fk_id_raza || "");
    setDepartamentoSeleccionado(idMascota.fk_id_departamento || "");
    setMunicipioSeleccionado(idMascota.fk_id_municipio || "");
    setSexo(idMascota.sexo || "");

    const imagenesArray = idMascota.imagenes
    ? idMascota.imagenes.split(",").map((img) => `${axiosClient.defaults.baseURL}/uploads/${img}`)
    : [];
  const updatedImages = [null, null, null, null];
  imagenesArray.forEach((img, idx) => {
    if (idx < 4) updatedImages[idx] = { uri: img };
  });
  setFotos(updatedImages);
  }
}, [mode, idMascota]);

const handleImageChange = (index) => {
  fileInputRef.current.click();
  fileInputRef.current.onchange = (event) => {
    const newImage = event.target.files[0];
    if (newImage) {
      const updatedImages = [...fotos];
      updatedImages[index] = { uri: URL.createObjectURL(newImage) };
      setNuevasFotos((prev) => {
        const updatedNewImages = [...prev];
        updatedNewImages[index] = newImage;
        return updatedNewImages;
      });
      setFotos(updatedImages);
    }
  };
};

// Manejo del envío del formulario
const handleFormSubmit = async (e) => {
  e.preventDefault();
  let validationErrors = {};

  // Validaciones de campos
  if (!nombre) validationErrors.nombre = "El nombre es obligatorio.";
  if (!fechaNacimiento) validationErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
  if (!tamano) validationErrors.tamano = "Debe seleccionar un tamaño.";
  if (!peso || peso <= 0) validationErrors.peso = "El peso es obligatorio y debe ser mayor a 0.";
  if (!categoriaSeleccionada) validationErrors.categoria = "Debe seleccionar una categoría.";
  if (!razaSeleccionada) validationErrors.raza = "Debe seleccionar una raza.";
  if (!departamentoSeleccionado) validationErrors.departamento = "Debe seleccionar un departamento.";
  if (!municipioSeleccionado) validationErrors.municipio = "Debe seleccionar un municipio.";
  if (!sexo) validationErrors.sexo = "Debe seleccionar el sexo.";
  if (!esterilizacion) validationErrors.esterilizacion = "Debe seleccionar si está esterilizado.";
  if (!descripcion) validationErrors.descripcion = "La descripción es obligatoria.";
  if (mode === "create" && nuevasFotos.length === 0) validationErrors.imagenes = "Debe subir al menos una imagen.";

  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) return;

  const formData = new FormData();
  formData.append("nombre_mascota", nombre);
  formData.append("fecha_nacimiento", fechaNacimiento);
  formData.append("estado", estado);
  formData.append("descripcion", descripcion);
  formData.append("esterilizado", esterilizacion);
  formData.append("tamano", tamano);
  formData.append("peso", peso);
  formData.append("id_categoria", categoriaSeleccionada);
  formData.append("id_raza", razaSeleccionada);
  formData.append("id_departamento", departamentoSeleccionado);
  formData.append("id_municipio", municipioSeleccionado);
  formData.append("sexo", sexo);

  console.log({
    id_categoria: categoriaSeleccionada,
    id_raza: razaSeleccionada,
    id_departamento: departamentoSeleccionado,
    id_municipio: municipioSeleccionado,
  });
  

    // Adjuntar imágenes nuevas al formulario
    nuevasFotos.forEach((imagen) => {
      if (imagen) formData.append("imagenes", imagen);
    });
    

  handleSubmit(formData, e);
};

  return (
    <form method="post" onSubmit={handleFormSubmit} encType="multipart/form-data">
      <div className="flex flex-row items-center mt-64 mb-12 justify-center">
        <AvatarGroup isBordered max={4} size={20} className="gap-1">
          {fotos.map((imagen, index) => (
            <div key={`image-${index}`} className="image-wrapper">
              <Avatar
                showFallback
                size="lg"
                src={imagen ? imagen.uri : null}
                className="w-24 h-24 cursor-pointer mb-4"
                onClick={() => handleImageChange(index)}
              />
              {!imagen && (
                <span className="text-gray-500 text-xs">Agregar Imagen</span>
              )}
            </div>
          ))}
        </AvatarGroup>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
        />
        {errors.imagenes && <p className="text-red-500 text-xs ml-5 mt-1">{errors.imagenes}</p>}
      </div>
      
      <div className="flex justify-center">
        <div className="flex flex-col mr-4">
          {/* Nombre */}
          <div className="py-2">
            <Input
              type="text"
              label="Nombre de la mascota"
              className="w-80"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrors((prev) => ({ ...prev, nombre: "" })); // Ocultar error al escribir
              }}
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          {/* Fecha de nacimiento */}
          <p>Fecha de Nacimiento Aproximada</p>
          <div className="py-2">
            <input
              type="date"
              className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl"
              value={fechaNacimiento}
              onChange={(e) => {
                setFechaNacimiento(e.target.value);
                setErrors((prev) => ({ ...prev, fechaNacimiento: "" })); // Ocultar error al escribir
              }}
            />
            {errors.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento}</p>}
          </div>

          {/* Tamaño */}
          <div className="py-2">
          <p>Tamaño</p>
            <select
              className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl"
              value={tamano}
              onChange={(e) => {
                setTamano(e.target.value);
                setErrors((prev) => ({ ...prev, tamano: "" })); // Ocultar error al escribir
              }}
            >
              <option value="" hidden>Seleccionar Tamaño</option>
              <option value="Grande">Grande</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Mediano">Mediano</option>
              <option value="Pequeno">Pequeño</option>
            </select>
            {errors.tamano && <p className="text-red-500 text-xs mt-1">{errors.tamano}</p>}
          </div>

          {/* Peso */}
          <div className="py-2">
          <p>Peso</p>
            <Input
              type="number"
              label="Peso (kg)"
              className="w-80"
              value={peso}
              onChange={(e) => {
                setPeso(e.target.value);
                setErrors((prev) => ({ ...prev, peso: "" })); // Ocultar error al escribir
              }}
              min="0"
            />
            {errors.peso && <p className="text-red-500 text-xs mt-1">{errors.peso}</p>}
          </div>

          {/* Categoría */}
      <div className="flex flex-col space-y-2">
      <p>Categoría</p>
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300"
          required
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.nombre_categoria}
            </option>
          ))}
        </select>
      </div> 

      {/* Raza */}
      <div className="flex flex-col space-y-2 mt-4">
      <p>Raza</p>
        <select
          value={razaSeleccionada}
          onChange={(e) => setRazaSeleccionada(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300"
          required
        >
          <option value="">Seleccione una raza</option>
          {razas.map((raza) => (
            <option key={raza.id_raza} value={raza.id_raza}>
              {raza.nombre_raza}
            </option>
          ))}
        </select>
      </div>
          {/* Departamento */}
          <div className="py-2">
          <p>Departamentos</p>
            <select
              className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl"
              value={departamentoSeleccionado}
              onChange={(e) => {
                setDepartamentoSeleccionado(e.target.value);
                setErrors((prev) => ({ ...prev, departamento: "" })); // Ocultar error al escribir
              }}
            >
              <option value="" hidden>Seleccionar Departamento</option>
              {departamentos.map((depar) => (
                <option key={depar.id_departamento} value={depar.id_departamento}>{depar.nombre_departamento}</option>
              ))}
            </select>
            {errors.departamento && <p className="text-red-500 text-xs mt-1">{errors.departamento}</p>}
          </div>
        </div>
        {/* Columna derecha */}
        <div className="flex flex-col ml-4">
          {/* Municipio */}
          <div className="py-2">
          <p>Municipio</p>
            <select
              className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl"
              value={municipioSeleccionado}
              onChange={(e) => {
                setMunicipioSeleccionado(e.target.value);
                setErrors((prev) => ({ ...prev, municipio: "" })); // Ocultar error al escribir
              }}
            >
              <option value="" hidden>Seleccionar Municipio</option>
              {municipios.map((muni) => (
                <option key={muni.id_municipio} value={muni.id_municipio}>{muni.nombre_municipio}</option>
              ))}
            </select>
            {errors.municipio && <p className="text-red-500 text-xs mt-1">{errors.municipio}</p>}
          </div>

          {/* Sexo */}
          <div className="py-2">
          <p>Sexo</p>
            <select
              className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl"
              value={sexo}
              onChange={(e) => {
                setSexo(e.target.value);
                setErrors((prev) => ({ ...prev, sexo: "" })); // Ocultar error al escribir
              }}
            >
              <option value="" hidden>Seleccionar Sexo</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
            {errors.sexo && <p className="text-red-500 text-xs mt-1">{errors.sexo}</p>}
          </div>

          {/* Esterilización */}
          <div className="py-2">
          <p>Esterelizado</p>
            <select
              className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl"
              value={esterilizacion}
              onChange={(e) => {
                setEsterilizacion(e.target.value);
                setErrors((prev) => ({ ...prev, esterilizacion: "" })); // Ocultar error al escribir
              }}
            >
              <option value="" hidden>¿Está esterilizado?</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
            {errors.esterilizacion && <p className="text-red-500 text-xs mt-1">{errors.esterilizacion}</p>}
          </div>

          {/* Descripción */}
          <div className="py-2">
          
            <Textarea
              label="Descripción de la mascota"
              className="w-80"
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                setErrors((prev) => ({ ...prev, descripcion: "" })); // Ocultar error al escribir
              }}
            />
            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
          </div>

          {/* Estado */}
          <div className="py-2">
          <p>Estado</p>
            <select
              className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl"
              value={estado}
              onChange={(e) => {
                setEstado(e.target.value);
                setErrors((prev) => ({ ...prev, estado: "" })); // Ocultar error al escribir
              }}
            >
              <option value="" hidden>Seleccionar Estado</option>
              <option value="En Adopcion">En Adopción</option>
              <option value="Reservado">Reservado</option>
              <option value="Urgente">Urgente</option>
              <option value="Adoptado">Adoptado</option>
            </select>
            {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button color="danger" variant="flat" onClick={onClose}>Cancelar</Button>
        <Button type="submit" color="warning" className="text-white">{actionLabel}</Button>
      </ModalFooter>
    </form>
  );
};

export default FormMascotas;
