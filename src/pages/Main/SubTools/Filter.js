import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import { ReactComponent as Font } from '../../../assets/img/svg/font.svg';
import { ReactComponent as LongText } from '../../../assets/img/svg/longText.svg';
import { ReactComponent as Attached } from '../../../assets/img/svg/attached.svg';
import { ReactComponent as Option } from '../../../assets/img/svg/option.svg';
import { ReactComponent as Date } from '../../../assets/img/svg/date.svg';

import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import useTableContext from '../../../hooks/useTable';

const conditions = [{ label: 'contains...', value: 'contain' }, { label: 'does not contain...', value: 'notContain' }, { label: 'is...', value: 'is' }, { label: 'is not...', value: 'isNot' }, { label: 'is empty', value: 'isEmpty' }, { label: 'is not empty', value: 'notEmpty' }];

export const compare = (data, condition, key) => {
    switch (condition) {
        case 'contain':
            if (data.toLocaleLowerCase().search(key.toLocaleLowerCase()) > -1) return true;
            return false;
        case 'notContain':
            if (data.toLocaleLowerCase().search(key.toLocaleLowerCase()) > -1) return false;
            return true;
        case 'is':
            if (data.toLocaleLowerCase() === key.toLocaleLowerCase()) return true;
            return false;
        case 'isNot':
            if (data.toLocaleLowerCase() === key.toLocaleLowerCase()) return false;
            return true;
        case 'isEmpty':
            if (data.toLocaleLowerCase() === '') return true;
            return false;
        case 'notEmpty':
            if (data.toLocaleLowerCase() !== '') return true;
            return false;
        default:
            return false;
    }
}

const Filter = () => {
    const { header, changeFilterBody, filterItem, setFilterItem, body, setFilter } = useTableContext();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [type, setType] = useState('or');

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = (event) => setAnchorEl(null);
    const handleAdd = () => {
        let one = {
            field: 0,
            condition: 'contain',
            value: ''
        }
        setFilterItem([...filterItem, one])
    };
    const handleChange = (i, k, v) => {
        let temp = filterItem;
        filterItem[i][k] = v;
        setFilterItem([...temp]);
    }
    const handleDelete = (i) => {
        let temp = filterItem;
        temp.splice(i, 1);
        setFilterItem([...temp]);
    }
    /* eslint-disable */
    useEffect(() => {
        if (filterItem.length) {
            setFilter(true);
            let temp = body.filter((e) => {
                let result = [];
                for (const k in filterItem) {
                    let data = '', n, idx = filterItem[k].field;
                    switch (header[idx].type) {
                        case 'text':
                        case 'date':
                        case 'email':
                        case 'longText':
                            data = e.row[filterItem[k].field].data;
                            break;
                        case 'select':
                            n = e.row[filterItem[k].field].data;
                            data = header[filterItem[k].field].list[Number(n)].label;
                            break;
                        case 'attached':
                            let imgs = e.row[filterItem[k].field].data;
                            data = imgs.map((e) => e.originalname).join(',');
                            break;
                        default:
                            data = e.row[filterItem[k].field].data;
                            return data;

                    }
                    result.push(compare(data, filterItem[k].condition, filterItem[k].value));
                }
                if (type === 'and' && result.filter(p => !p).length === 0) {
                    return true;
                } else if (type === 'or' && result.filter(p => p).length > 0) {
                    return true;
                } else {
                    return false;
                }
            })
            changeFilterBody([...temp])
        } else {
            setFilter(false);
            changeFilterBody([]);
        }
    }, [filterItem, type])
    /* eslint-enable */

    return (
        <Box>
            <Button
                size='small'
                startIcon={<FilterListIcon sx={{ fontSize: 16 }} />}
                onClick={handleClick}
                sx={{
                    px: 1,
                    fontSize: 13,
                    color: '#4d4d4d',
                    textTransform: 'capitalize',
                    '&:hover': { bgcolor: '#0000000d' }
                }}>
                Filter
            </Button>
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
                    <Typography sx={{ ml: .2, userSelect: 'none', fontSize: 13, color: '#4d4d4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                        In this view, show tasks
                    </Typography>
                    <Box sx={{ py: 1 }}>
                        <Stack spacing={1} sx={{ minWidth: 300 }}>
                            {
                                filterItem.map((one, a) => (
                                    <Stack direction='row' alignItems='center' key={a}>
                                        {
                                            (() => {
                                                if (a === 0) {
                                                    return (
                                                        <Typography sx={{ width: 60, mr: 1, display: 'flex', justifyContent: 'center', userSelect: 'none', fontSize: 13, color: '#4d4d4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                                            Where
                                                        </Typography>
                                                    )
                                                } else if (a === 1) {
                                                    return (
                                                        <Select
                                                            value={type}
                                                            onChange={(e) => setType(e.target.value)}
                                                            sx={{
                                                                width: 60,
                                                                mr: 1,
                                                                borderRadius: 0,
                                                                border: '1px solid #0000001a',
                                                                '& .MuiSelect-select': {
                                                                    py: 0,
                                                                    pl: .5,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    '& .MuiTypography-root': {
                                                                        fontSize: 13,
                                                                    }
                                                                },
                                                                '& fieldset': { display: 'none' },
                                                                '& .MuiListItemIcon-root': {
                                                                    minWidth: 0,
                                                                    '& div': { margin: 0 }
                                                                }
                                                            }} >
                                                            {
                                                                ['or', 'and',].map((item, i) => (
                                                                    <MenuItem value={item} key={i}>
                                                                        <ListItemText>{item}</ListItemText>
                                                                    </MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    )
                                                } else {
                                                    return (
                                                        <Typography sx={{ width: 60, mr: 1, display: 'flex', justifyContent: 'center', userSelect: 'none', fontSize: 13, color: '#4d4d4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                                            {type}
                                                        </Typography>
                                                    )
                                                }
                                            })()
                                        }
                                        <Stack>
                                            <Stack direction='row' alignItems='center'>
                                                <Select
                                                    value={one.field}
                                                    onChange={(e) => handleChange(a, 'field', e.target.value)}
                                                    sx={{
                                                        width: 140,
                                                        borderRadius: 0,
                                                        border: '1px solid #0000001a',
                                                        borderRight: 0,
                                                        '& .MuiSelect-select': {
                                                            py: 0,
                                                            pl: .5,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            '& .MuiTypography-root': {
                                                                fontSize: 13,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }
                                                        },
                                                        '& fieldset': { display: 'none' },
                                                        '& .MuiListItemIcon-root': {
                                                            minWidth: 0,
                                                            '& div': { margin: 0 }
                                                        }
                                                    }}
                                                >
                                                    {
                                                        header.map((item, i) => (
                                                            <MenuItem value={i} key={i}>
                                                                <ListItemIcon sx={{ minWidth: '0px !important', }}>
                                                                    <Stack sx={{ mr: .5, '& svg': { height: 13 } }}>
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
                                                                </ListItemIcon>
                                                                <ListItemText>{item.name}</ListItemText>
                                                            </MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                                <Select
                                                    value={one.condition}
                                                    onChange={(e) => handleChange(a, 'condition', e.target.value)}
                                                    sx={{
                                                        width: 140,
                                                        borderRadius: 0,
                                                        border: '1px solid #0000001a',
                                                        borderRight: 0,
                                                        '& .MuiSelect-select': {
                                                            py: 0,
                                                            pl: .5,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            '& .MuiTypography-root': {
                                                                fontSize: 13,
                                                            }
                                                        },
                                                        '& fieldset': { display: 'none' },
                                                        '& .MuiListItemIcon-root': {
                                                            minWidth: 0,
                                                            '& div': { margin: 0 }
                                                        }
                                                    }} >
                                                    {
                                                        conditions.map((item, i) => (
                                                            <MenuItem value={item.value} key={i}>
                                                                <ListItemText>{item.label}</ListItemText>
                                                            </MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                                <TextField onChange={(e) => handleChange(a, 'value', e.target.value)} placeholder='Enter a value' value={one.value} sx={{ borderRadius: 0, border: '1px solid #0000001a', borderRight: 0, '& fieldset': { display: 'none' }, '& input': { p: .5, fontSize: 13 } }} />
                                                <Box onClick={() => handleDelete(a)} sx={{ cursor: 'pointer', borderRadius: 0, border: '1px solid #0000001a', p: .5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <DeleteIcon sx={{ fontSize: 19 }} />
                                                </Box>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                ))
                            }
                        </Stack>
                    </Box>
                    <Stack direction='row' spacing={2}>
                        <Button onClick={handleAdd} startIcon={<AddIcon sx={{ fontSiz: 13 }} />} variant='contained' sx={{ textTransform: 'capitalize', color: '#4d4d4d', fontSize: 11, bgcolor: '#0000000d', py: .5, '&:hover': { bgcolor: '#0000000d' } }}>Add condition</Button>
                    </Stack>
                </Box>
            </Popover >
        </Box >
    )
}

export default Filter;