import { Advisor, AdvisorPayload, AdvisorUpdatePayload, ApiResponse, SingleAdvisorResponse } from "@types";

const API_BASE_URL = 'http://localhost:3001';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function fetchData<T>(
    url: string,
    method: HttpMethod = 'GET',
    data?: any
): Promise<T> {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, options);

        if (!response.ok) {
            let errorMessage = `HTTP error! Status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }
            } catch (jsonError) {
                console.warn('Could not parse error response as JSON:', jsonError);
            }
            throw new Error(errorMessage);
        }

        if (response.status === 204 || response.headers.get('Content-Length') === '0') {
            return {} as T;
        }

        return response.json();
    } catch (error: any) {
        console.error(`API call failed for ${method} ${url}:`, error);
        throw new Error(`Failed to perform action: ${error.message}`);
    }
}

export const getAdvisors = async (): Promise<Advisor[]> => {
    const data = await fetchData<ApiResponse<Advisor>>('/advisor');
    return data;
};

export const getAdvisorById = async (id: number): Promise<Advisor> => {
    const data = await fetchData<Advisor>(`/advisor/${id}`);
    return data;
};

export const createAdvisor = async (advisor: AdvisorPayload): Promise<Advisor> => {
    const data = await fetchData<Advisor>('/advisor', 'POST', advisor);
    return data;
};

export const updateAdvisor = async (id: number, advisor: AdvisorUpdatePayload): Promise<Advisor> => {
    const data = await fetchData<Advisor>(`/advisor/${id}`, 'PUT', advisor);
    return data;
};

export const deleteAdvisor = async (id: number): Promise<Advisor> => {
    const data = await fetchData<Advisor>(`/advisor/${id}`, 'DELETE');
    return data;
};