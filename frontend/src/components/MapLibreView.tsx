import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { ChennaiZone, RoadSegment, Facility } from '../types';

interface MapLibreViewProps {
  zones: ChennaiZone[];
  roads: RoadSegment[];
  facilities: Facility[];
  selectedZone: ChennaiZone | null;
  onSelectZone: (zone: ChennaiZone) => void;
  activeLayers: {
    floodRisk: boolean;
    vulnerability: boolean;
    roads: boolean;
    facilities: boolean;
    resilientRoute: boolean;
  };
}

export const MapLibreView: React.FC<MapLibreViewProps> = ({
  zones,
  roads,
  facilities,
  selectedZone,
  onSelectZone,
  activeLayers
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Dark cartographic baseline style (High-resolution, watermark-free dark GIS canvas)
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'esri-dark-base': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            maxzoom: 16,
            attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
          },
          'esri-dark-reference': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            maxzoom: 16,
            attribution: '&copy; Esri'
          }
        },
        layers: [
          {
            id: 'esri-dark-base-layer',
            type: 'raster',
            source: 'esri-dark-base',
            minzoom: 0,
            maxzoom: 20
          },
          {
            id: 'esri-dark-reference-layer',
            type: 'raster',
            source: 'esri-dark-reference',
            minzoom: 0,
            maxzoom: 20
          }
        ]
      },
      center: [80.215, 13.01], // Central Chennai Basin
      zoom: 11.2,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      // 1. Add Chennai Zones GeoJSON source
      map.addSource('chennai-zones', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Fill layer
      map.addLayer({
        id: 'zones-fill',
        type: 'fill',
        source: 'chennai-zones',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'flood_risk_score'],
            20, 'rgba(16, 185, 129, 0.35)',
            50, 'rgba(234, 179, 8, 0.45)',
            75, 'rgba(249, 115, 22, 0.60)',
            90, 'rgba(220, 38, 38, 0.75)'
          ],
          'fill-opacity': 0.85
        }
      });

      // Outline layer
      map.addLayer({
        id: 'zones-outline',
        type: 'line',
        source: 'chennai-zones',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 1.5,
          'line-opacity': 0.8
        }
      });

      // 2. Add Road Network Source
      map.addSource('chennai-roads', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Impassable / at-risk road layer
      map.addLayer({
        id: 'roads-impassable',
        type: 'line',
        source: 'chennai-roads',
        paint: {
          'line-color': [
            'match',
            ['get', 'status'],
            'IMPASSABLE', '#f43f5e',
            'AT_RISK', '#fbbf24',
            '#0284c7'
          ],
          'line-width': 3.5,
          'line-opacity': 0.9
        }
      });

      // 3. Resilient Route Source (Bypass Corridor)
      map.addSource('resilient-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [80.208, 13.012],
              [80.245, 12.965],
              [80.240, 12.990],
              [80.220, 13.005],
              [80.222, 12.965]
            ]
          }
        }
      });

      map.addLayer({
        id: 'resilient-route-line',
        type: 'line',
        source: 'resilient-route',
        paint: {
          'line-color': '#06b6d4',
          'line-width': 4.5,
          'line-dasharray': [2, 1],
          'line-opacity': 0.95
        }
      });

      // Zone click interaction
      map.on('click', 'zones-fill', (e: any) => {
        if (e.features && e.features[0]) {
          const zoneId = e.features[0].properties?.id;
          const matched = zones.find(z => z.id === zoneId);
          if (matched) {
            onSelectZone(matched);
          }
        }
      });

      map.on('mouseenter', 'zones-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'zones-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync zones GeoJSON
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('chennai-zones') as maplibregl.GeoJSONSource;
    if (source) {
      const fc = {
        type: 'FeatureCollection',
        features: zones.map(z => ({
          type: 'Feature',
          properties: {
            id: z.id,
            name: z.name,
            flood_risk_score: z.flood_risk_score,
            vulnerability_score: z.vulnerability_score,
            population: z.population
          },
          geometry: z.geometry
        }))
      };
      source.setData(fc as any);
    }
  }, [zones]);

  // Sync roads GeoJSON
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('chennai-roads') as maplibregl.GeoJSONSource;
    if (source) {
      const fc = {
        type: 'FeatureCollection',
        features: roads.map(r => ({
          type: 'Feature',
          properties: {
            id: r.id,
            name: r.name,
            status: r.status,
            flood_probability: r.flood_probability
          },
          geometry: {
            type: 'LineString',
            coordinates: r.coordinates
          }
        }))
      };
      source.setData(fc as any);
    }
  }, [roads]);

  // Sync Layer Visibilities
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('zones-fill')) {
      map.setLayoutProperty('zones-fill', 'visibility', activeLayers.floodRisk || activeLayers.vulnerability ? 'visible' : 'none');
      // If vulnerability mode active, color by vulnerability
      if (activeLayers.vulnerability && !activeLayers.floodRisk) {
        map.setPaintProperty('zones-fill', 'fill-color', [
          'interpolate',
          ['linear'],
          ['get', 'vulnerability_score'],
          20, 'rgba(16, 185, 129, 0.4)',
          50, 'rgba(234, 179, 8, 0.5)',
          75, 'rgba(249, 115, 22, 0.65)',
          90, 'rgba(220, 38, 38, 0.8)'
        ]);
      } else {
        map.setPaintProperty('zones-fill', 'fill-color', [
          'interpolate',
          ['linear'],
          ['get', 'flood_risk_score'],
          20, 'rgba(16, 185, 129, 0.35)',
          50, 'rgba(234, 179, 8, 0.45)',
          75, 'rgba(249, 115, 22, 0.60)',
          90, 'rgba(220, 38, 38, 0.75)'
        ]);
      }
    }

    if (map.getLayer('roads-impassable')) {
      map.setLayoutProperty('roads-impassable', 'visibility', activeLayers.roads ? 'visible' : 'none');
    }

    if (map.getLayer('resilient-route-line')) {
      map.setLayoutProperty('resilient-route-line', 'visibility', activeLayers.resilientRoute ? 'visible' : 'none');
    }
  }, [activeLayers]);

  // Sync facility markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!activeLayers.facilities) return;

    facilities.forEach(fac => {
      const el = document.createElement('div');
      el.className = 'facility-marker';
      el.style.width = '14px';
      el.style.height = '14px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid #0f172a';
      el.style.cursor = 'pointer';

      if (fac.type === 'HOSPITAL') {
        el.style.backgroundColor = fac.status === 'OPERATIONAL' ? '#10b981' : '#ef4444';
        el.title = `[Hospital] ${fac.name} (${fac.status})`;
      } else if (fac.type === 'SHELTER') {
        el.style.backgroundColor = '#38bdf8';
        el.title = `[Relief Shelter] ${fac.name} (Cap: ${fac.capacity})`;
      } else {
        el.style.backgroundColor = '#f59e0b';
        el.title = `[Power Substation] ${fac.name} (${fac.status})`;
      }

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        new maplibregl.Popup({ offset: 12 })
          .setLngLat([fac.lon, fac.lat])
          .setHTML(`
            <div style="font-size: 11px;">
              <div style="font-weight: 700; color: #f8fafc;">${fac.name}</div>
              <div style="color: #94a3b8; margin: 3px 0;">Type: ${fac.type} | Status: <b style="color: ${fac.status === 'OPERATIONAL' ? '#34d399' : '#f87171'}">${fac.status}</b></div>
              <div style="color: #cbd5e1;">Flood Threat Score: <b>${fac.flood_risk.toFixed(1)}%</b></div>
              <div style="color: #94a3b8;">Capacity: ${fac.capacity}</div>
            </div>
          `)
          .addTo(map);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([fac.lon, fac.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [facilities, activeLayers.facilities]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Floating Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        background: 'rgba(15, 23, 42, 0.92)',
        border: '1px solid #1e293b',
        borderRadius: '4px',
        padding: '8px 12px',
        fontSize: '11px',
        backdropFilter: 'blur(4px)',
        zIndex: 10,
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
      }}>
        <div style={{ fontWeight: 700, fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Hydrological Symbology
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '8px', background: '#dc2626', borderRadius: '1px' }} />
          <span>Severe / Extreme Inundation (Risk &gt; 75%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '8px', background: '#f59e0b', borderRadius: '1px' }} />
          <span>High / Moderate Inundation (35%–75%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '3px', background: '#f43f5e' }} />
          <span>Impassable Arterial Road</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '3px', background: '#06b6d4', borderBottom: '1px dashed #06b6d4' }} />
          <span>AEGIS Resilient Evacuation Bypass</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px', color: '#94a3b8', fontSize: '10px' }}>
          <span>● Hospital</span>
          <span>● Shelter</span>
          <span>● Substation</span>
        </div>
      </div>
    </div>
  );
};
