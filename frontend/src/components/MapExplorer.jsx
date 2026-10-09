import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Building, 
  Waves, 
  DollarSign, 
  Eye, 
  Mail, 
  ShieldCheck, 
  Compass, 
  Layers, 
  Sparkles,
  Maximize2
} from 'lucide-react';

// Custom Map Controller to smoothly fly to coordinates
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Function to generate sleek custom HTML DivIcons for properties
const createCustomMarker = (property, isSelected) => {
  const isSold = property.status !== 'available';
  const priceShort = property.price >= 1000000 
    ? `$${(property.price / 1000000).toFixed(1)}M` 
    : `$${(property.price / 1000).toFixed(0)}k`;

  let badgeColor = '#4F46E5'; // Iris default
  if (property.property_type === 'beach_house') badgeColor = '#06B6D4'; // Cyan
  if (property.property_type === 'commercial') badgeColor = '#3B82F6'; // Blue
  if (property.property_type === 'farmhouse') badgeColor = '#10B981'; // Emerald
  if (property.property_type === 'warehouse') badgeColor = '#F59E0B'; // Amber
  if (isSold) badgeColor = '#EF4444'; // Red

  const html = `
    <div style="
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: ${isSelected ? '#1E1B4B' : 'white'};
      color: ${isSelected ? 'white' : '#111827'};
      border: 2px solid ${badgeColor};
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.2);
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
      transform: translate(-50%, -50%);
      transition: all 0.2s ease;
      cursor: pointer;
    ">
      <span style="
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${badgeColor};
        display: inline-block;
      "></span>
      <span>${isSold ? 'SOLD' : priceShort}</span>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-property-pin',
    iconSize: [60, 24],
    iconAnchor: [30, 12]
  });
};

export default function MapExplorer({
  properties,
  onViewDetails,
  onSendEnquiry
}) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState([36.7783, -119.4179]); // California / US default
  const [mapZoom, setMapZoom] = useState(4);
  const [apiKey, setApiKey] = useState('fNh4NicWemylXMbYjyAY');
  const [mapStyle, setMapStyle] = useState('maptiler-streets');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    setTileError(false);
  }, [mapStyle, apiKey]);

  // Map Tile Source Configuration
  const tileSources = {
    'maptiler-streets': {
      name: 'MapTiler Streets',
      url: `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${apiKey}`,
      attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxZoom: 20
    },
    'maptiler-basic': {
      name: 'MapTiler Basic',
      url: `https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=${apiKey}`,
      attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxZoom: 20
    },
    'maptiler-satellite': {
      name: 'MapTiler Satellite',
      url: `https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=${apiKey}`,
      attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxZoom: 20
    },
    'cartodb-voyager': {
      name: 'CartoDB Voyager (Fallback)',
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    }
  };

  const currentTileConfig = tileSources[mapStyle] || tileSources['maptiler-streets'];

  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter properties by category on map
  const filteredMapProps = properties.filter(p => {
    if (categoryFilter === 'all') return true;
    return p.property_type === categoryFilter;
  });

  const jumpToRegion = (coords, zoom) => {
    setMapCenter(coords);
    setMapZoom(zoom);
  };

  return (
    <section id="map-section" className="py-16 lg:py-24 bg-ivory-100/60 border-t border-b border-neutral-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iris-50 border border-iris-200 text-iris-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Geospatial Property Discovery</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Find Nearby Property Sellers & Global Locations
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
              All 80 properties mapped in high precision. Click any price marker to preview seller credentials, architectural specs, and availability.
            </p>
          </div>

          {/* Quick Regional Jump Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 mr-1 hidden sm:inline">Jump to:</span>
            <button
              onClick={() => jumpToRegion([34.0522, -118.2437], 7)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-colors"
            >
              West Coast USA
            </button>
            <button
              onClick={() => jumpToRegion([40.7128, -74.0060], 7)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-colors"
            >
              East Coast USA
            </button>
            <button
              onClick={() => jumpToRegion([48.8566, 2.3522], 5)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-colors"
            >
              Europe Hubs
            </button>
            <button
              onClick={() => jumpToRegion([35.6762, 139.6503], 5)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-colors"
            >
              Asia-Pacific
            </button>
          </div>
        </div>

        {/* Category Pills & MapTiler Style Switcher directly above Map */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-neutral-200/60">
          
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'beach_house', 'residential', 'commercial', 'farmhouse', 'warehouse'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-iris-600 text-white shadow-2xs'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {cat === 'all' ? 'All 80 Locations' : cat.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* MapTiler Style Switcher & Key Status */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Map Style:</span>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="px-2.5 py-1 rounded-xl border border-iris-300 bg-white text-xs font-bold text-iris-800 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="maptiler-streets">🗺️ MapTiler Streets (Key: fNh4...)</option>
              <option value="maptiler-basic">🏛️ MapTiler Basic</option>
              <option value="maptiler-satellite">🛰️ MapTiler Satellite</option>
              <option value="cartodb-voyager">✨ CartoDB Luxury (Fallback)</option>
            </select>

            <button
              onClick={() => setShowKeyModal(!showKeyModal)}
              className="px-2.5 py-1 rounded-xl bg-iris-50 hover:bg-iris-100 text-iris-700 text-xs font-semibold border border-iris-200 transition-colors"
              title="MapTiler API Key Settings"
            >
              Key Settings
            </button>
          </div>
        </div>

        {/* Optional Key Configuration Bar */}
        {showKeyModal && (
          <div className="mb-4 p-3.5 rounded-2xl bg-white border border-iris-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-neutral-800">MapTiler Key:</span>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="MapTiler API Key"
                className="px-2.5 py-1 rounded-lg border border-neutral-300 font-mono text-[11px] w-64"
              />
            </div>
            <div className="text-neutral-500 text-[11px]">
              Active: <code className="text-iris-600 font-bold">{apiKey}</code> • <a href="https://cloud.maptiler.com/account/keys/2d75be78-8519-4cae-aad1-b22f7c18b643/settings" target="_blank" rel="noreferrer" className="text-iris-600 underline font-semibold">MapTiler Cloud Settings</a>
            </div>
          </div>
        )}

        {/* Map Container + Side Preview Drawer */}
        <div className="relative rounded-3xl overflow-hidden border border-neutral-300 shadow-xl bg-neutral-100 h-[520px] sm:h-[600px]">
          
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}
          >
            <MapController center={mapCenter} zoom={mapZoom} />

            {/* Dynamic MapTiler Tile Layer */}
            <TileLayer
              key={`${mapStyle}-${apiKey}`}
              attribution={currentTileConfig.attribution}
              url={currentTileConfig.url}
              maxZoom={currentTileConfig.maxZoom || 19}
              eventHandlers={{
                tileerror: () => {
                  setTileError(true);
                }
              }}
            />

            {/* Render 80 property pins */}
            {filteredMapProps.map((prop) => (
              <Marker
                key={prop.id}
                position={[prop.lat, prop.lng]}
                icon={createCustomMarker(prop, selectedProperty?.id === prop.id)}
                eventHandlers={{
                  click: () => {
                    setSelectedProperty(prop);
                    setMapCenter([prop.lat, prop.lng]);
                  }
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="w-56 p-1 text-left">
                    <img
                      src={prop.image_url}
                      alt={prop.title}
                      className="w-full h-24 object-cover rounded-xl mb-2"
                    />
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-bold text-iris-600 uppercase">{prop.property_type.replace('_', ' ')}</span>
                      <span className="font-extrabold text-neutral-900">${prop.price.toLocaleString()}</span>
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{prop.title}</h4>
                    <p className="text-[10px] text-neutral-500 truncate mb-2">{prop.location}</p>
                    
                    <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-100">
                      <button
                        onClick={() => onViewDetails(prop)}
                        className="flex-1 py-1 rounded-lg bg-iris-600 text-white text-[10px] font-bold text-center hover:bg-iris-700"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onSendEnquiry(prop)}
                        className="flex-1 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-[10px] font-bold text-center hover:bg-neutral-200"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* MapTiler tile error floating fallback prompt */}
          {tileError && mapStyle.startsWith('maptiler') && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 rounded-2xl bg-neutral-900/90 text-white shadow-2xl text-xs font-semibold flex items-center gap-3 backdrop-blur-md border border-iris-400 animate-in slide-in-from-top-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>MapTiler Key ({apiKey.slice(0, 6)}...) needs localhost origin in MapTiler settings.</span>
              <button
                onClick={() => setMapStyle('cartodb-voyager')}
                className="px-3 py-1 rounded-xl bg-iris-600 hover:bg-iris-700 text-white font-bold transition-colors shadow-sm"
              >
                Switch to Luxury Map
              </button>
            </div>
          )}

          {/* Floating Selected Property Quick Card (Bottom Left) */}
          {selectedProperty && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-[1000] glass-panel p-4 rounded-2xl shadow-2xl border border-white animate-in slide-in-from-bottom-3">
              <div className="flex items-start gap-3">
                <img
                  src={selectedProperty.image_url}
                  alt={selectedProperty.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-iris-600">
                      {selectedProperty.property_type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-black text-neutral-900">
                      ${selectedProperty.price.toLocaleString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 truncate mt-0.5">
                    {selectedProperty.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 truncate">
                    {selectedProperty.location}
                  </p>
                  
                  {/* Seller Mini Tag */}
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-neutral-600">
                    <img
                      src={selectedProperty.seller_avatar}
                      alt={selectedProperty.seller_name}
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="font-semibold truncate">{selectedProperty.seller_name}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500">{selectedProperty.seller_agency}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-2">
                <button
                  onClick={() => onViewDetails(selectedProperty)}
                  className="flex-1 py-1.5 rounded-xl bg-iris-600 hover:bg-iris-700 text-white text-xs font-bold transition-colors"
                >
                  View Full Details
                </button>
                <button
                  onClick={() => onSendEnquiry(selectedProperty)}
                  className="flex-1 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors"
                >
                  Contact Seller
                </button>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="px-2 py-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
