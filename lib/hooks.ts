import useSWR from 'swr';

// Global fetcher with credentials
const fetcher = async (url: string) => {
    const res = await fetch(url, { credentials: 'include' });
    if (res.status === 401) {
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
};

// Configure SWR with optimized settings
export const swrConfig = {
    fetcher,
    revalidateOnFocus: false, // Don't refetch on window focus
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Dedupe requests within 5s
    errorRetryCount: 3,
    errorRetryInterval: 3000,
};

// Custom hooks for each data type with caching
export function useClients() {
    const { data, error, isLoading, mutate } = useSWR('/api/clients', fetcher, {
        ...swrConfig,
        revalidateIfStale: false,
    });
    return {
        clients: data || [],
        isLoading,
        error,
        refresh: mutate
    };
}

export function useInvoices() {
    const { data, error, isLoading, mutate } = useSWR('/api/invoices', fetcher, {
        ...swrConfig,
        revalidateIfStale: false,
    });
    return {
        invoices: data || [],
        isLoading,
        error,
        refresh: mutate
    };
}

export function useIncome() {
    const { data, error, isLoading, mutate } = useSWR('/api/income', fetcher, {
        ...swrConfig,
        revalidateIfStale: false,
    });
    return {
        income: data || [],
        isLoading,
        error,
        refresh: mutate
    };
}

export function useExpenses() {
    const { data, error, isLoading, mutate } = useSWR('/api/expenses', fetcher, {
        ...swrConfig,
        revalidateIfStale: false,
    });
    return {
        expenses: data || [],
        isLoading,
        error,
        refresh: mutate
    };
}

export function useUsers() {
    const { data, error, isLoading, mutate } = useSWR('/api/users', fetcher, {
        ...swrConfig,
        revalidateIfStale: false,
    });
    return {
        users: data || [],
        isLoading,
        error,
        refresh: mutate
    };
}
