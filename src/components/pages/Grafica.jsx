import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axiosClient from '../axiosClient';
import Header from '../moleculas/Header.jsx';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const GraficasMascotas = () => {
    const [mascotasData, setMascotasData] = useState({
        labels: [],
        datasets: [{
            label: 'Mascotas por Estado',
            data: [],
            backgroundColor: ['#66e717', '#f948bc', '#a333ff', '#82e0aa', '#f39c12'],
            hoverBackgroundColor: ['#42a903', '#fb39a9', '#8019d5', '#79e0aa', '#f1c40f'],
            hoverOffset: 10,
            borderWidth: 2,
            borderColor: '#ffffff',
        }],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [noData, setNoData] = useState(false);  // Para manejar la ausencia de datos

    useEffect(() => {
        const fetchMascotasData = async () => {
            try {
                const response = await axiosClient.get('/mascotas/conteo/estado');
                
                if (Array.isArray(response.data) && response.data.length > 0 && response.data.every(item => item.estado && item.total > 0)) {
                    const estados = response.data.map(item => item.estado);
                    const totales = response.data.map(item => item.total);

                    setMascotasData({
                        labels: estados,
                        datasets: [{
                            label: 'Mascotas por Estado',
                            data: totales,
                            backgroundColor: ['#66e717', '#f948bc', '#a333ff', '#82e0aa', '#f39c12'], 
                            hoverBackgroundColor: ['#42a903', '#fb39a9', '#8019d5', '#79e0aa', '#f1c40f'],
                            hoverOffset: 10,
                            borderWidth: 2,
                            borderColor: '#ffffff',
                        }],
                    });
                    setNoData(false);  // Hay datos, no mostrar el mensaje de "Sin datos"
                } else {
                    setNoData(true);  // No hay datos
                }
            } catch (error) {
                console.error('Error fetching mascotas data:', error);
                setError('No se han obtenido datos de mascotas para generar estadisticas.');
            } finally {
                setLoading(false);
            }
        };

        fetchMascotasData();
    }, []);

    const optionsDoughnut = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 16,
                    },
                    color: '#fff'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    }
                },
                backgroundColor: '#fff',
                titleColor: '#333',
                bodyColor: '#333',
            }
        },
        maintainAspectRatio: false,
        cutout: '70%',
        animation: {
            animateRotate: true,
            animateScale: true,
        }
    };

    return (
        <>
            <Header title="Estadísticas de Mascotas" />
            <div className="p-8 flex justify-center items-center bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 mt-16 min-h-screen">
                <div className="w-full max-w-md">
                    <h2 className="text-center text-2xl font-bold text-white mb-8">Mascotas por Estado</h2>
                    <div className="relative bg-gray-700 p-6 rounded-xl shadow-lg">
                        {loading ? (
                            <p className="text-white">Cargando...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : noData ? (
                            <p className="text-yellow-500">No hay datos disponibles para mostrar.</p>
                        ) : (
                            <Doughnut data={mascotasData} options={optionsDoughnut} style={{ height: '400px' }} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default GraficasMascotas;
