import React, { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SwipeLeftIcon from '@mui/icons-material/SwipeLeft';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';

import EditModal from '../../../components/EditModal';
import useTableContext from '../../../hooks/useTable';
import { checkWidth } from '../../../config/constant';
import useConfig from '../../../hooks/useConfig';
import { updateLog, approveAction } from '../../../utilis/request';

const FirstCell = ({ id, y, group }) => {
    const [modalI, setModalI] = useState(0);
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState(false);
    const [reasonDes, setReasonDes] = useState('');

    const { user } = useConfig();
    const { body, isFilter, filterBody, deleteRowList, setDeleteRowList, isAdmin, changeBody, selectEditabled } = useTableContext();

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

    const selectRow = (e) => {
        if (e.target.checked) {
            setDeleteRowList([...deleteRowList, id]);
        } else {
            let temp = deleteRowList.filter((p) => p !== id);
            setDeleteRowList([...temp]);
        }
    }

    const approveRow = async (params) => {
        selectEditabled("");
        let rdata = await approveAction(id, true);
        if (rdata.status) {
            let log = {
                type: 'workflow',
                rowId: body[index]._id,
                new: 'Approved',
                dataType: 'string',
                sign: { [user._id]: true },
                creator: user,
                cellName: "Approve",
                columnId: "process",
            }
            updateLog(log);
            body[index].done = true;
            changeBody(body);
        }

    }

    const rejectRow = async (params) => {
        selectEditabled("");
        let rdata = await approveAction(id, false);
        if (rdata.status) {
            let log = {
                type: 'workflow',
                rowId: body[index]._id,
                old: reasonDes,
                dataType: 'string',
                sign: { [user._id]: true },
                creator: user,
                cellName: "Reject",
                columnId: "process",
            }
            updateLog(log);
            body[index].done = false;
            changeBody(body);
            rejectReason();
        }

    }

    const rejectReason = () => {
        setReason(!reason);
    }

    const checkVal = useMemo(() => {
        const k = deleteRowList.findIndex((e) => e === id);
        return (k > -1)
    }, [deleteRowList, id]);

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
                    {
                        !checkVal ?
                            <Box className='row-num' sx={{ position: 'absolute', width: '100%', top: 7, color: '#707070', textAlign: 'center', fontSize: 12, userSelect: 'none' }}>
                                {y + 1}
                            </Box> : null
                    }
                    <Checkbox checked={checkVal} onChange={selectRow} className='show-head' sx={{ opacity: checkVal ? 1 : 0, position: 'absolute', left: 7, top: 0, width: 11, '& .MuiSvgIcon-root': { fontSize: 15 } }} />
                </Box>
                <Stack direction='row' alignItems='center' justifyContent='space-around' sx={{ width: 'calc(100% - 32px)' }}>
                    <Box>
                        <Stack direction='row' sx={{ position: 'relative', height: '100%', alignItems: 'center', cursor: 'pointer', }}>
                            <IconButton onClick={() => setOpen(true)} color='info' sx={{ height: 32, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    (() => {
                                        let data = isFilter ? filterBody : body;
                                        return (
                                            <>
                                                {
                                                    data[index]?.chat ?
                                                        <Box sx={{ fontSize: 16, color: '#2d7ff9', borderRadius: 5, p: .5, opacity: 1 }}>{body[index].chat}</Box>
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
                    {
                        user.role === 'Project Manager' || isAdmin ?
                            <>
                                {
                                    body[index]?.done ?
                                        <Tooltip arrow title="Reject">
                                            <IconButton color='error' onClick={rejectReason} sx={{ height: 32, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <SwipeLeftIcon sx={{ fontSize: 18, color: '#7a7e81', '&:hover': { color: '#f94949' } }} />
                                            </IconButton>
                                        </Tooltip> :
                                        < Tooltip arrow title="Approve">
                                            <IconButton color='success' onClick={approveRow} sx={{ height: 32, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#7a7e81', '&:hover': { color: '#5ac75f' }, }} />
                                            </IconButton>
                                        </Tooltip>
                                }
                            </> : null
                    }
                </Stack>
            </Stack>
            {/* <Stack
                direction='row'
                key={-1}
                className='cell'
                sx={{
                    width: processStatusWidth,
                    height: 32,
                    bgcolor: '#fff',
                    borderTop: '1px solid #dde1e3',
                }}>
                <Box sx={{ p: '6px', height: '100%', display: 'flex' }}>

                </Box>
            </Stack> */}
            <EditModal y={modalI} open={open} handleClose={handleClose} changeItem={changeItem} group={group} />
            <Dialog
                open={reason}
                onClose={rejectReason}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Rejection Reason
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={1}>
                        <TextField required type="text" multiline rows={4} value={reasonDes} error={!reasonDes} onChange={(e) => setReasonDes(e.target.value)} placeholder='' sx={{ width: 500 }} />
                    </Stack>
                    <Stack direction='row' justifyContent='flex-end' sx={{ pt: 2 }}>
                        <Button variant='contained' color='error' onClick={rejectReason} sx={{ mr: 1 }}>Cancel</Button>
                        <Button variant='contained' color='info' disabled={!reasonDes} onClick={rejectRow} autoFocus>
                            Reject
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FirstCell;