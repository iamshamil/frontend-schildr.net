import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const LogDate = (props) => {
    const { onModal, data } = props;
    // console.log(data.data.firstName)
    if (onModal) {
        return (
            <Stack sx={{ height: '100%', justifyContent: 'center', width: '100%', minHeight: 34, borderRadius: 1, flexWrap: "wrap", bgcolor: '#fff', '&:hover': { borderColor: '#000' }, '&:focus': { borderColor: '#1976d2', borderWidth: 2 } }} >
                {
                    (() => {
                        if (data.data && data.data.color) {
                            return (
                                <Stack direction='row' alignItems='center'>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, border: '1px solid #eee', borderRadius: 50, color: '#fff', bgcolor: data.data && data.data.color ? data.data.color : '#999', zIndex: 2, }}>{data?.data?.firstName[0]}</Box>
                                    <Typography component='span' sx={{ bgcolor: '#eee', userSelect: 'none', overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#111111', cursor: 'default', pr: 1, pl: 2.5, lineHeight: 1.4, borderRadius: 4, ml: -2 }}>
                                        {data?.data?.firstName} {data?.data?.lastName}
                                    </Typography>
                                </Stack >
                            )
                        } else {
                            return null;
                        }
                    })()
                }
            </Stack>
        )
    } else {
        return (
            <Box sx={{ p: '6px' }}>
                {
                    (() => {
                        if (data.data) {
                            return (
                                <Stack direction='row' alignItems='center'>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, border: '1px solid #eee', borderRadius: 50, color: '#fff', bgcolor: data.data && data.data.color ? data.data.color : '#999', zIndex: 2, }}>{data?.data?.firstName[0]}</Box>
                                    <Typography component='span' sx={{ bgcolor: '#eee', userSelect: 'none', overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#111111', cursor: 'default', pr: 1, pl: 2.5, lineHeight: 1.4, borderRadius: 4, ml: -2 }}>
                                        {data?.data?.firstName} {data?.data?.lastName}
                                    </Typography>
                                </Stack >
                            )
                        } else {
                            return null;
                        }
                    })()
                }
            </Box >
        )
    }
}

export default LogDate;