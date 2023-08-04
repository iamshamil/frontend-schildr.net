import React, { useEffect, useState, useRef } from 'react';
import uuid from 'react-uuid';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import AddIcon from '@mui/icons-material/Add';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';

import Axios, { duplicateRow, updateHeader, updateOrder, addTableRow } from '../../../utilis/request';
import AddColumn from '../../../components/AddColumn';
import TableHeader from './TableHeader';
import AllCheck from './AllCheck';
import TableRow from './TableRow';
import { allCheckWidth, checkWidth, processStatusWidth } from '../../../config/constant';
import useConfig from '../../../hooks/useConfig';
import useTableContext from '../../../hooks/useTable';

const GridBody = ({ mainW }) => {
    const popup = useRef(0);
    const { user } = useConfig();
    const { header, changeHeader, body, editable, changeBody, selectEditable, selectEditabled, selectActive, filterBody, isFilter, hId, setColumHandle, isAdmin } = useTableContext();
    const [index, setIndex] = useState(-1);
    const [xP, setXp] = useState(-1);
    const [visible, setVisible] = useState(false);
    const [order, setOrder] = useState({ id: '', index: -1 });

    const columnAddModal = (event) => {
        setColumHandle({
            direction: 'left',
            target: event.currentTarget,
            index: header.length,
            type: 'add'
        })
    }

    const teableHeader = () => {
        let res = [];

        res.push(<AllCheck key={-1} />)
        let realHeader = Object.assign([], header);
        realHeader = realHeader.map((e, i) => ({ ...e, index: i })).sort((a, b) => a.order - b.order);

        let fixedW = allCheckWidth + processStatusWidth;

        for (let i = 0; i < realHeader.length; i++) {
            if (realHeader[i].hide || !realHeader[i].allowed) continue;
            if (realHeader[i].fixed) {
                res.push(
                    <Box key={i} sx={{
                        order: realHeader[i].order,
                        height: '100%', position: 'sticky', left: fixedW, zIndex: 9, width: realHeader[i].width, bgcolor: '#f5f5f5', borderBottom: '1px solid #d1d1d1', borderRight: '1px solid #dde1e3'
                    }}>
                        <TableHeader me={realHeader[i]} i={realHeader[i].index} />
                        <Box onMouseDown={(e) => downEvent(e, realHeader[i].index)} onMouseUp={() => upEvent(i)} sx={{ width: '2px', bgcolor: index === realHeader[i].index ? "#1283da" : '#f5f5f5', height: "100%", position: 'absolute', top: 0, right: 0, '&:hover': { cursor: 'col-resize' } }} />
                    </Box>
                )
                fixedW += realHeader[i].width
            } else {
                res.push(
                    <Box
                        key={i}
                        sx={{
                            order: realHeader[i].order,
                            height: '100%', position: 'relative', width: realHeader[i].width, bgcolor: '#f5f5f5', borderBottom: '1px solid #d1d1d1', borderRight: '1px solid #dde1e3'
                        }}>
                        <TableHeader me={realHeader[i]} i={realHeader[i].index} />
                        <Box onMouseDown={(e) => downEvent(e, realHeader[i].index)} onMouseUp={() => upEvent(i)} sx={{ width: '2px', bgcolor: index === realHeader[i].index ? "#1283da" : '#f5f5f5', height: "100%", position: 'absolute', top: 0, right: 0, '&:hover': { cursor: 'col-resize' } }} />
                    </Box>
                )
            }
        }

        res.push(
            <React.Fragment key={header.length}>
                {
                    user.role === 'Admin' ?
                        <Box sx={{ height: '100%', width: 100, borderBottom: '1px solid #d1d1d1', order: header.length }}>
                            <Stack onClick={columnAddModal} direction='row' alignItems='center' justifyContent='center' sx={{ height: '100%', width: '100%', px: '5px', cursor: 'pointer' }}>
                                <AddIcon sx={{ fontSize: 16 }} />
                            </Stack>
                        </Box> :
                        <Box sx={{ height: '100%', width: 16, borderBottom: '1px solid #d1d1d1', order: header.length }} />
                }
            </React.Fragment >
        )
        return res;
    }

    // const tableAddRow = (data) => {
    //     let width = 0;
    //     for (let i = 0; i < header.length; i++) {
    //         if (header[i].hide || !header[i].allowed) continue;
    //         width += header[i].width;
    //     }
    //     if (isAdmin) {
    //         width += 230;
    //     }
    //     return (
    //         <>
    //             <Stack
    //                 onClick={addRow}
    //                 direction='row'
    //                 className='cell'
    //                 sx={{
    //                     width: 130,
    //                     height: 32,
    //                     bgcolor: '#fff',
    //                     borderBottom: '1px solid #dde1e3',
    //                     cursor: 'pointer'
    //                 }}>
    //                 <Box sx={{ display: 'inline-block', position: 'relative', height: 32, width: 32, zIndex: 2, textAlign: 'center' }}>
    //                     <Box sx={{ position: 'absolute', width: '100%', top: 7, color: '#707070', textAlign: 'center', fontSize: 12 }}>
    //                         <AddIcon sx={{ fontSize: 16 }} />
    //                     </Box>
    //                 </Box>
    //             </Stack>
    //             <Stack
    //                 onClick={addRow}
    //                 direction='row'
    //                 className='cell'
    //                 sx={{
    //                     width: width,
    //                     height: 32,
    //                     bgcolor: '#fff',
    //                     borderBottom: '1px solid #dde1e3',
    //                     borderRight: '1px solid #dde1e3',
    //                     cursor: 'pointer'
    //                 }} />
    //         </>
    //     )
    // }

    const tablFooter = () => {
        let res = [];
        for (let i = 0; i < header.length; i++) {
            if (header[i].hide || !header[i].allowed) continue;

            res.push(
                <Box key={i} sx={{ height: 34, width: header[i].width, }} />
            )
        }
        return res;
    }

    const downEvent = (e, i) => {
        setIndex(i)
        setXp(e.clientX - header[i].width)
    }

    const upEvent = () => {
        let row = header.map((e) => {
            let temp = e;
            delete temp.hide;
            return temp;
        })
        updateHeader({ row, hId })
        setIndex(-1)
        setXp(-1)
    }

    const addRow = async () => {
        let newRow = [];
        for (let i = 0; i < header.length; i++) {
            switch (header[i].type) {
                case 'text':
                case 'longText':
                case 'email':
                case 'date':
                case 'link':
                case 'select':
                case 'number':
                case 'createdAt':
                case 'updatedAt':
                case 'createdBy':
                case 'updatedBy':
                    newRow.push({ id: uuid(), data: '' });
                    break;
                case 'checkBox':
                    newRow.push({ id: uuid(), data: false });
                    break;
                case 'multiSelect':
                case 'attached':
                    newRow.push({ id: uuid(), data: [] });
                    break;
                default:
                    newRow.push({ id: uuid(), data: '' });
                    break;
            }
        }
        let rdata = await addTableRow(newRow, hId, user._id);
        changeBody([...body, { ...rdata.data, creator: user }]);
        document.getElementsByClassName('tableBody')[0].scroll({ top: (body.length + 3) * 32 - document.getElementsByClassName('tableBody')[0].clientHeight, behavior: 'smooth' });
    }

    const clearSelect = () => {
        selectEditable("");
        selectEditabled(editable);
        selectActive("");
    }

    const leftClick = (event, visible) => {
        if (event.target.contains) {
            const wasOutside = !(event.target === popup.current || event.target.parentElement === popup.current);
            if (wasOutside && visible) {
                setVisible(false);
                setOrder({ id: "", index: -1 })
            }
        }
    };

    const changeOrder = async (order, up) => {
        let data = await updateOrder({ ...order, up });
        if (data.status) {
            let t = { data: body };
            if (up) {
                let idx = t.data.findIndex(e => e.order === order.index - 1);
                t.data[idx].order++;
                idx = t.data.findIndex(e => e._id === order.id);
                t.data[idx].order--;
            } else {
                let idx = t.data.findIndex(e => e.order === order.index + 1);
                t.data[idx].order--;
                idx = t.data.findIndex(e => e._id === order.id);
                t.data[idx].order++;
            }
            changeBody(t.data);
        }
    }

    const deleteRow = async () => {
        let t = { data: body };
        t.data.sort((a, b) => a.order - b.order);
        let y = t.data.findIndex(e => e._id === order.id);
        let rdata = await Axios('POST', 'table/deleteRow', { data: t.data[y] });
        if (!rdata.status) {
            alert('server error!')
        } else {
            t.data.splice(y, 1);
            for (let i = y; i < t.data.length; i++) {
                t.data[i].order--;
            }
            changeBody(t.data);
        }
    }

    const copyRow = async (current) => {
        let rdata = await duplicateRow(current.id, user._id);
        if (rdata.status) {
            let t = { data: body };
            t.data.sort((a, b) => a.order - b.order);
            for (let i = current.index + 1; i < t.data.length; i++) {
                t.data[i].order++;
            }
            rdata.data.creator = user;
            rdata.data.updater = user;
            rdata.data.updatedAt = new Date();
            rdata.data.createdAt = new Date();
            t.data.splice(current.index + 1, 0, rdata.data);
            changeBody([...t.data])
        } else {
            alert('Server error!')
        }
    }

    /* eslint-disable */
    useEffect(() => {
        const handleMouseMove = (event) => {
            if (index > -1) {
                let nHeader = header;
                let dis = event.clientX - xP;

                if (dis > 130) {
                    nHeader[index].width = dis;
                    changeHeader(nHeader);
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener(
                'mousemove',
                handleMouseMove
            );
        };
    }, [index, xP]);

    useEffect(() => {
        const handleMouseUp = () => {
            if (index > -1 && xP > -1) {
                let row = header.map((e) => {
                    let temp = e;
                    delete temp.hide;
                    return temp;
                })
                updateHeader({ row, hId })
                setIndex(-1)
                setXp(-1)
            }
        };

        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener(
                'mouseup',
                handleMouseUp
            );
        };
    }, [xP, index, header]);

    useEffect(() => {
        window.addEventListener('click', (e) => leftClick(e, visible));
        return () => {
            window.removeEventListener('click', (e) => leftClick(e, visible));
        };
    }, [visible]);
    /* eslint-enable */

    return (
        <>
            <Box sx={{ height: '200%', position: 'sticky', left: allCheckWidth - 1, width: '6px', bgcolor: '#99999917', zIndex: 99, top: 0 }} >
                <Box sx={{ height: '100%', width: '1px', bgcolor: '#dde1e3' }} />
            </Box>
            <Box sx={{ position: 'absolute', right: 0, width: mainW, left: 0, overflow: 'visible', top: 0, bottom: 0 }}>
                <Box sx={{ height: 32, top: 0, left: 0, right: 0, zIndex: 3, overflow: 'visible', bgcolor: '#f2f2f2', position: 'sticky', borderBottom: '1px solid #dde1e3' }}>
                    <Box sx={{ height: 32, position: 'relative' }}>
                        <Box sx={{ height: 32, display: 'flex' }}>
                            {
                                teableHeader()
                            }
                        </Box>
                    </Box>
                </Box>
                <Box className='tableBody' sx={{ top: 32, left: 0, right: 0, bottom: 0, zIndex: 0, position: "absolute", height: 'calc(100% - 67px)', }}>
                    <Box sx={{ position: "relative", }}>
                        {
                            (() => {
                                let data = body;
                                let width = 0, fixedW = checkWidth;
                                let completed = [], activeprojects = [];

                                for (let i = 0; i < header.length; i++) {
                                    if (header[i].hide || !header[i].allowed) continue;
                                    if (header[i].fixed) {
                                        fixedW += header[i].width;
                                    } else {
                                        width += header[i].width;
                                    }
                                }

                                for (let i = 0; i < data.length; i++) {
                                    if (data[i].done) {
                                        completed.push(data[i])
                                    } else {
                                        activeprojects.push(data[i])
                                    }
                                }

                                // completed.sort((a, b) => (new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()));

                                return (
                                    <>
                                        <Stack>
                                            <Stack direction='row' sx={{ height: 16 }} onClick={() => clearSelect()}>
                                                <Box sx={{ width: fixedW, height: '100%', position: 'sticky', left: 0, zIndex: 9, bgcolor: '#f7f7f7' }} />
                                            </Stack>
                                            <Box sx={{ display: 'flex' }}>
                                                <Box sx={{ width: 16, bgcolor: '#f7f7f7', zIndex: 9, position: 'sticky', left: 0 }} onClick={() => clearSelect()} />
                                                <Stack sx={{ zIndex: 9, position: 'sticky', left: 16, width: fixedW, border: '1px solid #dde1e3', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, '&:before': { content: `""`, height: 2, width: 10, bgcolor: '#f7f7f7', position: 'absolute', top: -1, left: -7 }, '&:after': { content: `""`, height: 2, width: 10, bgcolor: '#f7f7f7', position: 'absolute', bottom: -1, left: -7 } }}>
                                                    <Box sx={{ width: '100%', height: 47, bgcolor: '#fffafa', py: 1, px: 1, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, }} onClick={() => clearSelect()}>
                                                        <Typography sx={{ color: 'gray' }}>{`Active (${activeprojects.length})`}</Typography>
                                                    </Box>
                                                    {
                                                        activeprojects.map((item, idx) => <TableRow group={'active'} isFixed={true} row={item} y={idx} key={idx} popup={popup} visible={visible} setVisible={setVisible} setOrder={setOrder} />)
                                                    }
                                                </Stack>
                                                <Stack sx={{ width: width, borderTopRightRadius: 8, borderBottomRightRadius: 8, borderTop: '1px solid #dde1e3', borderBottom: '1px solid #dde1e3', }} >
                                                    <Box sx={{ bgcolor: '#fffafa', height: 47, py: 1, px: 1, borderTopRightRadius: 8, borderRight: '1px solid #dde1e3', borderBottomRightRadius: activeprojects.length ? 0 : 8, }} onClick={() => clearSelect()} />
                                                    {
                                                        activeprojects.map((item, idx) => <TableRow group={'active'} isFixed={false} row={item} y={idx} key={idx} popup={popup} visible={visible} setVisible={setVisible} setOrder={setOrder} />)
                                                    }
                                                </Stack>
                                            </Box>

                                            <Stack direction='row' sx={{ height: 16 }} onClick={() => clearSelect()}>
                                                <Box sx={{ width: fixedW, height: '100%', position: 'sticky', left: 0, zIndex: 9, bgcolor: '#f7f7f7' }} />
                                            </Stack>
                                            <Box sx={{ display: 'flex' }}>
                                                <Box sx={{ width: 16, bgcolor: '#f7f7f7', zIndex: 9, position: 'sticky', left: 0 }} onClick={() => clearSelect()} />
                                                <Stack sx={{ zIndex: 9, position: 'sticky', left: 16, width: fixedW, border: '1px solid #dde1e3', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, '&:before': { content: `""`, height: 2, width: 10, bgcolor: '#f7f7f7', position: 'absolute', top: -1, left: -7 }, '&:after': { content: `""`, height: 2, width: 10, bgcolor: '#f7f7f7', position: 'absolute', bottom: -1, left: -7 } }}>
                                                    <Box sx={{ width: '100%', height: 47, bgcolor: '#fffafa', py: 1, px: 1, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, }} onClick={() => clearSelect()}>
                                                        <Typography sx={{ color: 'gray' }}>{`Completed (${completed.length})`}</Typography>
                                                    </Box>
                                                    {
                                                        completed.map((item, idx) => <TableRow group={'completed'} isFixed={true} row={item} y={idx} key={idx} popup={popup} visible={visible} setVisible={setVisible} setOrder={setOrder} />)
                                                    }
                                                </Stack>
                                                <Stack sx={{ width: width, borderTopRightRadius: 8, borderBottomRightRadius: 8, borderTop: '1px solid #dde1e3', borderBottom: '1px solid #dde1e3', }} >
                                                    <Box sx={{ bgcolor: '#fffafa', height: 47, py: 1, px: 1, borderTopRightRadius: 8, borderRight: '1px solid #dde1e3', borderBottomRightRadius: completed.length ? 0 : 8, }} onClick={() => clearSelect()} />
                                                    {
                                                        completed.map((item, idx) => <TableRow group={'completed'} isFixed={false} row={item} y={idx} key={idx} popup={popup} visible={visible} setVisible={setVisible} setOrder={setOrder} />)
                                                    }
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </>
                                )
                            })()
                        }
                    </Box>
                    {/* <Box sx={{ width: '100%', minHeight: '100% - 160PX' }} onClick={() => clearSelect()} /> */}
                </Box>
                <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 3, bgcolor: '#ffffff', borderTop: '1px solid #dde1e3', }} >
                    <Box sx={{ height: 35, display: 'flex' }}>
                        <Box sx={{ width: 66, bgcolor: '#ffffff80', borderTop: '1px solid #dde1e3', }}>
                            <Box sx={{ top: 0, left: 0, height: 34, overflow: 'visible', position: 'absolute', }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Stack direction='row' sx={{ position: 'absolute', zIndex: 1, height: 24, left: 0, top: 0 }} >
                                        {
                                            (Boolean(header.filter((e) => e.allowed).length)) && (user.role !== "Developer") &&
                                            <Stack direction='row' sx={{ position: 'relative', pl: 1, flex: '1 1 auto', bottom: 16, }} >
                                                <IconButton onClick={() => addRow()} sx={{ position: 'relative', height: 36, width: 36, borderRadius: 50, border: '1px solid #0000001a', bgcolor: '#fff', p: 1, '&:hover': { bgcolor: '#fff' } }}>
                                                    <AddIcon />
                                                </IconButton>
                                            </Stack>
                                        }
                                        <Box sx={{
                                            px: 1, pt: '3px', pb: '2px', fontSize: 11, width: 'auto', overflow: 'hidden', position: 'static', bgcolor: '#fbfbfb', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                        }}>
                                            {`${body.length} records`}
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>
                        {tablFooter()}
                    </Box>
                </Box>
                <AddColumn />
            </Box>
            <Box ref={popup} sx={{ py: 2, position: 'absolute', display: visible ? 'block' : 'none', zIndex: visible ? 1200 : 0, bgcolor: '#fff', borderRadius: 1, boxShadow: '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)' }}>
                <Stack spacing={.5} sx={{ minWidth: 200 }}>
                    <Button disabled={order.index <= 0} onClick={() => changeOrder(order, true)} startIcon={<NorthIcon sx={{ fontSize: 15 }} />} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize', borderRadius: 0, pl: 2 }}>Move Up</Button>
                    <Button disabled={(isFilter ? filterBody : body).length - 1 <= order.index} onClick={() => changeOrder(order, false)} startIcon={<SouthIcon sx={{ fontSize: 15 }} />} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize', borderRadius: 0, pl: 2 }}>Move Down</Button>
                    <Divider />
                    <Button startIcon={<ContentCopyIcon sx={{ fontSize: 15 }} />} onClick={() => copyRow(order)} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize', borderRadius: 0, pl: 2 }}>Duplicate Row</Button>
                    {
                        isAdmin &&
                        <>
                            <Divider />
                            <Button startIcon={<DeleteIcon />} onClick={deleteRow} sx={{ color: '#4d4d4d', justifyContent: 'flex-start', textTransform: 'capitalize', borderRadius: 0, pl: 2 }}>Delete Row</Button>
                        </>
                    }
                </Stack>
            </Box>
        </>
    )
}

export default GridBody;