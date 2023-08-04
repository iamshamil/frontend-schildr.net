import { useContext } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ReactComponent as Font } from '../../../assets/img/svg/font.svg';

import { TableContext } from '../../contexts/table';
import Cell from './Cell';

const Fixed = ({ fixedHeader, fixedW, scroll }) => {
    const { header, body, changeBody } = useContext(TableContext);

    const fixedFooter = () => {
        let left = 66, res = [];
        for (let i = 0; i < fixedHeader.length; i++) {
            res.push(
                <Box key={i} sx={{ position: 'absolute', height: 34, left: left, width: fixedHeader[i].width, bgcolor: '#ffffff80', borderTop: '1px solid #dde1e3', }}>
                </Box>
            )
            left += fixedHeader[i].width;
        }
        return res;
    }

    const addRow = () => {
        let newRow = [];
        for (let i = 0; i < header.length; i++) {
            newRow.push({ data: '' });
        }
        changeBody([...body, newRow]);
    }

    return (
        <Box sx={{
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 4,
            position: 'sticky',
            width: fixedW,
            height: '100%',
            overflow: 'visible',
            borderRight: '1px solid #ccc',
        }}>
            <Box sx={{
                height: 32,
                top: 0,
                left: 0,
                right: 0,
                zIndex: 3,
                overflow: 'visible',
                bgcolor: '#f2f2f2',
                position: 'absolute',

            }}>
                <Box sx={{ height: 32, position: 'relative' }}>
                    <Box sx={{ left: 0, top: 0, position: 'absolute', zIndex: 2, height: 32, display: 'flex' }}>
                        <Box sx={{
                            width: 66,
                            bgcolor: '#f5f5f5',
                            borderBottom: '1px solid #d1d1d1',
                            height: 32,
                        }}>
                            <Box sx={{
                                width: 35,
                                height: 32,
                                cursor: 'default',
                                borderLeft: 'none',
                                borderRight: 'none',
                                position: 'relative'
                            }}>
                                <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}
                                />
                            </Box>
                        </Box>
                        {
                            fixedHeader.map((item, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        pt: '1px',
                                        pl: '1px',
                                        width: item.width,
                                        height: 32,
                                        borderTop: 'none',
                                        bgcolor: '#f5f5f5',
                                        overflow: 'visible',
                                        verticalAlign: 'top',
                                        display: 'inline-block',
                                        borderBottom: '1px solid #d1d1d1',
                                        borderLeft: idx === 0 ? 'none' : '1px solid #dde1e3'
                                    }}
                                >
                                    <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ height: '100%', width: '100%', px: '5px' }}>
                                        <Stack direction='row' alignItems='center'>
                                            <Font />
                                            <Typography variant='span' sx={{ ml: '5px', color: '#333333', fontSize: 13 }}>{item.name}</Typography>
                                        </Stack>
                                        <ArrowDropDownIcon sx={{ cursor: 'pointer', fontSiz: 12, color: '#555555', opacity: .4, '&:hover': { opacity: 1 } }} />
                                    </Stack>
                                </Box>
                            ))
                        }
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    left: 0,
                    top: 32,
                    transform: `translate3d(0px, ${scroll}px, 0px)`,
                    right: 0,
                    bottom: 0,
                    zIndex: 2,
                    bgcolor: '#fcfcfc',
                    // overflow: 'hidden',
                    position: 'absolute',
                }}>
                <Box sx={{
                    height: 32,
                    position: 'relative',

                }}>
                    {
                        body.map((item, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: 'flex',
                                    width: '100%',
                                    height: 32,
                                }}
                            >
                                <Stack direction='row' sx={{
                                    width: 67,
                                    height: 32,
                                    bgcolor: '#fff',
                                    borderBottom: '1px solid #dde1e3',
                                }}>
                                    <Box sx={{ display: 'inline-block', position: 'relative', height: 32, width: 32, zIndex: 2, textAlign: 'center' }}>
                                        <Box sx={{ position: 'absolute', width: '100%', top: 7, color: '#707070', textAlign: 'center', fontSize: 12 }}>{idx + 1}</Box>
                                        <Checkbox sx={{ opacity: 0, position: 'absolute', left: 7, top: 0, width: 11, '& .MuiSvgIcon-root': { fontSize: 15 } }} />
                                    </Box>
                                    <Stack sx={{ zIndex: 2, alignItems: 'center', py: .5, px: 0 }} >
                                        <Stack sx={{ height: '100%', width: 8, borderRadius: 50 }} />
                                    </Stack>
                                    <Box sx={{ ml: .2, opacity: 0 }}>
                                        <Stack direction='row' sx={{ position: 'relative', height: '100%', alignItems: 'center', cursor: 'pointer', }}>
                                            <Stack direction='row' alignItems='center' justifyContent='center' sx={{ height: 20, width: 20, borderRadius: 50, '&:hover': { bgcolor: '#d0f0fd' } }}>
                                                <OpenInFullIcon sx={{ fontSize: 16, color: '#2d7ff9' }} />
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Stack>
                                {
                                    item.slice(0, fixedHeader.length).map((td, i) => (
                                        <Cell key={i} width={fixedHeader[i].width} border={i === 0} data={td} position={`${idx}_${i}`} />
                                    ))
                                }
                            </Box>
                        ))
                    }
                </Box>
            </Box>

            <Box sx={{
                height: 34,
                position: 'absolute',
                bottom: 1,
                left: 0,
                right: 0,
                zIndex: 3,
            }}
            >
                <Box sx={{ position: 'absolute', left: 0, width: 66, bgcolor: '#ffffff80', borderTop: '1px solid #dde1e3', }}>
                    <Box sx={{
                        top: 0,
                        left: 0,
                        height: 34,
                        overflow: 'visible',
                        position: 'absolute',
                    }}>
                        <Box sx={{ position: 'relative' }}>
                            <Stack direction='row' sx={{ position: 'absolute', zIndex: 1, height: 24, left: 0, top: 0 }}>
                                <Stack direction='row' sx={{ position: 'relative', pl: 1, flex: '1 1 auto', bottom: 16, }}>
                                    <IconButton onClick={() => addRow()} sx={{ position: 'relative', height: 36, width: 36, borderRadius: 50, border: '1px solid #0000001a', bgcolor: '#fff', p: 1, '&:hover': { bgcolor: '#fff' } }}>
                                        <AddIcon />
                                    </IconButton>
                                </Stack>
                                <Box sx={{
                                    px: 1,
                                    pt: '3px',
                                    pb: '2px',
                                    fontSize: 11,
                                    width: 'auto',
                                    overflow: 'hidden',
                                    position: 'static',
                                    bgcolor: '#fbfbfb',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                }}>
                                    {`${body.length} records`}
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
                {fixedFooter()}
            </Box>
        </Box >
    )
}

export default Fixed;