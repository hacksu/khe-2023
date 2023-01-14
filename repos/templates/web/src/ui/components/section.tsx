import { useProps } from '@kenthackenough/react/hooks';
import { useMantineTheme } from '@mantine/core';
import { Box, BoxProps } from '@mantine/core';
import { useMemo } from 'react';


type SectionProps = BoxProps & {
    type: Lowercase<keyof typeof SectionTypes>
}

export function Section(props: SectionProps) {
    const Component = useMemo(() => {
        const key = Object.keys(SectionTypes)
            .find(o => o.toLowerCase() === props.type);
        return SectionTypes[key || 'Primary'];
    }, [props.type]);
    return Component(props);
}


namespace SectionTypes {

    export function Primary(props: SectionProps) {
        const theme = useMantineTheme();
        const boxProps = useProps(props, {
            sx: {
                backgroundColor: theme.colors[theme.primaryColor][0],
            }
        })
        return <Box {...boxProps} />
    }

    export const Secondary = Plain;
    export function Plain(props: SectionProps) {
        const theme = useMantineTheme();
        const boxProps = useProps(props, {
            sx: {
                backgroundColor: theme.colors['gray'][0],
            }
        })
        return <Box {...boxProps} />
    }

}

