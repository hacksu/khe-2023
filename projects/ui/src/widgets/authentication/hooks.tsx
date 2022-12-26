import { useEffect } from 'react';
import { api } from '../../utils/trpc';


export function useAuthProviders() {
    const query = api.auth.providers.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        console.log('auth.providers updated at', query.dataUpdatedAt)
    }, [query.dataUpdatedAt])
    return query?.data;
}

