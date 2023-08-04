import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Icons from '../../../components/Icons';
import useTableContext from '../../../hooks/useTable';

const TableHeader = (props) => {
    const { i, me } = props;
    const { header } = useTableContext()

    return (
        <>
            <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ height: '100%', width: '100%', px: '5px' }}>
                <Stack direction='row' alignItems='center' sx={{ overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Icons type={header[i].type} editable={false} />
                    </Box>

                    <Box sx={{
                        maxWidth: "100%",
                        overflow: 'hidden',
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}>
                        <Typography
                            variant='span'
                            sx={{
                                ml: '5px',
                                color: '#333333',
                                fontWeight: 300,
                                fontSize: 13,
                                userSelect: 'none'
                            }}
                        >
                            {me.name}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}

export default TableHeader;