import { Box, createStyles } from '@mantine/core';
import { ContactUs } from '../widgets/tickets/contact';


const useStyles = createStyles(() => ({
    
}))

export default function ContactPage() {
    const { classes } = useStyles();
    return <Box>
        <Box sx={{ maxWidth: 500, padding: 15 }}>
            <ContactUs classes={classes} />
        </Box>
    </Box>
}