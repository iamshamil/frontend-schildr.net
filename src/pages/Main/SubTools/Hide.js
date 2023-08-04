import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AppsIcon from '@mui/icons-material/Apps';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ReactComponent as Font } from '../../../assets/img/svg/font.svg';
import { ReactComponent as LongText } from '../../../assets/img/svg/longText.svg';
import { ReactComponent as Attached } from '../../../assets/img/svg/attached.svg';
import { ReactComponent as Option } from '../../../assets/img/svg/option.svg';
import { ReactComponent as Date } from '../../../assets/img/svg/date.svg';

import { updateAllowed, updateHeader, updateShowList, updateEditable } from '../../../utilis/request';
import AntSwitch from '../../../components/AntSwitch';
import useConfig from '../../../hooks/useConfig';
import useTableContext from '../../../hooks/useTable';
import { toast } from 'react-toastify';

const HideOption = () => {
    const { user, setUser } = useConfig();
    const { header, changeHeader, users, setUsers, hId, isAdmin } = useTableContext();
    const [uidx, setUidx] = useState(-1);
    const [list, setList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectKey, setSelectKey] = useState("");

    const open = Boolean(anchorEl);

    const handleClose = () => setAnchorEl(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const handleHide = (e, idx, userStatus) => {
        if (userStatus || userStatus === 0) {
            let temp = list;
            temp[idx].allowed = e.target.checked;
            setList([...temp]);
        } else {
            let nHeader = header;
            nHeader[idx].hide = !e.target.checked;
            list[idx].hide = !e.target.checked;
            let newShowList = { ...user.showList, [list[idx].id]: !e.target.checked };
            updateShowList(user._id, newShowList);
            setUser({ ...user, showList: newShowList });
            setList(list);
            changeHeader(nHeader);
        }
    }

    const handleAll = (flag, uidx) => {
        if (uidx > -1) {
            let temp = list.map((e) => {
                e.allowed = !flag;
                return e;
            })
            setList([...temp]);
        } else {
            let nHeader = header.map((e, i) => ({ ...e, hide: flag }));
            changeHeader(nHeader);
        }
    }

    const userChange = (event) => {
        setUidx(event.target.value);
    };

    const handleAllowSave = async (id) => {
        let allowed = list.map((e) => e.allowed);
        let allowIds = list.filter((e) => e.allowed).map((e) => e.id);
        let editable = list.filter((e) => e.editable).map((e) => e.id);
        let temp = users;
        let i = users.findIndex((e) => e._id === id);
        if (i > -1) {
            temp[i].allowed[hId] = allowed;
            temp[i].allowIds[hId] = allowIds;
            temp[i].editable[hId] = editable;
            setUsers(temp);
            const rdata = await updateAllowed({ id: temp[i]._id, allowed, allowIds, editable, hId });
            if (!rdata.status) {
                toast.error("Can not update data")
            }
            handleClose();
        } else {
            toast.error("User not found")
            handleClose();
        }
    }

    const onDragEnd = (result, header) => {
        if (result.destination) {
            let tempHeader = header, startIndex = result.source.index, endIndex = result.destination.index, newOrder = [];

            if (startIndex < endIndex) {
                for (let item of tempHeader) {
                    if (item.order === startIndex) {
                        item.order = endIndex;
                    } else if (item.order > startIndex && item.order <= endIndex) {
                        item.order--;
                    }
                    console.log(item.order)
                    newOrder.push(item);
                }
            } else {
                for (let item of tempHeader) {
                    if (item.order === startIndex) {
                        item.order = endIndex;
                    } else if (item.order >= endIndex && item.order < startIndex) {
                        item.order++;
                    }
                    newOrder.push(item);
                }
            }
            changeHeader([...newOrder]);
            getHeaderData();
            updateHeader({ row: newOrder, hId });
        }
    }

    const handleEdit = (e, idx, userStatus) => {
        if (userStatus > -1) {
            let temp = list;
            temp[idx].editable = e.target.checked;
            setList([...temp]);
        } else {
            let nHeader = header;
            list[idx].editable = !e.target.checked;
            let editable = user.editable ?? {};
            let oldEditable = user.editable && user.editable[hId] ? user.editable[hId] : {};
            let newEditable = { ...oldEditable, [list[idx].id]: e.target.checked };
            updateEditable(user._id, { ...editable, [hId]: newEditable });
            setUser({ ...user, editable: { ...editable, [hId]: newEditable } });
            setList(list);
            changeHeader(nHeader);
        }
    }

    const getHeaderData = () => {
        if (uidx > -1) {
            let fUsers = users.filter((e) => { return (e.role !== 'Admin') });       // only users, not admins
            let allowed = fUsers[uidx].allowed && fUsers[uidx].allowed[hId] ? fUsers[uidx].allowed[hId] : [];
            let editable = fUsers[uidx].editable && fUsers[uidx].editable[hId] ? fUsers[uidx].editable[hId] : [];

            if (allowed.length) {
                const aList = header.map((e, i) => {
                    let eVal = false;
                    for (let eId of editable) {
                        if (eId === e.id) {
                            eVal = true;
                            break;
                        }
                    }
                    return { ...e, allowed: allowed[i], index: i, editable: eVal }
                });
                setList(aList)
            } else {
                const nList = header.map((e, i) => {
                    let eVal = false;
                    for (let eId of editable) {
                        if (eId === e.id) {
                            eVal = true;
                            break;
                        }
                    }
                    return { ...e, allowed: false, index: i, editable: eVal }
                });
                setList(nList)
            }
        } else {
            const iList = header.filter((e) => e.allowed).map((e, i) => ({ ...e, index: i, editable: true }));
            setList(iList)
        }
    }

    useEffect(() => {
        getHeaderData();
        /* eslint-disable-next-line */
    }, [header, uidx])

    return (
        <Box>
            <Button
                size='small'
                startIcon={<VisibilityOffIcon sx={{ fontSize: 16 }} />}
                onClick={handleClick}
                sx={{
                    px: 1,
                    fontSize: 13,
                    color: '#4d4d4d',
                    textTransform: 'capitalize',
                    '&:hover': { bgcolor: '#0000000d' }
                }}>
                Hide fields
            </Button>
            {
                isAdmin ?
                    <Popover
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Box sx={{ py: 1, px: 2 }}>
                            <TextField placeholder='Find an option' value={selectKey} onChange={(e) => setSelectKey(e.target.value)} autoFocus sx={{ borderBottom: '1px solid #0000001a', pt: 1, pb: .5, width: '100%', '& fieldset': { display: 'none' }, '& input': { py: 0, px: 1, fontSize: 13 } }} />
                            {
                                (() => {
                                    let list = users.filter((e) => {
                                        return (e.role !== 'Admin');
                                    });

                                    if (list[uidx]) {
                                        return (
                                            <Typography sx={{ fontSize: 11, py: 1 }}>For {`${list[uidx].firstName} ${list[uidx].lastName}`}</Typography>
                                        )
                                    } else {
                                        return null;
                                    }
                                })()
                            }
                            <Stack direction='row'>
                                <Typography sx={{ fontSize: 12, color: '#1976d2' }}>Visible</Typography>
                                <Typography sx={{ fontSize: 12, ml: 2, color: '#1976d2' }}>Editable</Typography>
                            </Stack>
                            <Box sx={{ py: 1 }}>
                                <DragDropContext onDragEnd={(e) => onDragEnd(e, header)}>
                                    <Droppable droppableId="field-order" type="field-order">
                                        {(provided, snapshot) => (
                                            <Stack
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                spacing={.5}
                                                sx={{ maxWidth: 500, minWidth: 300, bgcolor: '#fff' }}
                                            >
                                                {
                                                    (() => {
                                                        const filtered = list.filter((e) => e.name.toLowerCase().search(selectKey) !== -1).sort((a, b) => a.order - b.order);
                                                        return (
                                                            <Box sx={{ minWidth: filtered.length * 27.5 }}>
                                                                {
                                                                    filtered.length ? filtered.map((item, i) => {
                                                                        return (
                                                                            <Draggable draggableId={item.name} index={i} key={item.name + i}>
                                                                                {(provided, snapshot) => (
                                                                                    <Stack
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        ref={provided.innerRef}
                                                                                        direction='row'
                                                                                        alignItems='center'
                                                                                        justifyContent='space-between'
                                                                                        sx={{ px: 1, py: .5, cursor: 'pointer', borderRadius: 1, bgcolor: '#fff', '&:hover': { bgcolor: '#0000000d' }, boxShadow: snapshot.isDragging ? '0 0 6px #898585' : '' }}
                                                                                    >
                                                                                        <Stack direction='row' alignItems='center'>
                                                                                            <AntSwitch checked={(uidx >= 0) ? (item.allowed ? true : false) : !item.hide} inputProps={{ 'aria-label': 'ant design' }} onChange={(e) => handleHide(e, item.index, uidx)} />
                                                                                            <AntSwitch disabled={(uidx === -1)} checked={item.editable} sx={{ ml: 4, opacity: uidx === -1 ? 0.5 : 1 }} onChange={(e) => handleEdit(e, item.index, uidx)} />
                                                                                            <Stack direction='row' alignItems='center' sx={{ overflow: 'hidden', }}>
                                                                                                <Stack sx={{ mr: 1, ml: 2, '& svg': { height: 13, width: 15 } }}>
                                                                                                    {
                                                                                                        (() => {
                                                                                                            switch (item.type) {
                                                                                                                case 'text':
                                                                                                                    return <Font />
                                                                                                                case 'longText':
                                                                                                                    return <LongText />
                                                                                                                case 'email':
                                                                                                                    return <Font />
                                                                                                                case 'attached':
                                                                                                                    return <Attached />
                                                                                                                case 'date':
                                                                                                                    return <Date />
                                                                                                                case 'select':
                                                                                                                    return <Option />
                                                                                                                default:
                                                                                                                    return <Font />
                                                                                                            }
                                                                                                        })()
                                                                                                    }
                                                                                                </Stack>
                                                                                                <Typography sx={{ ml: .2, userSelect: 'none', fontSize: 13, color: '#4d4d4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                                                                                    {item.name}
                                                                                                </Typography>
                                                                                            </Stack>
                                                                                        </Stack>
                                                                                        <AppsIcon sx={{ fontSize: 13, color: 'gray' }} />
                                                                                    </Stack>
                                                                                )}
                                                                            </Draggable>
                                                                        )
                                                                    })
                                                                        : <Typography sx={{ fontSize: 12, display: 'flex' }} component='div'>No results. {selectKey ? <Typography onClick={() => setSelectKey("")} sx={{ ml: 1, cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Clear</Typography> : null}</Typography>
                                                                }
                                                                {provided.placeholder}
                                                            </Box>
                                                        )
                                                    })()
                                                }
                                            </Stack>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Box>
                            {
                                list.filter((e) => e.name.toLowerCase().search(selectKey) !== -1).length ?
                                    <Stack direction='row' spacing={2}>
                                        <Button variant='contained' onClick={() => handleAll(true, uidx)} sx={{ width: '50%', textTransform: 'capitalize', color: '#4d4d4d', fontSize: 11, bgcolor: '#0000000d', py: .5, '&:hover': { bgcolor: '#0000000d' } }}>Hide all</Button>
                                        <Button variant='contained' onClick={() => handleAll(false, uidx)} sx={{ width: '50%', textTransform: 'capitalize', color: '#4d4d4d', fontSize: 11, bgcolor: '#0000000d', py: .5, '&:hover': { bgcolor: '#0000000d' } }}>Show all</Button>
                                    </Stack>
                                    : null
                            }
                            {
                                (() => {
                                    if (isAdmin) {
                                        const onlyUser = users.filter((e) => e.role !== 'Admin')
                                        return (
                                            <Box sx={{ pt: 1 }}>
                                                <Divider />
                                                <Select
                                                    sx={{ width: '100%', mt: 1, '& .MuiSelect-select': { py: 1, } }}
                                                    value={uidx}
                                                    onChange={userChange}
                                                >
                                                    <MenuItem value={-1}>
                                                        <em>For Admin</em>
                                                    </MenuItem>
                                                    {
                                                        onlyUser.map(({ _id, firstName, lastName, department }, i) => (
                                                            <MenuItem key={_id} value={i}>
                                                                <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%'>
                                                                    <Typography sx={{ fontSize: 14 }}> {`${firstName} ${lastName}`}</Typography>
                                                                    <Typography sx={{ fontSize: 10 }} align="right" > {department}</Typography>
                                                                </Stack>
                                                            </MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                                <Button disabled={uidx < 0} onClick={() => handleAllowSave(onlyUser[uidx]._id)} variant='contained' sx={{ width: '100%', mt: 1, textTransform: 'capitalize', color: '#4d4d4d', fontSize: 11, bgcolor: '#0000000d', py: .5, '&:hover': { bgcolor: '#0000000d' } }}>Save options</Button>
                                            </Box>
                                        )
                                    } else {
                                        return null;
                                    }
                                })()
                            }
                        </Box>
                    </Popover>
                    :
                    <Popover
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Box sx={{ py: 1, px: 2 }}>
                            <TextField placeholder='Find an option' onChange={(e) => setSelectKey(e.target.value)} autoFocus sx={{ borderBottom: '1px solid #0000001a', pt: 1, pb: .5, width: '100%', '& fieldset': { display: 'none' }, '& input': { py: 0, px: 1, fontSize: 13 } }} />
                            <Box sx={{ py: 1 }}>
                                <Stack
                                    spacing={.5}
                                    sx={{ maxWidth: 500, minWidth: 300, bgcolor: '#fff' }}
                                >
                                    {
                                        (() => {
                                            const filtered = list.filter((e) => e.name.toLowerCase().search(selectKey) !== -1).sort((a, b) => a.order - b.order);
                                            return (
                                                <Box sx={{ minHeight: filtered.length * 31 }}>
                                                    {
                                                        filtered.length ? filtered.map((item, i) => {
                                                            return (
                                                                <Stack
                                                                    key={i}
                                                                    direction='row'
                                                                    alignItems='center'
                                                                    sx={{ px: 1, py: .5, cursor: 'pointer', borderRadius: 1, bgcolor: '#fff', '&:hover': { bgcolor: '#0000000d' } }}
                                                                >
                                                                    <AntSwitch checked={(uidx || uidx === 0) ? (item.allowed ? true : false) : !item.hide} inputProps={{ 'aria-label': 'ant design' }} onChange={(e) => handleHide(e, item.index, uidx)} />
                                                                    <Stack direction='row' alignItems='center' sx={{ overflow: 'hidden', }}>
                                                                        <Stack sx={{ mr: 1, ml: 2, '& svg': { height: 13, width: 15 } }}>
                                                                            {
                                                                                (() => {
                                                                                    switch (item.type) {
                                                                                        case 'text':
                                                                                            return <Font />
                                                                                        case 'longText':
                                                                                            return <LongText />
                                                                                        case 'email':
                                                                                            return <Font />
                                                                                        case 'attached':
                                                                                            return <Attached />
                                                                                        case 'date':
                                                                                            return <Date />
                                                                                        case 'select':
                                                                                            return <Option />
                                                                                        default:
                                                                                            return <Font />
                                                                                    }
                                                                                })()
                                                                            }
                                                                        </Stack>
                                                                        <Typography sx={{ ml: .2, userSelect: 'none', fontSize: 13, color: '#4d4d4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                                                            {item.name}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Stack>
                                                            )
                                                        })
                                                            : <Typography sx={{ fontSize: 12, display: 'flex' }} component='div'>No results. {selectKey ? <Typography onClick={() => setSelectKey("")} sx={{ ml: 1, cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Clear</Typography> : null}</Typography>
                                                    }
                                                </Box>
                                            )
                                        })()
                                    }
                                </Stack>
                            </Box>

                            {
                                list.filter((e) => e.name.toLowerCase().search(selectKey) !== -1).length ?
                                    <Stack direction='row' spacing={2}>
                                        <Button variant='contained' onClick={() => handleAll(true, uidx)} sx={{ width: '50%', textTransform: 'capitalize', color: '#4d4d4d', fontSize: 11, bgcolor: '#0000000d', py: .5, '&:hover': { bgcolor: '#0000000d' } }}>Hide all</Button>
                                        <Button variant='contained' onClick={() => handleAll(false, uidx)} sx={{ width: '50%', textTransform: 'capitalize', color: '#4d4d4d', fontSize: 11, bgcolor: '#0000000d', py: .5, '&:hover': { bgcolor: '#0000000d' } }}>Show all</Button>
                                    </Stack>
                                    : null
                            }
                        </Box>
                    </Popover>
            }
        </Box>
    )
}

export default HideOption;