export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "/api" : "http://127.0.0.1:4000/api");

async function request(path, { method = "GET", token, body, headers } = {}) {
  const finalHeaders = new Headers(headers || {});

  if (token) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const isFormData = body instanceof FormData;

  if (body && !isFormData && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (error) {
    const networkError = new Error(
      "Unable to reach the API. Check that the backend is running and CORS allows this frontend origin."
    );
    networkError.cause = error;
    throw networkError;
  }

  const payload = await response.json().catch(() => ({
    success: false,
    message: "Invalid server response",
  }));

  if (!response.ok || payload.success === false) {
    const error = new Error(payload.message || "Request failed");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function loginRequest(body) {
  return request("/auth/login", { method: "POST", body });
}

export function getCurrentUser(token) {
  return request("/auth/me", { token });
}

export function getDashboardStats(token) {
  return request("/dashboard/stats", { token });
}

export function getWhatsAppQr(token) {
  return request("/whatsapp/qr", { token });
}

export function getWhatsAppStatus(token) {
  return request("/whatsapp/status", { token });
}

export function restartWhatsApp(token) {
  return request("/whatsapp/restart", { method: "POST", token });
}

export function disconnectWhatsApp(token) {
  return request("/whatsapp/logout", { method: "POST", token });
}

export function sendTestMessage(token, body) {
  return request("/whatsapp/send-message", { method: "POST", token, body });
}

export function getSettings(token) {
  return request("/settings", { token });
}

export function updateSettings(token, body) {
  return request("/settings", { method: "PUT", token, body });
}

export function uploadExcel(token, formData) {
  return request("/messages/upload", { method: "POST", token, body: formData });
}

export function importStudents(token, formData) {
  return request("/students/import", { method: "POST", token, body: formData });
}

export function saveStudent(token, body) {
  return request("/students", { method: "POST", token, body });
}

export function addStudent(token, body) {
  return request("/students", { method: "POST", token, body });
}

export function getStudentOverview(token) {
  return request("/students/overview", { token });
}

export function getStudents(token, params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return request(`/students${query ? `?${query}` : ""}`, { token });
}

export function getAttendanceOverview(token) {
  return request("/attendance/overview", { token });
}

export function submitAttendance(token, body) {
  return request("/attendance/submit", { method: "POST", token, body });
}

export function getQueueStatus(token) {
  return request("/messages/queue-status", { token });
}

export function startQueue(token) {
  return request("/messages/send", { method: "POST", token });
}

export function pauseQueue(token) {
  return request("/messages/pause", { method: "POST", token });
}

export function resumeQueue(token) {
  return request("/messages/resume", { method: "POST", token });
}

export function stopQueue(token) {
  return request("/messages/stop", { method: "POST", token });
}

export function getMessageLogs(token, params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return request(`/messages/logs${query ? `?${query}` : ""}`, { token });
}

export function getUploads(token) {
  return request("/messages/uploads", { token });
}

export function previewImportStudents(token, formData) {
  return request("/students/import/preview", { method: "POST", token, body: formData });
}

export function getStudentById(token, id) {
  return request(`/students/${id}`, { token });
}

export function editStudent(token, id, body) {
  return request(`/students/${id}`, { method: "PUT", token, body });
}

export function deleteStudent(token, id) {
  return request(`/students/${id}`, { method: "DELETE", token });
}

export function deleteBulkStudents(token, ids) {
  return request("/students/bulk", { method: "DELETE", token, body: { ids } });
}

export function moveBulkStudents(token, ids, standard) {
  return request("/students/bulk-move", { method: "POST", token, body: { ids, standard } });
}

export async function exportStudentsRequest(token, body) {
  const response = await fetch(`${API_BASE_URL}/students/export`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    throw new Error("Failed to export students");
  }
  
  return response.blob();
}
