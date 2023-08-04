import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import DialogContent from '@mui/material/DialogContent';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import useConfig from '../../hooks/useConfig';
import useTableContext from '../../hooks/useTable';
import AntSwitch from '../../components/AntSwitch';

import { makeHeaderData } from '../../utilis/util';
import { transferTable, getProjects, changeTab, createTab, updateTab, deleteTab, updateHeaderOrder, updateUser, createInviteLink } from '../../utilis/request';

const GridTabs = ({ headerNames, setHeaderNames }) => {
    const { projectId } = useParams();
    const [active, setActive] = useState(0);
    const [anchor, setAnchor] = useState(null);
    const [editAnchor, setEditAnchor] = useState(null);
    const [label, setLabel] = useState("");
    const [projectName, setProjectName] = useState(10);
    const [headerList, setHeaderList] = useState([]);
    const [selectKey, setSelectKey] = useState("");
    const [trnasferModal, setTrnasferModal] = useState(false);
    const open = Boolean(anchor);
    const edit = Boolean(editAnchor);
    const [projects, setProjects] = useState([]);
    const [link, setLink] = useState("");

    const { user } = useConfig();
    const { changeHeader, changeBody, setHid, selectEditabled, isAdmin, users, setUsers } = useTableContext();

    const popUp = (e) => {
        setAnchor(e.target)
    }

    const editPopUp = (e, index) => {
        setEditAnchor(e.target)
    }

    const closePop = (params) => {
        setAnchor(null)
        setEditAnchor(null)
        setLabel("")
    }

    const generateLink = async () => {
        const inviteLink = await createInviteLink(headerList[active]._id, user._id);
        if (inviteLink.status) {
            setLink(inviteLink.key)
        } else {
            toast.error('Link generation failed!')
        }
    }

    const selectTab = async (i, id) => {
        setActive(i);
        setLink("")
        let rdata = await changeTab(id);
        if (rdata.status) {
            setHid(id);
            selectEditabled("")
            const header = await makeHeaderData(user, id, user, rdata.header.row)
            changeHeader(header)
            changeBody(rdata.body)
        } else {
            alert("Failed")
        }
    }

    const onDragEnd = (result) => {
        if (result.destination) {
            let tempHeader = headerList, startIndex = result.source.index, endIndex = result.destination.index, newOrder = [];
            if (startIndex < endIndex) {
                for (let item of tempHeader) {
                    if (item.order === startIndex) {
                        item.order = endIndex;
                    } else if (item.order > startIndex && item.order <= endIndex) {
                        item.order--;
                    }
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
            setHeaderNames(newOrder)
            updateHeaderOrder({ startIndex, endIndex });
        }
    }

    const handleCreate = async (params) => {
        if (projectId) {
            setLink("")
            let rdata = await createTab({ name: label, pId: projectId })
            if (rdata.status) {
                setHeaderList([...headerList, rdata.data]);
                setHeaderNames([...headerNames, rdata.data]);

                setActive(headerList.length);
                setHid(rdata.data._id);
                selectEditabled("")
                changeHeader([])
                changeBody([])
            } else {
                alert('Faliled!')
            }
            closePop()
            setLabel("")
        } else {
            toast.error("Required Project Id")
        }
    }

    const changName = async () => {
        let origin = headerList[active];
        if (!label) return;
        if (label === origin.name) {
            closePop();
            return;
        }
        let rdata = await updateTab(origin._id, label);
        if (rdata.status) {
            headerList[active].name = label;
        } else {
            alert(rdata.message);
        }
        closePop();
    }

    const deleteHandle = async () => {
        let origin = headerList[active];
        let rdata = await deleteTab(origin._id);
        if (rdata.status) {
            if (headerList[active + 1]) {
                headerList.splice(active, 1);
                selectTab(active, headerList[active]._id)
            } else if (headerList[active - 1]) {
                headerList.splice(active, 1);
                selectTab(active - 1, headerList[active - 1]._id)
            } else {
                setHeaderNames([])
                setHeaderList([])
            }
            closePop()
        } else {
            alert(rdata.message)
        }
    }

    const switchFunction = (event, index, id, flag) => {
        if (flag) {
            if (!isAdmin) return;
            editPopUp(event, index)
        } else {
            selectTab(index, id)
        }
    }

    const allowTable = async (userId, tableId, allowed) => {
        let index = users.findIndex((e) => e._id === userId);
        let temp = [...users];
        if (allowed) {
            let itemIdx = temp[index].myTable.findIndex((e) => e === tableId);
            temp[index].myTable.splice(itemIdx, 1);
        } else {
            temp[index].myTable.push(tableId)
        }
        let rdata = await updateUser({ id: userId, data: { myTable: temp[index].myTable } });
        if (rdata.status) {
            setUsers(temp);
        } else {
            alert(rdata.message)
        }
    }

    const openTransferModal = async () => {
        if (projects.length) {
            setProjectName(projects[0]?._id)
            setTrnasferModal(true)
        } else {
            const data = await getProjects();
            if (data.status) {
                if (data.data.length === 1) {
                    toast.info("There are no other projects")
                } else {
                    const temp = data.data.filter(e => e._id !== projectId)
                    setProjects(temp)
                    setProjectName(temp[0]?._id)
                    setTrnasferModal(true)
                }
            } else {
                toast.error(data.message)
            }
        }
        setEditAnchor(null);
    }

    const closeTransferModal = () => {
        setTrnasferModal(false)
    }

    const handleProjectName = (event) => {
        setProjectName(event.target.value);
    }

    const handleTransfer = async () => {
        const origin = headerList[active];
        if (!projectName || !origin._id) {
            toast.error("Invalid params");
            return;
        }
        const data = await transferTable({ projectId: projectName, tableId: origin._id })
        if (data.status) {
            if (headerList[active + 1]) {
                headerList.splice(active, 1);
                selectTab(active, headerList[active]._id)
            } else if (headerList[active - 1]) {
                headerList.splice(active, 1);
                selectTab(active - 1, headerList[active - 1]._id)
            } else {
                setHeaderNames([])
                setHeaderList([])
            }
            closeTransferModal();
        } else {
            toast.error(data.message)
        }
    }


    useEffect(() => {
        setHeaderList(headerNames);
    }, [headerNames, setHeaderList]);

    return (
        <>
            <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ bgcolor: '#0000001a', height: 32, px: 2, position: 'relative', }}>
                <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, px: 2 }}>
                    <Stack direction='row' alignItems='center'>
                        <Stack direction='row'>
                            <Stack direction='row' sx={{ height: 32 }}>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="tab-order" type="tab-order" direction="horizontal">
                                        {(provided, snapshot) => (
                                            <Stack direction='row' sx={{ flex: 'one', zIndex: 1, position: 'relative', }} ref={provided.innerRef} {...provided.droppableProps}>
                                                {
                                                    headerList.map((one, i) => {
                                                        return (
                                                            <Draggable draggableId={one.name} index={i} key={one.name + i} DraggingStyle={{ backgroundColor: '#000000', }}>
                                                                {(provided, snapshot) => (
                                                                    <Stack
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        ref={provided.innerRef}
                                                                        key={i}
                                                                        onClick={(e) => switchFunction(e, i, one._id, i === active)}
                                                                        direction='row'
                                                                        sx={{
                                                                            order: one.order,
                                                                            position: 'relative',
                                                                            cursor: 'pointer',
                                                                            borderTopRightRadius: '3px',
                                                                            borderTopLeftRadius: '3px',
                                                                            bgcolor: i === active ? '#fff' : "",
                                                                            boxShadow: i === active ? '#00000014 0px 0px 2px, #00000029 0px -1px 3px' : "",
                                                                            '&:after': {
                                                                                content: `''`,
                                                                                width: '1px',
                                                                                height: 15,
                                                                                bgcolor: '#ffffff85',
                                                                                top: 8,
                                                                                right: 0,
                                                                                position: 'absolute'
                                                                            },
                                                                            '&:hover': {
                                                                                bgcolor: i !== active && '#00000029',
                                                                                '&:after': {
                                                                                    width: 0
                                                                                }
                                                                            }
                                                                        }}>
                                                                        <Box>
                                                                            <Box
                                                                                sx={{
                                                                                    outlineOffset: '-5px',
                                                                                    height: '100%',
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center',
                                                                                    alignItems: 'center',
                                                                                    pr: i === active ? 4 : 2,
                                                                                    pl: i === active ? 1 : 2
                                                                                }}>
                                                                                <Typography variant='span' sx={{ fontSize: 13, userSelect: 'none', color: i !== active ? '#fff' : '' }}>{one.name}</Typography>
                                                                            </Box>
                                                                            {
                                                                                i === active &&
                                                                                <Stack alignItems='center' justifyContent="center"
                                                                                    sx={{
                                                                                        position: 'absolute',
                                                                                        top: 0,
                                                                                        right: 12,
                                                                                        height: '100%'
                                                                                    }}>
                                                                                    <ExpandMoreIcon sx={{ fontSize: 12 }} />
                                                                                </Stack>
                                                                            }
                                                                        </Box>
                                                                    </Stack>
                                                                )}
                                                            </Draggable>
                                                        )
                                                    })
                                                }
                                                {provided.placeholder}
                                            </Stack>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                                {
                                    isAdmin &&
                                    <Stack justifyContent='center' alignItems="center" sx={{ order: headerList.length }}>
                                        <IconButton sx={{ p: 0, ml: 1 }} onClick={popUp}>
                                            <AddIcon sx={{ color: '#fff' }} />
                                        </IconButton>
                                    </Stack>
                                }
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
            <Popover
                anchorEl={anchor}
                open={open}
                onClose={closePop}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: "right",
                }}
                sx={{ '& .MuiPopover-paper': { boxShadow: '0 0 0 2px #00000040' } }}
            >
                <Box sx={{ py: 1, px: 2, width: 400 }}>
                    <TextField placeholder='Field name' value={label} onChange={(e) => setLabel(e.target.value)} autoFocus sx={{ py: 1, width: '100%', '& input': { py: 1, px: 1, fontSize: 15 }, '& fieldset': { borderWidth: 2 } }} />
                    <Stack direction='row' justifyContent='flex-end' spacing={1} sx={{ mt: 1 }}>
                        <Button variant='outlined' sx={{ textTransform: 'capitalize', px: 1, py: .5, color: '#4d4d4d', borderColor: '#e0e0e0', '&:hover': { borderColor: '#4d4d4d' } }} onClick={closePop} >Cancel</Button>
                        <Button variant='contained' sx={{ textTransform: 'capitalize', px: 1, py: .5 }} color='primary' disabled={!label} onClick={() => handleCreate()}>Create</Button>
                    </Stack>
                </Box >
            </Popover >
            <Popover
                anchorEl={editAnchor}
                open={edit}
                onClose={closePop}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: "center",
                }}
                sx={{ '& .MuiPopover-paper': { boxShadow: '0 0 0 2px #00000040' } }}
            >
                <Box sx={{ py: 1, px: 2, width: 300 }}>
                    <Stack direction='row' justifyContent='flex-end' spacing={1} >
                        <TextField placeholder='Rename' value={label} onChange={(e) => setLabel(e.target.value)} autoFocus sx={{ width: '100%', '& input': { py: 1, px: 1, fontSize: 15 }, '& fieldset': { borderWidth: 2 } }} />
                        <Button variant='contained' sx={{ textTransform: 'capitalize', px: 1, py: .5 }} color='primary' disabled={!label} onClick={() => changName()}>Update</Button>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    <TextField placeholder='Find Users' value={selectKey} onChange={(e) => setSelectKey(e.target.value)} sx={{ width: '100%', mb: 1, '& input': { p: 1, fontSize: 13 }, '& fieldset': { borderWidth: 2 } }} />
                    <Stack
                        spacing={.5}
                        sx={{ maxWidth: 500, bgcolor: '#fff' }}
                    >
                        {
                            (() => {
                                const filtered = users.filter((e) => (e.firstName + " " + e.lastName).toLowerCase().search(selectKey) !== -1);
                                return (
                                    <Box sx={{ minHeight: filtered.length * 31 }}>
                                        {
                                            filtered.length ? filtered.map((item, i) => {
                                                return (
                                                    <Stack
                                                        key={i}
                                                        direction='row'
                                                        alignItems='center'
                                                        justifyContent="space-between"
                                                        sx={{ px: 1, py: .5, cursor: 'pointer', borderRadius: 1, bgcolor: '#fff', '&:hover': { bgcolor: '#0000000d' } }}
                                                    >
                                                        <Stack direction='row' alignItems='center' sx={{ overflow: 'hidden', }}>
                                                            <Typography sx={{ ml: .2, userSelect: 'none', fontSize: 13, color: '#4d4d4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                                                {`${item.firstName} ${item.lastName}`}
                                                            </Typography>
                                                        </Stack>
                                                        {
                                                            (() => {
                                                                let idx = -1;
                                                                if (headerList[active]) {
                                                                    idx = item.myTable.findIndex(e => e === headerList[active]._id);
                                                                }
                                                                let check = (idx !== -1);
                                                                return (
                                                                    <AntSwitch inputProps={{ 'aria-label': 'ant design' }} checked={check} onClick={() => allowTable(item._id, headerList[active]._id, check)} />
                                                                )
                                                            })()
                                                        }
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
                    <Divider sx={{ my: 1 }} />
                    <Stack >
                        <ListItem disablePadding>
                            <ListItemButton sx={{ py: 0, px: 0.5 }} onClick={openTransferModal}>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <SwapHorizIcon />
                                </ListItemIcon>
                                <ListItemText primary="Transfer" />
                            </ListItemButton>
                        </ListItem>
                        {
                            link ?
                                <ListItem disablePadding>
                                    <CopyToClipboard text={`${origin}/view/${link}`}>
                                        <ListItemButton sx={{ py: 0, px: 0.5 }}  >
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <ShareIcon />
                                            </ListItemIcon>
                                            <ListItemText sx={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} primary={`Link: ${link}`} />
                                        </ListItemButton>
                                    </CopyToClipboard>
                                </ListItem>
                                :
                                <ListItem disablePadding>
                                    <ListItemButton sx={{ py: 0, px: 0.5 }} onClick={generateLink}>
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            <ShareIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Generate link" />
                                    </ListItemButton>
                                </ListItem>
                        }
                        <ListItem disablePadding>
                            <ListItemButton sx={{ py: 0, px: 0.5 }} onClick={deleteHandle}>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Delete" />
                            </ListItemButton>
                        </ListItem>
                    </Stack>
                </Box >
            </Popover >
            <Dialog open={trnasferModal}>
                <DialogTitle>
                    Transfer Table
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={1} sx={{ py: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Project Name</InputLabel>
                            <Select
                                sx={{ minWidth: 300 }}
                                value={projectName}
                                label="Project Name"
                                onChange={handleProjectName}
                            >
                                {
                                    projects.map((e, i) => (
                                        <MenuItem value={e._id} key={i}>{e.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Stack>
                    <Stack direction='row' justifyContent='flex-end' sx={{ pt: 2 }}>
                        <Button variant='contained' color='error' sx={{ mr: 1 }} onClick={closeTransferModal}>Cancel</Button>
                        <Button variant='contained' color='info' onClick={handleTransfer} >
                            Transfer
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default GridTabs;