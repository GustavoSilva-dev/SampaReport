import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function MapCard() {
    return (
        <aside className="order-first static moveRight moveRight-delay-1 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm lg:order-none lg:sticky lg:top-20">
            <h2 className="px-0.5 py-1 text-sm font-medium">Mapa de Ocorrências</h2>
            <div className="mt-1 h-[294px] rounded-lg border border-dashed border-zinc-200 bg-white" aria-label="Área reservada para o mapa de ocorrências">
                <RenderMap />
            </div>
            <div className="mt-2 rounded-lg border border-zinc-200 bg-gradient-to-r from-emerald-500 to-emerald-700 px-3 py-2.5 text-[11px] leading-4 text-white">
                <span className="underline">Apoio comunitário:</span><br /> Apenas ocorrências com 5 apoios entram para o painel de chamados da Prefeitura
            </div>
        </aside>
    )
}


function RenderMap() {
    const customUserMarker = L.divIcon({
        className: 'custom-user-marker',
        html: `
    <div style="
      background-color: #d0fae5; 
      width: 36px; 
      height: 36px; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      color: oklch(43.2% 0.095 166.913); 
      font-weight: normal; 
      font-family: "Momo Trust Display", sans-serif;
      font-size: 18px;
      border: 50px solid white; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    ">
      G
    </div>
  `,
        iconSize: [36, 36],
        iconAnchor: [18, 18], // Centraliza o ponto do marcador na coordenada exata
        popupAnchor: [0, -18]
    });
    const posicaoPadrao: [number, number] = [-23.55052, -46.633308];

    return (
        <MapContainer
            center={posicaoPadrao}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={posicaoPadrao} icon={customUserMarker}>
                <Popup>
                    Ocorrência registrada no bairro
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default MapCard