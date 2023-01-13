import { useEffect, useRef } from 'react';
import { api } from '../../utils/trpc';


export function useAuthProviders() {
    const enabled = useRef(true);
    const query = api.auth.providers.useQuery(undefined, {
        refetchOnWindowFocus: false,
        enabled: enabled.current,
        staleTime: Infinity,
    });
    enabled.current = !query.data;
    return query?.data;
}

