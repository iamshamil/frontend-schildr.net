import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';

const FullLayout = () => (
    <Box sx={{  height: '100vh',}}>
        <Outlet />
    </Box>
);

export default FullLayout;
