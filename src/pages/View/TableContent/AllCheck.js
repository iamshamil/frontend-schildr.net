import React, { useContext } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';

import { TableContext } from '../../../contexts/table';
import { Typography } from '@mui/material';
import { allCheckWidth } from '../../../config/constant';

const AllCheck = () => {
    const { body, deleteRowList, setDeleteRowList } = useContext(TableContext);

    const handleAll = (e) => {
        if (e.target.checked) {
            let all = body.map((one) => one._id);
            setDeleteRowList([...all]);
        } else {
            setDeleteRowList([]);
        }
    }

    return (
        <>
            <Box sx={{ position: 'sticky', left: 0, zIndex: 9, display: 'flex', alignItems: 'center', order: -2, height: '100%', width: allCheckWidth, bgcolor: '#f5f5f5', borderBottom: '1px solid #d1d1d1', borderRight: '1px solid #dde1e3' }}>
                <Box sx={{
                    width: 32,
                    height: 32,
                    cursor: 'default',
                    borderLeft: 'none',
                    borderRight: 'none',
                    position: 'relative',
                    ml: 2
                }}>
                    <Checkbox onChange={handleAll} checked={Boolean(deleteRowList.length)} sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}
                    />
                </Box>
                <Typography sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    Actions
                </Typography>
            </Box>
            {/* <Box sx={{ position: 'sticky', left: allCheckWidth, zIndex: 9, height: '100%', width: processStatusWidth, borderBottom: '1px solid #d1d1d1', borderRight: '1px solid #dde1e3', order: -1, bgcolor: '#f5f5f5' }}>
                <Stack direction='row' alignItems='center' justifyContent='center' sx={{ height: '100%', width: '100%', px: '5px', cursor: 'pointer' }}>
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
                                fontSize: 13,
                                userSelect: 'none'
                            }}
                        >
                            Status
                        </Typography>
                    </Box>
                </Stack>
            </Box> */}
        </>
    )
}

export default AllCheck;