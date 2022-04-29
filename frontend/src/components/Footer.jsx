import { Box, Container, Grid, Item } from '@mui/material';
import React from 'react';


function Footer() {
    return (
        <footer >
            <Box
                color="white"
                bgcolor="text.secondary"
                px={{ xs: 3, sm: 3 }}
                py={{ xs: 3, sm: 3 }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={5}>
                        <Grid item xs={4}>
                            <p>xs=8</p>
                        </Grid>
                        <Grid item xs={4}>
                            <p>xs=4</p>
                        </Grid>
                    </Grid>

                </Container>


            </Box>


        </footer >
    );
}

export default Footer;