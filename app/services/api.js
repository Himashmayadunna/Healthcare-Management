const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

/**
 * Patient API endpoints
 */
export const patientAPI = {
  /**
   * Get all patients
   */
  getAll: async () => {
    try {
      const data = await fetchAPI("/patients");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      return [];
    }
  },

  /**
   * Add a new patient
   */
  add: async (patient) => {
    return fetchAPI("/patients", {
      method: "POST",
      body: JSON.stringify(patient),
    });
  },
};

/**
 * Appointment API endpoints
 */
export const appointmentAPI = {
  /**
   * Get all appointments
   */
  getAll: async () => {
    try {
      const data = await fetchAPI("/appointments");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      return [];
    }
  },

  /**
   * Add a new appointment
   */
  add: async (appointment) => {
    return fetchAPI("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    });
  },
};

/**
 * Prescription API endpoints
 */
export const prescriptionAPI = {
  /**
   * Get all prescriptions
   */
  getAll: async () => {
    try {
      const data = await fetchAPI("/prescriptions");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
      return [];
    }
  },

  /**
   * Add a new prescription
   */
  add: async (prescription) => {
    return fetchAPI("/prescriptions", {
      method: "POST",
      body: JSON.stringify(prescription),
    });
  },
};

/**
 * Health check endpoint
 */
export const healthAPI = {
  /**
   * Check backend health status
   */
  check: async () => {
    try {
      const data = await fetchAPI("/health");
      return data;
    } catch (error) {
      console.error("Health check failed:", error);
      return { status: "offline", error: error.message };
    }
  },
};

/**
 * Dashboard API - combines multiple endpoints
 */
export const dashboardAPI = {
  /**
   * Get dashboard data
   */
  getData: async () => {
    try {
      const [patients, health] = await Promise.all([
        patientAPI.getAll(),
        healthAPI.check(),
      ]);

      return {
        patients,
        patientCount: patients.length,
        appointmentCount: 0, // To be implemented
        prescriptionCount: 0, // To be implemented
        health: health.status || "connecting...",
      };
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      return {
        patients: [],
        patientCount: 0,
        appointmentCount: 0,
        prescriptionCount: 0,
        health: "error",
      };
    }
  },
};
