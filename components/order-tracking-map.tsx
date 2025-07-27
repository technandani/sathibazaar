"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, useRef } from "react"

// Fix for default marker icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

interface OrderTrackingMapProps {
  origin: [number, number] // [latitude, longitude]
  destination: [number, number]
  currentLocation?: [number, number] // Optional, for real-time tracking
  orderId: string
}

export default function OrderTrackingMap({ origin, destination, currentLocation, orderId }: OrderTrackingMapProps) {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current) {
      // Adjust map view to fit all markers
      const bounds = L.latLngBounds([origin, destination])
      if (currentLocation) {
        bounds.extend(currentLocation)
      }
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [origin, destination, currentLocation])

  return (
    <MapContainer
      center={origin}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={origin}>
        <Popup>Order Origin: {orderId}</Popup>
      </Marker>
      <Marker position={destination}>
        <Popup>Delivery Destination: {orderId}</Popup>
      </Marker>
      {currentLocation && (
        <Marker position={currentLocation}>
          <Popup>Current Location of Delivery</Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
