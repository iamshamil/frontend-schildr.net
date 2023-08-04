import Box from '@mui/material/Box';

const Loading = () => {
    return (
        <Box sx={{ width: 50, height: 100 }}>
            <Box sx={{ position: 'relative', heiht: 45, width: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <Box sx={{ width: 15, height: 5, display: 'inline-block', bgcolor: (theme) => theme.palette.background.default, animation: 'loadingA 1.5s 1s infinite' }} />
                <Box sx={{ width: 15, height: 10, display: 'inline-block', bgcolor: (theme) => theme.palette.background.default, animation: 'loadingA 1.5s 0.5s infinite' }} />
                <Box sx={{ width: 15, height: 15, display: 'inline-block', bgcolor: (theme) => theme.palette.background.default, animation: 'loadingA 1.5s 0s infinite' }} />
            </Box>
        </Box>
    )
}

export default Loading;