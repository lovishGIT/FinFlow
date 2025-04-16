export const fetcher = async <T>(url: string, options?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: HeadersInit;
    credentials?: RequestCredentials;
    redirect?: RequestRedirect;
}): Promise<T> => {
    if (!options) {
        options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };
    }
    const response = await fetch(url, options);

    if (response.status === 401) {
        throw new Error('Unauthorized access. Please log in again.');
    }
    if (response.status === 403) {
        throw new Error('Forbidden access. You do not have permission to view this resource.');
    }
    if (response.status === 404) {
        throw new Error('Resource not found. Please check the URL.');
    }
    if (response.status === 500) {
        throw new Error('Internal server error. Please try again later.');
    }
    if (response.status === 503) {
        throw new Error('Service unavailable. Please try again later.');
    }
    if (response.status === 504) {
        throw new Error('Gateway timeout. Please try again later.');
    }
    if (response.status === 400) {
        throw new Error('Bad request. Please check your input.');
    }


    if (response.status === 200 || response.status === 201 || response.status === 204) {
        const data = await response.json();
        // console.log('url', url,' Response:', data); // Debugging
        return (data?.data || data) as T;
    }

    return response as T;
};