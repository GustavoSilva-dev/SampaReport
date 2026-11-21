import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { ReportResponseDTO } from '../types';
import type { UsuarioResponseDTO } from '../services/userService';

interface MapCardProps {
    reports?: ReportResponseDTO[];
    users?: UsuarioResponseDTO[];
}

function MapCard({ reports = [], users = [] }: MapCardProps) {
    return (
        <aside className="order-first static moveRight moveRight-delay-1 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm lg:order-none lg:sticky lg:top-20">
            <h2 className="px-0.5 py-1 text-sm font-medium">Mapa de Ocorrências</h2>
            <div className="mt-1 h-[375px] rounded-lg border border-dashed border-zinc-200 bg-white" aria-label="Área reservada para o mapa de ocorrências">
                <RenderMap reports={reports} users={users} />
            </div>
            <div className="mt-2 rounded-lg border border-zinc-200 bg-gradient-to-r from-emerald-500 to-emerald-700 px-3 py-2.5 text-[11px] leading-4 text-white">
                <span className="underline">Apoio comunitário:</span><br /> Apenas ocorrências com 5 apoios entram para o painel de chamados da Prefeitura
            </div>
        </aside>
    )
}


function RenderMap({ reports, users = [] }: MapCardProps) {
    const posicaoPadrao: [number, number] = [-23.55052, -46.633308];

    return (
        <MapContainer
            center={posicaoPadrao}
            zoom={10}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports?.map((report) => {
                const user = users.find((item) => item.id === report.usuarioId)
                const initial = user?.nome.trim().charAt(0).toUpperCase() || '?'

                return (
                <Marker
                    key={report.id}
                    position={[report.latitude, report.longitude]}
                    icon={L.divIcon({
                        className: 'custom-user-marker',
                        html: `
                        <div class="avatar-pulse-container">
                        <div class="avatar-pulse-ring"></div>
                        <div style="
                            z-index: 1;
                            background-color: #d0fae5;
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: oklch(43.2% 0.095 166.913);
                            font-size: 14px;
                            font-weight: 700;
                            border: 3px solid white;
                            box-shadow: 0 3px 8px rgba(24, 60, 54, 0.35);
                        ">${initial}</div></div>
                    `,
                        iconSize: [36, 36],
                        iconAnchor: [18, 18],
                        popupAnchor: [0, -18]
                    })}
                >
                    <Popup>{report.titulo}</Popup>
                </Marker>
                )
            })}
        </MapContainer>
    )
}

export default MapCard