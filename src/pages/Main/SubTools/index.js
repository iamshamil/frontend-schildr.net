import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { deleteSelected } from '../../../utilis/request';
import useTableContext from '../../../hooks/useTable';
import HideOption from './Hide';
import Filter, { compare } from './Filter';

const SubTools = () => {
    const [selectKey, setSelectKey] = useState("");
    const { header, changeFilterBody, body, changeBody, deleteRowList, setDeleteRowList } = useTableContext();

    const [showSearch, setShowSearch] = useState(false);
    const deleteAll = () => {
        deleteSelected(deleteRowList);
        let remain = body.filter((one) => {
            let flag = deleteRowList.findIndex((idOne) => idOne === one._id);
            return (flag === -1);
        });
        remain.sort((a, b) => a.order - b.order);
        for (let i = 0; i < remain.length; i++) {
            remain[i].order = i;
        }
        changeBody([...remain]);
        setDeleteRowList([]);
    }


    /* eslint-disable */
    useEffect(() => {
        if (selectKey) {
            let newBody = body;
            let temp = newBody.map((item) => {
                for (let i = 0; i < item.row.length; i++) {
                    let data = '', n;
                    switch (header[i].type) {
                        case 'text':
                        case 'date':
                        case 'email':
                        case 'longText':
                            data = item.row[i].data;
                            break;
                        case 'select':
                            n = item.row[i].data;
                            data = header[i].list[Number(n)] ? header[i].list[Number(n)].label : "";
                            break;
                        case 'attached':
                            let imgs = item.row[i].data;
                            data = imgs.map((e) => e.originalname).join(',');
                            break;
                        default:
                            data = item.row[i].data;
                            return data;

                    }
                    if (compare(data, 'contain', selectKey)) {
                        item.row[i].search = true;
                    } else {
                        item.row[i].search = false;
                    }
                }
                return item;
            })
            changeFilterBody([...temp])
            // setFilter(true);
        } else {
            // setFilter(false);
            let newBody = body;
            let temp = newBody.map((item) => {
                for (let i = 0; i < item.row.length; i++) {
                    item.row[i].search = false;
                }
                return item;
            })
            changeFilterBody([...temp])
        }
    }, [selectKey])
    /* eslint-enable */

    return (
        <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            sx={{
                top: 0,
                left: 0,
                zIndex: 7,
                height: 44,
                position: 'relative',
                bgcolor: '#fff',
                whiteSpace: 'nowrap',
                boxShadow: 'rgb(200 200 200) 0 1px 0 0'
            }}>
            <Stack
                direction='row'
                alignItems='center'
                spacing={.5}
                sx={{ height: 26, px: 2, }}
            >
                {
                    deleteRowList.length ?
                        <Button
                            size='small'
                            startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                            onClick={deleteAll}
                            sx={{
                                px: 1,
                                fontSize: 13,
                                color: '#f82b60',
                                textTransform: 'capitalize',
                                '&:hover': { bgcolor: '#0000000d' }
                            }}>
                            Delete Selected Rows
                        </Button> : null
                }
                <HideOption />
                <Filter />
            </Stack>
            <Stack
                direction='row'
                alignItems='center'
                sx={{ height: 26, pr: 2, position: 'relative' }}
            >
                <SearchIcon sx={{ fontSize: 24, cursor: 'pointer' }} onClick={() => setShowSearch(true)} />
                {
                    showSearch &&
                    <Box sx={{ width: 300, position: 'absolute', bottom: -46, right: 10, bgcolor: '#fff', borderWidth: '0px 2px 2px', borderStyle: 'solid', borderColor: '#0000001a', borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }}>
                        <Stack direction='row' alignItems='center'>
                            <TextField onChange={(e) => setSelectKey(e.target.value)} placeholder='Search' sx={{ py: 1, width: '100%', '& fieldset': { display: 'none' }, '& input': { py: 0, px: 1, fontSize: 13 } }} />
                            <CloseIcon sx={{ opacity: .5, cursor: 'pointer', fontSize: 20, mr: .5 }} onClick={() => setShowSearch(false)} />
                        </Stack>
                    </Box>
                }
            </Stack>
        </Stack>
    )
}

export default SubTools;