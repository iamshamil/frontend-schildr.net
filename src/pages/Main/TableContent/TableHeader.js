import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { ReactComponent as SortAZ } from '../../../assets/img/svg/sortAZ.svg';
import { ReactComponent as SortZA } from '../../../assets/img/svg/sortZA.svg';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PushPinIcon from '@mui/icons-material/PushPin';

import { removeColumn, updateShowList } from '../../../utilis/request';
import Icons from '../../../components/Icons';
import useTableContext from '../../../hooks/useTable';
import useConfig from '../../../hooks/useConfig';

const TableHeader = (props) => {
    const { i, me } = props;
    const { header, changeFilterBody, body, setFilter, changeBody, changeHeader, hId, setColumHandle, isAdmin } = useTableContext()
    const { user, setUser } = useConfig()

    const [anchorEl, setAnchorEl] = useState(null);
    const [sorted, setSorted] = useState(false);
    const [order, setOrder] = useState(true);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = (event) => setAnchorEl(null);
    const columnSort = (flag, idx) => {
        setSorted(!sorted)
        setOrder(flag);
    }

    const setPin = () => {
        console.log(header)
        let fixHeader = header.map((item) => {
            if (item.order <= me.order) {
                return { ...item, fixed: true }
            } else {
                return { ...item, fixed: false }
            }
        })

        changeHeader(fixHeader)
    }

    const deleteField = (i) => {
        let newHeader = [], tempBody = body;
        for (let item of header) {
            if (item.order === header[i].order) continue;
            if (item.order > header[i].order) {
                item.order--;
            }
            newHeader.push(item);
        }
        tempBody = tempBody.map((e) => {
            let item = e;
            item.row.splice(i, 1);
            return item;
        })
        changeHeader(newHeader);
        changeBody(tempBody);
        removeColumn({ hId, index: i });
        setAnchorEl(null);
    }

    const hideField = () => {
        let nHeader = header;
        nHeader[i].hide = true;

        updateShowList(user._id, { ...user.showList, [nHeader[i].id]: true });
        setUser({ ...user, showList: { ...user.showList, [nHeader[i].id]: true } });
        changeHeader(nHeader);
    }

    const addField = (direction) => {
        setColumHandle({
            direction: direction,
            target: anchorEl.parentElement,
            index: direction === 'right' ? header[i].order + 1 : header[i].order,
            type: 'add'
        })
        setAnchorEl(null);
    }

    const editaddField = (direction) => {
        setColumHandle({
            direction: direction,
            target: anchorEl.parentElement,
            index: header[i].order,
            type: 'edit'
        })
        setAnchorEl(null);
    }

    /* eslint-disable */
    useEffect(() => {
        if (sorted) {
            let temp = body.sort((a, b) => {
                let adata, bdata, n;
                switch (header[i].type) {
                    case 'text':
                    case 'date':
                    case 'email':
                    case 'link':
                    case 'longText':
                        adata = a.row[i].data;
                        bdata = b.row[i].data;
                        break;
                    case 'select':
                        n = a.row[i].data;
                        adata = header[i].list[Number(n)].label;
                        n = b.row[i].data;
                        bdata = header[i].list[Number(n)].label;
                        break;
                    case 'attached':
                        adata = a.row[i].data.length;
                        bdata = b.row[i].data.length;
                        break;
                    default:
                        adata = a.row[i].data;
                        bdata = b.row[i].data;
                        return adata;
                }
                if (order) {

                    if (adata < bdata) {
                        return -1;
                    }
                    if (adata > bdata) {
                        return 1;
                    }
                } else {
                    if (adata < bdata) {
                        return 1;
                    }
                    if (adata > bdata) {
                        return -1;
                    }
                }
            })
            setFilter(true)
            changeFilterBody([...temp])
        }
    }, [body, sorted, setOrder])
    /* eslint-enable */

    return (
        <>
            <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ height: '100%', width: '100%', px: '5px' }}>
                <Stack direction='row' alignItems='center' sx={{ overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Icons type={header[i].type} editable={me.editable} />
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
                                color: me.editable ? '#0ed114' : '#333333',
                                fontWeight: me.editable ? 600 : 300,
                                fontSize: 13,
                                userSelect: 'none'
                            }}
                        >
                            {me.name}
                        </Typography>
                    </Box>
                </Stack>
                <ArrowDropDownIcon onClick={handleClick} sx={{ cursor: 'pointer', fontSiz: 12, color: '#555555', opacity: .4, '&:hover': { opacity: 1 } }} />
            </Stack>
            <Popover
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}

                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ py: 1, px: 2 }}>
                    <Box sx={{ py: 1 }}>
                        <Stack spacing={.5} sx={{ minWidth: 200 }}>
                            {
                                isAdmin ?
                                    <>
                                        <Button onClick={() => editaddField('left')} startIcon={<EditIcon sx={{ fontSize: 15 }} />} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize' }}>Edit field</Button>
                                        <Divider />
                                    </>
                                    : null
                            }
                            {
                                isAdmin ?
                                    <>
                                        <Button disabled={me.order === 0} onClick={() => addField('left')} startIcon={<ArrowBackIcon sx={{ fontSize: 15 }} />} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize' }}>Insert left</Button>
                                        <Button onClick={() => addField('right')} startIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize' }}>Insert right</Button>
                                        <Divider />
                                        <Button onClick={() => setPin()} startIcon={<PushPinIcon />} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize' }}>Fixed</Button>
                                        <Divider />
                                    </>
                                    : null
                            }
                            <Button onClick={() => columnSort(true, i)} startIcon={<SortAZ />} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize' }}>Sort A ~ Z</Button>
                            <Button onClick={() => columnSort(false, i)} startIcon={<SortZA />} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize' }}>Sort Z ~ A</Button>
                            <Divider />
                            <Button onClick={() => hideField()} startIcon={<VisibilityOffIcon sx={{ fontSize: 15 }} />} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize' }}>Hide field</Button>
                            {
                                isAdmin ?
                                    <Button onClick={() => deleteField(i)} startIcon={<DeleteIcon sx={{ fontSize: 15 }} />} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize' }}>Delete</Button>
                                    : null
                            }
                        </Stack>
                    </Box>
                </Box>
            </Popover >
        </>
    )
}

export default TableHeader;