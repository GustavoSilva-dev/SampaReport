import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function MapCard() {
    return (
        <aside className="moveRight moveRight-delay-1 sticky top-20 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm">
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
            <Marker position={posicaoPadrao}>
                <Popup>
                    Olá! Este é um mapa com React Leaflet.
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default MapCard