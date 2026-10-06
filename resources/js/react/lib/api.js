/**
 * Thin API wrapper — all requests go to /api/*.
 * Add new resource helpers here as you build out the app.
 */

const BASE = "/api";

async function request(method, path, body) {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw Object.assign(new Error(data.message ?? res.statusText), {
            status: res.status,
            data,
        });
    }

    if (res.status === 204) return null;
    return res.json();
}

export const api = {
    // Tasks
    getTasks: () => request("GET", "/tasks"),
    getTask: (id) => request("GET", `/tasks/${id}`),
    createTask: (data) => request("POST", "/tasks", data),
    updateTask: (id, data) => request("PATCH", `/tasks/${id}`, data),
    deleteTask: (id) => request("DELETE", `/tasks/${id}`),

    // Financial Check-Ins
    getFinancialCheckIns: () => request("GET", "/financial-check-ins"),
    getFinancialCheckIn: (id) => request("GET", `/financial-check-ins/${id}`),
    createFinancialCheckIn: (data) => request("POST", "/financial-check-ins", data),
    updateFinancialCheckIn: (id, data) => request("PATCH", `/financial-check-ins/${id}`, data),
    deleteFinancialCheckIn: (id) => request("DELETE", `/financial-check-ins/${id}`),
};
