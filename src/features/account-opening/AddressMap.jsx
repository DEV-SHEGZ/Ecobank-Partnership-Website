import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatAddress } from './model';
import { getAt } from './Fields';

const NIGERIA = [9.082, 8.6753];
const NOMINATIM = 'https://nominatim.openstreetmap.org';

const pin = L.divIcon({
  className: 'account-map-pin',
  html: '<svg width="36" height="46" viewBox="0 0 36 46" aria-hidden="true"><path d="M18 45s15-15.6 15-27A15 15 0 0 0 3 18c0 11.4 15 27 15 27z" fill="#00577a" stroke="#fff" stroke-width="2"/><circle cx="18" cy="18" r="6.5" fill="#adbd03"/></svg>',
  iconSize: [36, 46],
  iconAnchor: [18, 45]
});

async function search(query, signal) {
  const res = await fetch(`${NOMINATIM}/search?format=jsonv2&countrycodes=ng&limit=1&addressdetails=0&q=${encodeURIComponent(query)}`, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('search');
  return (await res.json())[0];
}
async function reverse(lat, lng, signal) {
  const res = await fetch(`${NOMINATIM}/reverse?format=jsonv2&zoom=18&lat=${lat}&lon=${lng}`, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('reverse');
  return (await res.json())?.display_name;
}

/* Address verification map: find the typed address, then drag or tap to refine the pin. */
export default function AddressMap({ name = 'parent.location' }) {
  const { setValue, clearErrors, formState: { errors } } = useFormContext();
  const parent = useWatch({ name: 'parent' });
  const location = parent?.location;
  const error = getAt(errors, name)?.message;
  const node = useRef(), map = useRef(), marker = useRef(), lookup = useRef();
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const place = (lat, lng, label, zoom = 17) => {
    setValue(name, { lat: +lat.toFixed(6), lng: +lng.toFixed(6), label }, { shouldDirty: true });
    clearErrors(name);
    map.current?.setView([lat, lng], Math.max(map.current.getZoom(), zoom));
  };
  const describe = async (lat, lng) => {
    lookup.current?.abort();
    lookup.current = new AbortController();
    place(lat, lng, 'Pinned location');
    try {
      const label = await reverse(lat, lng, lookup.current.signal);
      if (label) setValue(name, { lat: +lat.toFixed(6), lng: +lng.toFixed(6), label }, { shouldDirty: true });
    } catch { /* the pin is still valid without a label */ }
  };

  useEffect(() => {
    const m = L.map(node.current, { center: location ? [location.lat, location.lng] : NIGERIA, zoom: location ? 16 : 6, scrollWheelZoom: false, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(m);
    m.attributionControl.setPrefix(false);
    m.on('click', e => describe(e.latlng.lat, e.latlng.lng));
    map.current = m;
    const resize = new ResizeObserver(() => m.invalidateSize());
    resize.observe(node.current);
    return () => { resize.disconnect(); m.remove(); map.current = null; marker.current = null; lookup.current?.abort(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (!location) { marker.current?.remove(); marker.current = null; return; }
    if (!marker.current) {
      marker.current = L.marker([location.lat, location.lng], { icon: pin, draggable: true, keyboard: true, title: 'Residential address pin', alt: 'Residential address pin' }).addTo(m);
      marker.current.on('dragend', () => { const p = marker.current.getLatLng(); describe(p.lat, p.lng); });
    } else marker.current.setLatLng([location.lat, location.lng]);
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  async function findAddress() {
    const full = formatAddress(parent || {});
    if (!parent?.street || !parent?.residence) { setStatus('Enter your street name and state of residence first.'); return; }
    setBusy(true);
    setStatus('Finding your address…');
    lookup.current?.abort();
    lookup.current = new AbortController();
    try {
      // Fall back to broader queries when the exact address is not in OpenStreetMap.
      const queries = [full, [parent.street, parent.city, parent.residence].filter(Boolean).join(', '), [parent.city, parent.residenceLga, parent.residence].filter(Boolean).join(', ')];
      for (const [i, q] of queries.entries()) {
        const hit = await search(q + ', Nigeria', lookup.current.signal);
        if (hit) {
          place(+hit.lat, +hit.lon, hit.display_name, i ? 14 : 17);
          setStatus(i ? 'We found the area. Drag the pin or tap the map to mark your exact address.' : 'Address found. Drag the pin if it needs adjusting.');
          return;
        }
      }
      setStatus('We couldn’t find that address. Tap the map to drop a pin on it.');
    } catch (e) {
      if (e.name !== 'AbortError') setStatus('The map search is unavailable right now. Tap the map to drop a pin instead.');
    } finally { setBusy(false); }
  }
  function useMyLocation() {
    if (!navigator.geolocation) { setStatus('Location isn’t available on this device. Tap the map instead.'); return; }
    setStatus('Getting your location…');
    navigator.geolocation.getCurrentPosition(
      p => { describe(p.coords.latitude, p.coords.longitude); setStatus('Pinned your current location. Drag the pin if it needs adjusting.'); },
      () => setStatus('We couldn’t get your location. Tap the map to drop a pin instead.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return <div className="account-map">
    <div className="account-map-head">
      <span className="account-label" id="map-label">Pin your residential address on the map</span>
      <div className="account-map-actions">
        <button type="button" id={name} className="account-map-button" onClick={findAddress} disabled={busy} aria-describedby={error ? `${name}-error` : undefined}>Find address on map</button>
        <button type="button" className="account-map-button is-secondary" onClick={useMyLocation}>Use my current location</button>
      </div>
    </div>
    <div className={`account-map-canvas${error ? ' is-invalid' : ''}`} ref={node} role="application" aria-labelledby="map-label" aria-describedby="map-help" />
    <p id="map-help" className="account-map-help">Tap the map or drag the pin to mark the exact entrance. This helps us verify your address.</p>
    <p className="account-map-status" role="status">{status}</p>
    {location && <p className="account-map-result"><strong>Pinned:</strong> {location.label} <span>({location.lat.toFixed(5)}, {location.lng.toFixed(5)})</span></p>}
    {error && <span className="account-error" id={`${name}-error`}>{error}</span>}
  </div>;
}
