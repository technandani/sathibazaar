"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, useRef } from "react"

// Fix for default icon issue with Webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

type OrderTrackingMapProps = {
  origin: [number, number]
  destination: [number, number]
  currentLocation?: [number, number]
  orderId?: string
}

export default function OrderTrackingMap({ origin, destination, currentLocation, orderId }: OrderTrackingMapProps) {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current) {
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
      className="h-full w-full rounded-md"
      whenCreated={(map) => {
        mapRef.current = map
        const bounds = L.latLngBounds([origin, destination])
        if (currentLocation) {
          bounds.extend(currentLocation)
        }
        map.fitBounds(bounds, { padding: [50, 50] })
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={origin}>
        <Popup>Origin: Supplier Location</Popup>
      </Marker>
      <Marker position={destination}>
        <Popup>Destination: Vendor Location</Popup>
      </Marker>
      {currentLocation && (
        <Marker position={currentLocation}>
          <Popup>Current Location of Delivery</Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
