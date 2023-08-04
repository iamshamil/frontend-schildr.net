import React from 'react';
import { Outlet } from 'react-router-dom';
import { Grid, Box, } from '@mui/material';
import Globe from '../components/Globe';

function AuthLayout() {
    return (
        <Box sx={{ width: '100vw', height: '100vh', bgcolor: "#fff" }}>
            <Grid container>
                <Grid item sm={7} xs={0}>
                    <Box sx={{ height: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", "& canvas": { cursor: "glob" } }}>
                        <Globe />
                    </Box>
                </Grid>
                <Grid item sm={5} xs={12} sx={{ bgcolor: '#fff' }}>
                    <Outlet />
                </Grid>
            </Grid>
        </Box >
    )
}

export default AuthLayout
