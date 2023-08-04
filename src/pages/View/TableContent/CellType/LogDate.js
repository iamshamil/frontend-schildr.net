import moment from 'moment';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


const LogDate = (props) => {
    const { data, onModal } = props;

    if (onModal) {
        return (
            <>
                {
                    (() => {
                        if (data?.data) {
                            return (
                                <Stack sx={{ height: '100%', justifyContent: 'center', width: '100%', minHeight: 34, borderRadius: 1, flexWrap: "wrap", bgcolor: '#fff', '&:hover': { borderColor: '#000' }, '&:focus': { borderColor: '#1976d2', borderWidth: 2 } }} >
                                    {moment(data.data).format('M/d/yyyy h:mm a')}
                                </Stack>
                            )
                        } else {
                            return null;
                        }
                    })()
                }</>
        )
    } else {
        return (
            <Box sx={{ p: '6px' }}>
                {
                    (() => {
                        if (data?.data) {
                            return (
                                <Typography component='div' sx={{ userSelect: 'none', overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#111111', cursor: 'default' }}>
                                    {moment(data.data).format('DD/MM/yyyy h:mm a')}
                                </Typography>
                            )
                        } else {
                            return null;
                        }
                    })()
                }
            </Box>
        )
    }
}

export default LogDate;