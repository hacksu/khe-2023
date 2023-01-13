import { useProps } from '@kenthackenough/react/hooks';
import { Box, BoxProps } from '@mantine/core';
import { useMemo } from 'react';


/** IDs are pulled from https://www.kent.edu/map
 * 1. Search for the place you want in their search bar
 * 2. Click the item you want
 * 3. The URL should now include something along the lines of `?m/12345` at the end of it
 * 4. Copy the number directly following `m/`; this is the ID of the building within the map system
 * 5. Put it in the dictionary below and give it a nice name
 * 
 * example: https://map.concept3d.com/?id=568#!ct/5500?m/ **57924**
 */
const CAMPUS_MAP_LOCATIONS = {
    'Design Innovation Hub': 613809,
    'Math & Science Building': 57924,
    'Library': 63281,
    'Student Center': 57906,
} as const;

/** Flags are pulled from a few places
 * 1. Ensure you have the correct API key. 
 *  This can be found through a variety of means; primarily by just visiting https://www.kent.edu/map 
 *  and using inspect element to view the requests that are sent out to the `/categories` endpoint.
 * 2. Fetch all categories: `https://api.concept3d.com/categories/0?map=568&children&key=0001085cc708b9cef47080f064612ca5`
 * 3. For each category returned, find one you want (such as 5507, aka Parking lots), and pull its sub-categories via: `https://api.concept3d.com/categories/5507?map=568&children&key=0001085cc708b9cef47080f064612ca5`
 */
const CAMPUS_MAP_FLAGS = {
    'Building Labels': 44418,
    'Parking': 5507,
    'Visitor Parking': 5603,
} as const;


export function CampusMap(props: {
    location: keyof typeof CAMPUS_MAP_LOCATIONS,
    show: (keyof typeof CAMPUS_MAP_FLAGS)[]
} & BoxProps) {
    const { location, show, ...args } = useProps(props, {
        sx: { border: 0 },
    });
    const src = useMemo(() => {
        const LOCATION = CAMPUS_MAP_LOCATIONS[location];
        const FLAGS = show.map(o => CAMPUS_MAP_FLAGS[o]).join(',');
        return `https://map.concept3d.com/?id=568&tbh&sbh#!m/${LOCATION}?lh/?ct/${FLAGS}`;
    }, [location, show])
    return <Box component='iframe' src={src} scrolling='no' {...args} />
    // return <Box component='iframe'>
    //     <iframe src={`https://map.concept3d.com/?id=568&tbh&sbh#!m/${CAMPUS_MAP_LOCATIONS[props.location]}?lh/?ct/${props.with.map(o => CAMPUS_MAP_FLAGS[o])}`}
    //         width="600" height="450" scrolling="no" style={{ border: 0 }}></iframe>
    // </Box >
}