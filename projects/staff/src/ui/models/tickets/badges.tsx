import { Tooltip, Badge, Group } from '@mantine/core';
import { TicketStatus } from '@kenthackenough/server/data';
import { api } from '@kenthackenough/ui/trpc';
import { useMemo } from 'react';
import { TICKET_STATUS_COLORS } from './ticket';
import { camelCase } from 'lodash';


// export default function TicketBadges(props: Partial<Record<TicketStatus, boolean>>) {
//     const query = api.tickets.counts.useQuery();
//     const counts = query.data;
//     const badges = useMemo(() => {
//         if (!counts) return [];
//         const keys = Object.keys(counts);
//         return Object.entries(counts)
//             .filter(o => o[0] in props)
//             .sort((a, b) => keys.indexOf(b[0]) > keys.indexOf(a[0]) ? 1 : -1)
//             .map(([status, count]) => {
//                 return <Tooltip label={`${status[0].toUpperCase() + status.slice(1)} Tickets`} key={status}>
//                     <Badge color={TICKET_STATUS_COLORS[status]}>{count}</Badge>
//                 </Tooltip>
//             })
//     }, [counts])
//     return <Group spacing={6}>
//         {badges}
//     </Group>;
// }

function TicketCountBadge(props: { status: TicketStatus }) {
    // if (typeof window === 'undefined') return <></>;

    const query = api.tickets.counts.useQuery();
    const counts = query.data;

    return <Badge color={TICKET_STATUS_COLORS[props.status]}>
        {counts?.[props.status]}
    </Badge>
}