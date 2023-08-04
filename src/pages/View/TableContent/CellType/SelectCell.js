import { useEffect, useState, } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import useTableContext from '../../../../hooks/useTable';

const SelectCell = (props) => {
    const { data, width, position } = props;
    const { header } = useTableContext();
    const [list, setList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectKey, setSelectKey] = useState("");

    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const close = async (id, label, color) => {
        setAnchorEl(null);
        setSelectKey("");
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectKey("");
    }

    useEffect(() => {
        const iList = header[position[1]].list.map((e, i) => { e.index = i; return e; })
        setList(iList)
    }, [header, position])

    return (
        <Box sx={{ p: '6px', height: '100%', display: 'flex' }} onDoubleClick={handleClick}>
            {
                (() => {
                    const idx = list.findIndex((e) => e.id === data.data);
                    if (idx !== -1) {
                        return (
                            <Typography component='span' sx={{ height: 18, borderRadius: 50, bgcolor: header[position[1]].colored ? list[idx]?.color : '#b3b0b0', px: 1, minWidth: 18 }}>
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
                                    {list[idx].label}
                                </Box>
                            </Typography>
                        )
                    } else {
                        return null;
                    }
                })()
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
                    <TextField placeholder='Find an option' onChange={(e) => setSelectKey(e.target.value)} autoFocus sx={{ pt: 1, width: '100%', '& fieldset': { display: 'none' }, '& input': { py: 0, px: 1, fontSize: 13 } }} />
                    {
                        (() => {
                            const filtered = list.filter((e) => e.label.toLowerCase().search(selectKey) !== -1);
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
                            } else {
                                return <Box sx={{ p: 1 }} />
                            }
                        })()
                    }
                </Box>
            </Popover>
        </Box>
    )
}

export default SelectCell;