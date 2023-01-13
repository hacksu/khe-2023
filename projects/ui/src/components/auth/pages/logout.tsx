import { Box, Text } from '@mantine/core';

/** @export 'auth/pages/logout' */

export type LogoutPageProps = {

}

// eslint-disable-next-line react/display-name
export const LogoutPage = (props: LogoutPageProps) => () => <LogoutPageComponent {...props} />;

function LogoutPageComponent(props: LogoutPageProps) {
    return <Box>
    <Text>UI Logout Page</Text>
</Box>
}