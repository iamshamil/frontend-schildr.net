import { useEffect, useState } from 'react';
import { hex } from 'generate-random-color';
import uuid from 'react-uuid';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import Axios, { updateRow, updateLog } from '../../../../utilis/request';
import useTableContext from '../../../../hooks/useTable';
import useConfig from '../../../../hooks/useConfig';

const MultiSelectCell = (props) => {
    const { data, width, position } = props;
    const { hId, body, changeBody, header, changeHeader, active, isAdmin } = useTableContext();
    const { user } = useConfig();
    const [list, setList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectKey, setSelectKey] = useState("");

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget.parentElement.parentElement)
    };

    const close = async (id, label, color) => {
        if (id) {
            let t = { data: body }, history = [];
            let rowId = t.data[position[0]]._id;
            let old = t.data[position[0]].row[position[1]].data;

            history = old.map((one) => {
                let item = header[position[1]].list.filter(e => e.id === one);
                return { status: 'nochange', ...item[0] };
            });
            history.push({ status: 'add', id, label, color });

            t.data[position[0]].row[position[1]].data.push(id);
            changeBody(t.data);

            let rdata = await updateRow({ data: t.data[position[0]], updater: user._id });
            if (rdata.status) {
                let log = {
                    type: 'activity',
                    rowId,
                    history,
                    dataType: 'multiSelect',
                    sign: { [user._id]: true },
                    creator: user,
                    cellName: header[position[1]].name,
                    cellId: data.id,
                    columnId: header[position[1]].id
                }
                updateLog(log);
            } else {
                alert('server error!');
            }
        }
        setAnchorEl(null);
        setSelectKey("");
    };
    const removeHandle = async (index) => {
        let t = { data: body }, history = [];
        let rowId = t.data[position[0]]._id;
        let old = t.data[position[0]].row[position[1]].data;

        history = old.map((one, i) => {
            let item = header[position[1]].list.filter(e => e.id === one);
            return { status: index === i ? 'remove' : 'nochange', ...item[0] };
        });
        old.splice(index, 1);
        t.data[position[0]].row[position[1]].data = old;

        if (t.data[position[0]].updater?._id !== user._id) {
            let temp = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                color: user.color
            }
            t.data[position[0]].updater = temp;
        }
        t.data[position[0]].updatedAt = new Date();

        changeBody(t.data);

        let rdata = await updateRow({ data: t.data[position[0]], updater: user._id });
        if (rdata.status) {
            let log = {
                type: 'activity',
                rowId,
                history,
                dataType: 'multiSelect',
                sign: { [user._id]: true },
                creator: user,
                cellName: header[position[1]].name,
                cellId: data.id,
                columnId: header[position[1]].id
            }
            updateLog(log);
        } else {
            alert('server error!');
        }
    }

    const create = (label) => {
        const color = hex(), id = uuid();
        let newHeader = header;
        newHeader[position[1]].list.push({ id, label, color, order: newHeader[position[1]].list.length });
        changeHeader(newHeader);
        Axios('POST', 'table/updateHeader', { data: { row: newHeader, hId } }).then((rdata) => {
            if (!rdata.status) alert('server error!')
        })
        close(id, label, color)
    }
    const handleClose = () => {
        setAnchorEl(null);
        setSelectKey("");
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const filtered = list.filter((e) => e.label.toLowerCase().search(selectKey) !== -1);
            if (filtered.length) {
                close(filtered[0].id)
            } else if (isAdmin) {
                create(selectKey);
            } else {
                setAnchorEl(null);
                setSelectKey("");
            }
        }
    };

    useEffect(() => {
        const iList = header[position[1]].list.map((e, i) => { e.index = i; return e; });
        setList(iList);
    }, [header, position, data.data]);

    return (
        <>
            {
                active === position.join('_') ?
                    <Stack className='selectItems-wrap' sx={{ height: 'auto', minHeight: 34, position: 'absolute', borderRadius: '1px', flexWrap: "wrap", bgcolor: '#fff', ml: '-1px', boxShadow: '0 0 0 2px #2d7ff9 !important', width: width + 2 }} >
                        <Stack direction='row' sx={{ flexWrap: "wrap", alignItems: 'center' }} >
                            {
                                (() => {
                                    if (data.data.length) {
                                        return (
                                            <>
                                                {
                                                    data.data.map((item, i) => {
                                                        const idx = list.findIndex((e) => e.id === item);
                                                        return (
                                                            <Typography key={i} component='span' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: '3px', ml: '3px', height: 18, borderRadius: 50, bgcolor: header[position[1]].colored ? list[idx]?.color : '#b3b0b0', px: 1, minWidth: 18, mr: .5 }}>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        maxWidth: "100%",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "pre",
                                                                        fontSize: 13,
                                                                        minWidth: 18,
                                                                        color: '#fff'
                                                                    }}
                                                                >
                                                                    {list[idx]?.label}
                                                                </Box>
                                                                {
                                                                    header[position[1]].editable &&
                                                                    <CloseIcon sx={{ fontSize: 14, ml: .5, color: '#fff' }} onClick={() => removeHandle(i)} />
                                                                }
                                                            </Typography>
                                                        )
                                                    })
                                                }
                                            </>
                                        )
                                    } else {
                                        return null;
                                    }
                                })()
                            }
                            {
                                header[position[1]].editable &&
                                <Stack onClick={handleClick} alignItems='center' justifyContent='center' sx={{ mt: .25, height: 28, borderRadius: '3px', px: .5, cursor: 'pointer', bgcolor: '#0000000d', '&:hover': { bgcolor: '#0000001a' } }}>
                                    <AddIcon sx={{ fontSize: 12 }} />
                                </Stack>
                            }
                        </Stack>
                    </Stack> :
                    <Box sx={{ p: '6px', height: '100%', display: 'flex' }}>
                        {
                            (() => {
                                if (data.data.length) {
                                    return (
                                        <>
                                            {
                                                data.data.map((item, i) => {
                                                    const idx = list.findIndex((e) => e.id === item);
                                                    return (
                                                        <Typography key={i} component='span' sx={{ height: 18, borderRadius: 50, bgcolor: header[position[1]].colored ? list[idx]?.color : '#b3b0b0', px: 1, mr: .5 }}>
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    maxWidth: "100%",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "pre",
                                                                    fontSize: 13,
                                                                    color: '#fff'
                                                                }}
                                                            >
                                                                {list[idx]?.label}
                                                            </Box>
                                                        </Typography>
                                                    )
                                                })
                                            }
                                        </>
                                    )
                                } else {
                                    return null;
                                }
                            })()
                        }
                    </Box>
            }
            <Popover
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{ '& .MuiPaper-rounded': { width, mt: -1.5, minWidth: 160 } }}
            >
                <Box>
                    <TextField placeholder='Find an option' onKeyDown={handleKeyDown} onChange={(e) => setSelectKey(e.target.value)} autoFocus sx={{ pt: 1, width: '100%', '& fieldset': { display: 'none' }, '& input': { py: 0, px: 1, fontSize: 13 } }} />
                    {
                        (() => {
                            const filtered = list.filter((one) => {
                                let exist = data.data.findIndex((a) => a === one.id);
                                return (exist === -1 && one.label.toLowerCase().search(selectKey) !== -1);
                            });
                            if (filtered.length) {
                                return (
                                    <>
                                        {
                                            filtered.map(({ label, color, id }, idx) => (
                                                <MenuItem onClick={() => close(id, label, color)} key={idx}>
                                                    <Typography component='span' sx={{ height: 18, borderRadius: 50, bgcolor: header[position[1]].colored ? color : '#b3b0b0', px: 1, minWidth: 18 }}>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                maxWidth: "100%",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "pre",
                                                                fontSize: 13,
                                                                minWidth: 18,
                                                                color: '#fff'
                                                            }}
                                                        >
                                                            {label}
                                                        </Box>
                                                    </Typography>
                                                </MenuItem>
                                            ))
                                        }
                                    </>
                                )
                            } else if (selectKey && isAdmin) {
                                return (
                                    <MenuItem onClick={() => create(selectKey)}>
                                        <AddIcon sx={{ fontSize: 16, position: 'absolute', left: 4 }} />
                                        <Typography sx={{ pl: .5, width: '100%', overflow: 'hidden', fontSize: 13, whiteSpace: 'break-spaces' }}>create a new option named <b>{selectKey}</b></Typography>
                                    </MenuItem>
                                )
                            } else {
                                return <Box sx={{ p: 1 }} />
                            }
                        })()
                    }
                </Box>
            </Popover>
        </>
    )
}

export default MultiSelectCell;