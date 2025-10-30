import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import './mapMoving.css';

// --- DADOS GEOGRÁFICOS E ROTA ---
const PONTOS_DA_ROTA = {
    bh: [-19.9227, -43.9451],
    itabirito: [-20.2528, -43.8008],
    ouroPreto: [-20.3858, -43.5042],
    mariana: [-20.3775, -43.4158],
    congonhas: [-20.5003, -43.8569],
    lafaiete: [-20.6600, -43.7861],
    ouroBranco: [-20.5208, -43.6919],
    vicosa: [-20.7539, -42.8820],
    ponteNova: [-20.4158, -42.9089],
    santaBarbara: [-19.9589, -43.4150],
    catasAltas: [-20.0750, -43.4078],
    // Pontos intermediários para suavizar o caminho
    ponto1: [-20.10, -43.85], 
    ponto2: [-20.30, -43.70], 
    ponto3: [-20.35, -43.45], 
    ponto4: [-20.20, -43.35], 
    ponto5: [-20.50, -43.00], 
    ponto6: [-20.60, -43.20], 
    ponto7: [-20.60, -43.50], 
    ponto8: [-20.60, -43.70], 
};

// Define a sequência de IDs dos pontos/cidades que o carro seguirá
const ROTA_SUAVE_IDS = [
    'bh', 'ponto1', 'itabirito', 'ponto2', 'ouroPreto', 'ponto3', 'mariana',
    'ponto4', 'santaBarbara', 'catasAltas', 'ponto5', 'ponteNova', 'ponto6', 'vicosa',
    'ouroBranco', 'ponto7', 'lafaiete', 'ponto8', 'congonhas', 'bh'
];

// Mapeia os IDs para suas posições geográficas (Formato para Polyline)
const ROTA_COMPLETA_GEO = ROTA_SUAVE_IDS.map(id => PONTOS_DA_ROTA[id]);

// Velocidade da animação (tempo para percorrer cada segmento da rota)
const VELOCIDADE_SEGMENTO_MS = 1500; // 1.5 segundos por segmento

// Cidades com marcadores estáticos (apenas as cidades, não os pontos intermediários)
const CIDADES_MARCADORES = Object.keys(PONTOS_DA_ROTA)
    .filter(key => key.includes('bh') || key.includes('itabirito') || key.includes('ouroPreto') || 
                   key.includes('mariana') || key.includes('congonhas') || key.includes('lafaiete') ||
                   key.includes('ouroBranco') || key.includes('vicosa') || key.includes('ponteNova') ||
                   key.includes('santaBarbara') || key.includes('catasAltas'))
    .map(key => ({ id: key, nome: PONTOS_DA_ROTA[key], pos: PONTOS_DA_ROTA[key] }));


// Define o ícone do carro (emoji)
const carroIcon = new L.DivIcon({
    html: '🚗',
    className: 'carro-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12] 
});

// Componente principal do Mapa
const MapMoving = () => {
    // Posição inicial do carro
    const [posicaoCarro, setPosicaoCarro] = useState(ROTA_COMPLETA_GEO[0]);
    const [indiceRota, setIndiceRota] = useState(0);

    // Ref para o marcador do carro (para poder controlá-lo diretamente se precisar)
    const markerRef = useRef(null);

    // Efeito para animar o carro
    useEffect(() => {
        const timer = setTimeout(() => {
            const proximoIndice = (indiceRota + 1) % ROTA_COMPLETA_GEO.length;
            const novaPosicao = ROTA_COMPLETA_GEO[proximoIndice];
            
            // Atualiza a posição do carro
            setPosicaoCarro(novaPosicao);
            setIndiceRota(proximoIndice);

        }, VELOCIDADE_SEGMENTO_MS);

        return () => clearTimeout(timer);
    }, [indiceRota]);

    // Calcula o centro do mapa (média aproximada para a visualização inicial)
    const centroMapa = [-20.35, -43.5]; // Ajuste para centralizar sua área

    return (
        <div className="mapa-container-api">
            <h3>Nossa Área de Atuação</h3>

            <MapContainer center={centroMapa} zoom={9.4} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                

                {/* Marcadores Estáticos das Cidades (apenas as cidades, não os pontos intermediários) */}
                {Object.values(CIDADES_MARCADORES).map(ponto => (
                    <Marker key={ponto.id} position={ponto.pos}>
                        <Popup>{ponto.id}</Popup> {/* Mostra o ID/Nome */}
                    </Marker>
                ))}

                {/* Marcador Animado (o Carro) */}
                {posicaoCarro && (
                    <Marker 
                        position={posicaoCarro} 
                        icon={carroIcon} 
                        ref={markerRef}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default MapMoving;