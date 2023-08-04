import { useEffect, useState } from 'react';
import { hex } from 'generate-random-color';
import uuid from 'react-uuid';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MuiColorInput } from 'mui-color-input'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AppsIcon from '@mui/icons-material/Apps';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

import { addColumn } from '../utilis/request';
import AntSwitch from './AntSwitch';
import { dataType } from '../config/constant';
import Icons from './Icons';

import useTableContext from '../hooks/useTable';

const AddColumn = () => {
    const { header, changeHeader, body, hId, setHid, setColumHandle, column } = useTableContext();
    const [selectKey, setSelectKey] = useState("");
    const [label, setLabel] = useState("");
    const [selected, setSelected] = useState(null);
    const [old, setOld] = useState({});
    const [colorPop, setColorPop] = useState(null);
    const [currentOption, setCurrentOption] = useState(0)
    const open = Boolean(column.target);
    const colorOpen = Boolean(colorPop);

    const changeColor = (color) => {
        let list = selected.list;
        list[currentOption].color = color;
        setSelected({ ...selected, list });
    }

    const handleClose = () => {
        setColumHandle({
            target: null,
            direction: 'left',
            index: 0,
            type: 'add'
        });
        setLabel("")
        setSelectKey('')
        setSelected(null)
    }

    const setOptionLable = (str, i) => {
        let list = selected.list;
        list[i].label = str;
        setSelected({ ...selected, list })
    }

    const removeOption = (i) => {
        let list = selected.list, newList = [];
        for (let item of list) {
            if (item.order === list[i].order) continue;
            if (item.order > list[i].order) {
                item.order--;
            }
            newList.push(item);
        }
        setSelected({ ...selected, list: newList })
    }

    const createOption = () => {
        const color = hex();
        let list = selected.list;
        list.push({ id: uuid(), label: '', color, order: list.length });
        setSelected({ ...selected, list })
    }

    const setColored = (e) => {
        setSelected({ ...selected, colored: e.target.checked })
    }

    const selectType = (item) => {
        if (item.type === 'select' || item.type === 'multiSelect') {
            item.list = [{ id: uuid(), label: '', color: '#fff', order: 0 }];
            item.colored = true;
        }
        setSelected(item)
    }

    const Alphabetize = () => {
        let list = selected.list;
        list.sort((a, b) => {
            if (a.label < b.label) {
                return -1;
            }
            if (a.label > b.label) {
                return 1;
            }
            return 1;
        });
        list = list.map((e, i) => {
            e.order = i;
            return e;
        })
        setSelected({ ...selected, list })
    }

    const onDragEnd = (result) => {
        if (result.destination) {
            let tempList = selected.list, startIndex = result.source.index, endIndex = result.destination.index, newOrder = [];
            if (startIndex < endIndex) {
                for (let item of tempList) {
                    if (item.order === startIndex) {
                        item.order = endIndex;
                    } else if (item.order > startIndex && item.order <= endIndex) {
                        item.order--;
                    }
                    newOrder.push(item);
                }
            } else {
                for (let item of tempList) {
                    if (item.order === startIndex) {
                        item.order = endIndex;
                    } else if (item.order >= endIndex && item.order < startIndex) {
                        item.order++;
                    }
                    newOrder.push(item);
                }
            }
            tempList.sort((a, b) => a.order - b.order);
            setSelected({ ...selected, list: tempList });
        }
    }

    const addField = async () => {
        let newHeader = [], newBody = [], newItem = {}, typeChange = false;
        let idx = header.findIndex((e) => e.order === column.index);
        if (header[idx]) {
            typeChange = (selected.type !== header[idx].type)
        }
        if (column.type === 'add') {
            newItem = { ...selected, name: label, hide: false, allowed: true, editable: true, width: 200, order: column.index, id: uuid() };

            for (let item of header) {
                if (item.order >= column.index) {
                    item.order++;
                }
                newHeader.push(item);
            }
            newHeader.push(newItem);
        } else {
            newItem = { ...old, ...selected, name: label, order: column.index };
            if (selected.type === 'select' || selected.type === 'multiSelect') {
                if (!newItem.list) {
                    newItem.list = [];
                }

                if (newItem.colored === undefined || newItem.colored === null) {
                    newItem.colored = true;
                }
            }
            let mheader = header;
            mheader[idx] = newItem;
            newHeader = mheader;
        }

        setColumHandle({
            target: null,
            direction: 'left',
            index: 0,
            type: 'add'
        });

        let rdata = await addColumn({ data: newItem, hId, index: column.index, type: column.type, typeChange });
        if (rdata.status) {
            changeHeader([...newHeader]);
            if (column.type === 'add') {
                for (let item of body) {
                    switch (selected.type) {
                        case 'text':
                        case 'longText':
                        case 'email':
                        case 'date':
                        case 'link':
                        case 'number':
                        case 'select':
                        case 'createdAt':
                        case 'updatedAt':
                        case 'createdBy':
                        case 'updatedBy':
                            item.row.push({ id: uuid(), data: '' });
                            break;
                        case 'checkBox':
                            item.row.push({ id: uuid(), data: false });
                            break;
                        case 'multiSelect':
                        case 'attached':
                            item.row.push({ id: uuid(), data: [] });
                            break;
                        default:
                            item.row.push({ id: uuid(), data: '' });
                            break;
                    }
                    newBody.push(item);
                }
            } else {
                if (typeChange) {
                    for (let item of body) {
                        switch (selected.type) {
                            case 'text':
                            case 'longText':
                            case 'email':
                            case 'date':
                            case 'link':
                            case 'number':
                            case 'select':
                            case 'createdAt':
                            case 'updatedAt':
                            case 'createdBy':
                            case 'updatedBy':
                                item.row[idx] = { id: uuid(), data: '' };
                                break;
                            case 'checkBox':
                                item.row.push({ id: uuid(), data: false });
                                break;
                            case 'multiSelect':
                            case 'attached':
                                item.row[idx] = { id: uuid(), data: [] };
                                break;
                            default:
                                item.row[idx] = { id: uuid(), data: '' };
                                break;
                        }
                    }
                }
            }
            if (rdata.new) {
                setHid(rdata.data._id)
            }
        } else {
            alert(rdata.message);
        }

        setLabel("");
        setSelectKey('');
        setSelected(null);
    }

    const openColorPicker = (e, i) => {
        setColorPop(e.currentTarget);
        setCurrentOption(i)
    }

    /* eslint-disable */
    useEffect(() => {
        if (column.type === 'edit') {
            let i = header.findIndex((e) => e.order === column.index);
            setSelected({ ...header[i] })
            setLabel(header[i].name)
            setOld({ ...header[i] })
        }
    }, [column.type])
    /* eslint-enable */

    return (
        <Popover
            anchorEl={column.target}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: column.direction,
            }}
            sx={{ '& .MuiPopover-paper': { boxShadow: '0 0 0 2px #00000040' } }}
        >
            <Box sx={{ py: 1, px: 2, width: 400 }}>
                <TextField placeholder='Field name' value={label} onChange={(e) => setLabel(e.target.value)} autoFocus sx={{ py: 1, width: '100%', '& input': { py: 1, px: 1, fontSize: 15 }, '& fieldset': { borderWidth: 2 } }} />
                {
                    selected ?
                        <Box sx={{ width: '100%' }}>
                            <Stack onClick={() => setSelected(null)} direction='row' alignItems='center' sx={{ width: '100%', py: 1, px: 2, cursor: 'pointer', borderRadius: 1, bgcolor: '#0000000d' }}>
                                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ overflow: 'hidden', width: '100%' }}>
                                    <Stack direction='row' alignItems='center'>
                                        <Stack sx={{ mr: 1, '& svg': { height: 16 } }}>
                                            <Icons type={selected.type} />
                                        </Stack>
                                        <Typography sx={{ ml: .2, userSelect: 'none', fontSize: 15, color: '#4d4d4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                            {selected.typeName}
                                        </Typography>
                                    </Stack>
                                    <ArrowDropDownIcon />
                                </Stack>
                            </Stack>
                            {
                                selected.type === 'select' || selected.type === 'multiSelect' ?
                                    <Stack sx={{ mt: 1, width: '100%' }}>
                                        <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ width: '100%', my: 1 }}>
                                            <Stack direction='row' alignItems='center'>
                                                <AntSwitch checked={selected.colored} onChange={setColored} />
                                                <Typography sx={{ fontSize: 13, ml: 1 }}>Colored options</Typography>
                                            </Stack>
                                            <Button onClick={Alphabetize} size='small' variant='contained' startIcon={<SwapVertIcon sx={{ fontSize: 15 }} />} sx={{ color: '#4d4d4d', textTransform: 'capitalize', py: .5, bgcolor: '#0000000d', '&:hover': { bgcolor: '#00000029' } }}>Alphabetize</Button>
                                        </Stack>
                                        <Divider />
                                        <DragDropContext onDragEnd={onDragEnd}>
                                            <Stack
                                                spacing={1}
                                                sx={{ py: 1 }}
                                            >
                                                <Droppable droppableId="option-order" type="option-order">
                                                    {(provided, snapshot) => (
                                                        <Stack
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                            spacing={1}
                                                            sx={{ height: selected.list.length * 45.56 - 8 }}>
                                                            {
                                                                selected.list.map((item, i) => (
                                                                    <Draggable draggableId={item.id} index={i} key={item.id}>
                                                                        {(provided, snapshot) => (
                                                                            <Stack
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                ref={provided.innerRef}
                                                                                direction='row'
                                                                                alignItems='center'
                                                                                justifyContent='space-between'
                                                                                sx={{ py: .5, width: '100%', bgcolor: '#fff', borderRadius: 2, boxShadow: snapshot.isDragging ? '0 0 6px #898585' : '' }}
                                                                            >
                                                                                <Stack direction='row' alignItems='center' sx={{ width: '100%' }} >
                                                                                    <AppsIcon sx={{ fontSize: 13 }} />
                                                                                    {
                                                                                        selected.colored ?
                                                                                            <>
                                                                                                <IconButton onClick={(e) => openColorPicker(e, i)} sx={{ display: 'flex', width: 18, height: 18, alignItems: 'center', justifyContent: 'center', p: .1, borderRadius: 50, bgcolor: item.color, ml: .5, '&:hover': { bgcolor: item.color } }}>
                                                                                                    <ArrowDropDownIcon sx={{ fontSize: 15 }} />
                                                                                                </IconButton>
                                                                                                <Popover
                                                                                                    anchorEl={colorPop}
                                                                                                    open={colorOpen}
                                                                                                    onClose={() => setColorPop(null)}
                                                                                                    anchorOrigin={{
                                                                                                        vertical: 'bottom',
                                                                                                        horizontal: 'right',
                                                                                                    }}
                                                                                                    sx={{ '& .MuiPopover-paper': { boxShadow: '0 0 0 2px #00000040' } }}
                                                                                                >
                                                                                                    <MuiColorInput value={selected.list[currentOption] && selected.list[currentOption].color ? selected.list[currentOption].color : '#000'} onChange={(e) => changeColor(e)} />
                                                                                                </Popover>
                                                                                            </>
                                                                                            : null
                                                                                    }
                                                                                    <TextField value={item.label} onChange={(e) => setOptionLable(e.target.value, i)} sx={{ ml: 1, width: '100%', '& input': { px: 1, py: .5, fontSize: 15 } }} />
                                                                                </Stack>
                                                                                <IconButton sx={{ p: .5 }} onClick={() => removeOption(i)}>
                                                                                    <CloseIcon sx={{ fontSize: 15 }} />
                                                                                </IconButton>
                                                                            </Stack>
                                                                        )}
                                                                    </Draggable>
                                                                ))
                                                            }
                                                            {provided.placeholder}
                                                        </Stack>
                                                    )}
                                                </Droppable>
                                                <Button onClick={() => createOption()} size='small' variant='contained' startIcon={<AddIcon sx={{ fontSize: 15 }} />} sx={{ justifyContent: 'flex-start', color: '#4d4d4d', textTransform: 'capitalize', py: .5, bgcolor: '#0000000d', '&:hover': { bgcolor: '#00000029' } }}>Add an option</Button>
                                            </Stack>
                                        </DragDropContext>
                                        <Divider />
                                    </Stack>
                                    : null
                            }
                        </Box>
                        :
                        <Box sx={{ border: '2px solid #0000001a', overflow: 'hidden', width: '100%', borderRadius: 2 }}>
                            <TextField placeholder='Field name' onChange={(e) => setSelectKey(e.target.value)} sx={{ bgcolor: '#eee', py: 1, width: '100%', '& fieldset': { display: 'none' }, '& input': { py: 0, px: 1, fontSize: 13 } }} />
                            <Box sx={{ py: 1 }}>
                                <Stack spacing={.5} sx={{ px: .5 }}>
                                    {
                                        (() => {
                                            const filtered = dataType.filter((e) => e.typeName.toLowerCase().search(selectKey) !== -1);
                                            return (
                                                <>
                                                    {
                                                        filtered.map((item, i) => {
                                                            return (
                                                                <Stack onClick={() => selectType(item)} key={i} direction='row' alignItems='center' sx={{ py: 1, px: 2, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: '#0000000d' } }}>
                                                                    <Stack direction='row' alignItems='center' sx={{ overflow: 'hidden', }}>
                                                                        <Stack sx={{ mr: 1, '& svg': { height: 16 } }}>
                                                                            <Icons type={item.type} />
                                                                        </Stack>
                                                                        <Typography sx={{ ml: .2, userSelect: 'none', fontSize: 15, color: '#4d4d4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                                                            {item.typeName}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Stack>
                                                            )
                                                        })
                                                    }
                                                </>
                                            )
                                        })()
                                    }
                                </Stack>
                            </Box>
                        </Box>
                }

                <Stack direction='row' justifyContent='flex-end' spacing={1} sx={{ mt: 1 }}>
                    <Button variant='outlined' sx={{ textTransform: 'capitalize', px: 1, py: .5, color: '#4d4d4d', borderColor: '#e0e0e0', '&:hover': { borderColor: '#4d4d4d' } }} onClick={handleClose} >Cancel</Button>
                    <Button variant='contained' sx={{ textTransform: 'capitalize', px: 1, py: .5 }} color='primary' disabled={!selected || !label} onClick={() => addField()}>Save</Button>
                </Stack>
            </Box >
        </Popover >
    )
}

export default AddColumn;