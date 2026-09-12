/**
 * Dynamic API client for DehatArogya.
 * Resolves to VITE_API_BASE_URL or automatically binds to the current host's IP
 * on port 8000 so phones accessing via Wi-Fi communicate directly with the local backend.
 */
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }
  const hostname = window.location.hostname || 'localhost';
  return `http://${hostname}:8000`;
};

export const API_BASE = getApiBaseUrl();

export async function fetchNetworkInfo() {
  try {
    const res = await fetch(`${API_BASE}/api/network-info`);
    if (!res.ok) throw new Error('Failed to fetch network info');
    return await res.json();
  } catch (err) {
    console.warn('Network info error:', err);
    return null;
  }
}

export async function registerAnimal(data) {
  const res = await fetch(`${API_BASE}/api/animals/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to register animal' }));
    throw new Error(err.detail || 'Registration failed');
  }
  return await res.json();
}

export async function getAnimal(tagId) {
  const res = await fetch(`${API_BASE}/api/animals/${tagId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Animal not found' }));
    throw new Error(err.detail || 'Could not find animal');
  }
  return await res.json();
}

export async function getAllAnimals() {
  const res = await fetch(`${API_BASE}/api/animals`);
  if (!res.ok) throw new Error('Failed to list animals');
  return await res.json();
}

export async function diagnoseAnimal(
  tagId,
  symptoms,
  latitude = null,
  longitude = null,
  complaintImageUrl = null,
  complaintAudioTranscript = null
) {
  const payload = { tag_id: tagId, symptoms };
  if (latitude !== null && latitude !== undefined) payload.latitude = latitude;
  if (longitude !== null && longitude !== undefined) payload.longitude = longitude;
  if (complaintImageUrl) payload.complaint_image_url = complaintImageUrl;
  if (complaintAudioTranscript) payload.complaint_audio_transcript = complaintAudioTranscript;

  const res = await fetch(`${API_BASE}/api/animals/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Triage failed' }));
    throw new Error(err.detail || 'AI diagnosis failed');
  }
  return await res.json();
}

export async function resolveIncident(historyId, status) {
  const res = await fetch(`${API_BASE}/api/animals/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history_id: historyId, status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to update resolution' }));
    throw new Error(err.detail || 'Resolution update failed');
  }
  return await res.json();
}

// ==========================================
// VETERINARY DOCTOR DASHBOARD & CLINICAL API
// ==========================================

export async function fetchVetAreas() {
  const res = await fetch(`${API_BASE}/api/vet/areas`);
  if (!res.ok) throw new Error('Failed to fetch vet posting areas');
  return await res.json();
}

export async function fetchVetIncidents({ village = 'ALL', risk_level = 'ALL', status = 'ALL', specialist_only = false } = {}) {
  const params = new URLSearchParams();
  if (village && village !== 'ALL') params.append('village', village);
  if (risk_level && risk_level !== 'ALL') params.append('risk_level', risk_level);
  if (status && status !== 'ALL') params.append('status', status);
  if (specialist_only) params.append('specialist_only', 'true');

  const res = await fetch(`${API_BASE}/api/vet/incidents?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load vet incidents');
  return await res.json();
}

export async function scheduleVetAppointment({ historyId, scheduledDate, scheduledTime, scheduledNotes }) {
  const res = await fetch(`${API_BASE}/api/vet/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      history_id: historyId,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      scheduled_notes: scheduledNotes || null,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Scheduling failed' }));
    throw new Error(err.detail || 'Failed to update schedule');
  }
  return await res.json();
}

export async function recordVetTreatment({
  historyId,
  actualDiagnosis,
  treatmentGiven,
  medicinesUsed = [],
  treatmentImageUrl = null,
  visitDateTime = null
}) {
  const res = await fetch(`${API_BASE}/api/vet/treatment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      history_id: historyId,
      actual_diagnosis: actualDiagnosis,
      treatment_given: treatmentGiven,
      medicines_used: medicinesUsed,
      treatment_image_url: treatmentImageUrl,
      visit_date_time: visitDateTime
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Treatment save failed' }));
    throw new Error(err.detail || 'Failed to record clinical treatment');
  }
  return await res.json();
}

export async function submitVetAction(historyId, status, vetNotes) {
  const res = await fetch(`${API_BASE}/api/vet/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      history_id: historyId,
      status: status,
      vet_notes: vetNotes || null,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Action update failed' }));
    throw new Error(err.detail || 'Failed to record vet action');
  }
  return await res.json();
}

