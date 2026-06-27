const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function calculateChart(params) {
  const response = await fetch(`${API_BASE_URL}/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Calculation failed");
  }
  return response.json();
}

export async function getRecords() {
  const response = await fetch(`${API_BASE_URL}/records`);
  if (!response.ok) {
    throw new Error("Failed to fetch records");
  }
  return response.json();
}

export async function saveRecord(record) {
  const response = await fetch(`${API_BASE_URL}/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(record)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to save record");
  }
  return response.json();
}

export async function deleteRecord(id) {
  const response = await fetch(`${API_BASE_URL}/records/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error("Failed to delete record");
  }
  return response.json();
}

export async function getSettings() {
  const response = await fetch(`${API_BASE_URL}/settings`);
  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }
  return response.json();
}

export async function saveSettings(settings) {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(settings)
  });
  if (!response.ok) {
    throw new Error("Failed to save settings");
  }
  return response.json();
}

export async function convertBsToAd(year, month, day) {
  const response = await fetch(`${API_BASE_URL}/convert/bs-to-ad?year=${year}&month=${month}&day=${day}`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "BS to AD conversion failed");
  }
  return response.json();
}

export async function convertAdToBs(dateStr) {
  const response = await fetch(`${API_BASE_URL}/convert/ad-to-bs?date=${dateStr}`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "AD to BS conversion failed");
  }
  return response.json();
}
