const apiUrl = 'http://localhost:8080';

export function apiRequest(path: string, options?: RequestInit): Promise<Response> {
    return fetch(`${apiUrl}${path}`, options);
}

export function jsonRequest(method: "POST" | "PUT" | "PATCH", path: string, body: unknown): Promise<Response> {
    return apiRequest(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}