import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

import ViewModal from '../../../components/ViewModal';
import useTableContext from '../../../hooks/useTable';
import { checkWidth } from '../../../config/constant';

const FirstCell = ({ id, y, group }) => {
    const [modalI, setModalI] = useState(0);
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);

    const { body } = useTableContext();

    const changeItem = (flag) => {
        if (flag) {
            setModalI(modalI + 1)
        } else {
            setModalI(modalI - 1)
        }
    }

    const handleClose = () => {
        setOpen(false);
        setModalI(index);
    };

    useEffect(() => {
        let idx = body.findIndex((e) => e._id === id);
        setIndex(idx);
        setModalI(idx);
    }, [body, id])

    return (
        <>
            <Stack
                direction='row'
                key={-2}
                className='cell first-cell'
                sx={{
                    width: checkWidth,
                    height: 32,
                    bgcolor: '#fff',
                    borderTop: '1px solid #dde1e3',
                    borderRight: '1px solid #dde1e3',
                }}>
                <Box sx={{ borderRight: '1px solid #dde1e3', display: 'inline-block', position: 'relative', height: 32, width: 32, zIndex: 2, textAlign: 'center' }}>
                    <Box sx={{ position: 'absolute', width: '100%', top: 7, color: '#707070', textAlign: 'center', fontSize: 12, userSelect: 'none' }}>
                        {y + 1}
                    </Box>
                </Box>
                <Stack direction='row' alignItems='center' justifyContent='space-around' sx={{ width: 'calc(100% - 32px)' }}>
                    <Box>
                        <Stack direction='row' sx={{ position: 'relative', height: '100%', alignItems: 'center', cursor: 'pointer', }}>
                            <IconButton onClick={() => setOpen(true)} color='info' sx={{ height: 32, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    (() => {
                                        return (
                                            <>
                                                {
                                                    body[index]?.chat ?
                                                        <Box sx={{ fontSize: 16, color: '#2d7ff9', borderRadius: 5, p: .5, }}>{body[index].chat}</Box>
                                                        :
                                                        <OpenInFullIcon className='show-head' sx={{ fontSize: 16, color: '#2d7ff9', }} />
                                                }
                                            </>
                                        )
                                    })()
                                }
                            </IconButton>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
            <ViewModal y={modalI} open={open} handleClose={handleClose} changeItem={changeItem} group={group} />
        </>
    )
}

export default FirstCell;