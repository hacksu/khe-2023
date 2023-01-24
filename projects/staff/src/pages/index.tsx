import { Box, Progress } from '@mantine/core';
import { useState } from 'react';
import { TicketsList } from '../ui/models/tickets/list';
import { Icon } from '@cseitz/icons';
import { faHouse } from '@cseitz/icons/regular/house';
import { api } from '@kenthackenough/ui/trpc';
import { ContactUs } from '../../../ui/src/models/tickets/contact';
import { TremorArea } from 'ui/charts/base/area';

const HomeIcon = Icon(faHouse)

// import bruh from 'this-should-error';
// bruh();

export default function Homepage() {
    const ping = api.ping.useQuery();
    const [date, setDate] = useState<Date>(null!);
    const users = api.users.list.useQuery();
    api.onDate.useSubscription(undefined, {
        onData(data) {
            setDate(data.date);
        },
    })
    return <div>
        {/* Woah! Staff Portal!2 <HomeIcon />
        <p>
            ping: <span>{ping?.data?.toLocaleString() || 'loading...'}</span>
        </p>
        <p>
            subscription date: <span>{date?.toLocaleString() || 'loading...'}</span>
        </p>
        <div>{JSON.stringify(users?.data || {})}</div> */}
        <TremorArea />
        {/* <ContactUs /> */}
        {/* <TicketsList /> */}
        {/* <Box sx={{ width: 500, maxWidth: '60vw', marginTop: 10 }}>
            <Progress value={100} animate />
        </Box> */}
    </div>
}

// export default function Homepage() {
//     return <div>heya</div>
// }