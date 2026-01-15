import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved';
  votes: number;
  location: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  date: string;
}

interface CityMapProps {
  issues: Issue[];
  onVote: (id: number) => void;
}

const createCustomIcon = (status: string) => {
  const colors: Record<string, string> = {
    'pending': '#eab308',
    'in-progress': '#3b82f6',
    'resolved': '#10b981'
  };

  const color = colors[status] || colors.pending;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const MapController = () => {
  const map = useMap();
  
  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  return null;
};

const CityMap = ({ issues, onVote }: CityMapProps) => {
  const center: [number, number] = [55.7558, 37.6173];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'На рассмотрении' },
      'in-progress': { color: 'bg-blue-100 text-blue-800', label: 'В работе' },
      'resolved': { color: 'bg-green-100 text-green-800', label: 'Решено' }
    };
    return variants[status] || variants.pending;
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-green-200 shadow-lg">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapController />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.lat, issue.lng]}
            icon={createCustomIcon(issue.status)}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusBadge(issue.status).color}>
                    {getStatusBadge(issue.status).label}
                  </Badge>
                  <Badge variant="outline">{issue.category}</Badge>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{issue.title}</h3>
                {issue.imageUrl && (
                  <img 
                    src={issue.imageUrl} 
                    alt={issue.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Icon name="MapPin" size={12} className="text-green-600" />
                    {issue.location}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => onVote(issue.id)}
                  >
                    <Icon name="ThumbsUp" size={12} className="text-green-600 mr-1" />
                    {issue.votes}
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CityMap;
