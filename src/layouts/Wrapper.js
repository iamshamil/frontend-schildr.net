import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';

const Wrapper = () => {
    return (
        <Box
            sx={{
                marginTop: '56px',
                height: 'calc(100vh - 56px)',
            }}
        >
            <Outlet />
        </Box>
    );
}
export default Wrapper;
