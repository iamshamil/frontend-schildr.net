import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import CreateModal from './CreateModal';
import UpdateModal from './UpdateModal';

import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { deleteInvoice, getInvoice } from '../../utilis/request';
import { avatarUrl } from '../../config/constant';
import moment from 'moment';

const Invoice = () => {
    const [createOpen, setCreateOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [isUpdate, setIsUpdate] = useState();

    const openCreateModal = () => {
        setCreateOpen(true)
    }
    const closeCreateModal = () => {
        setCreateOpen(false)
    }

    const closeUpdateModal = () => {
        setUpdateOpen(false);
        setIsUpdate(null)
    }


    const removeInvoice = async (id) => {
        const data = await deleteInvoice(id)
        if (data) {
            setInvoices(pre => pre.filter((e) => e._id !== id))
        } else {
            toast.error(data.message)
        }
    }

    const readyEdit = (one) => {
        setIsUpdate(one);
        setUpdateOpen(true);
    }


    const initData = async () => {
        const data = await getInvoice();
        if (data.status) {
            setInvoices(data.data);
        } else {
            toast.error(data.message)
        }
    }

    useEffect(() => {
        initData();
    }, []);

    return (
        <>
            <Box sx={{ bgcolor: '#f5f5f5', height: '100%', overflow: "auto", py: 4 }}>
                <Container maxWidth="lg">
                    <Typography variant='h5' sx={{ fontWeight: "600", mb: 3 }}>Invoices</Typography>
                    <TableContainer component={Card} sx={{ p: 4, borderRadius: 4 }}>
                        <Button variant='contained' color='info' onClick={openCreateModal} startIcon={<PlaylistAddIcon sx={{ fontSize: 15 }} />} sx={{ ml: 'auto', textTransform: 'capitalize' }} >Create</Button>

                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ p: 2, fontSize: 13 }} align='center'>No</TableCell>
                                    <TableCell sx={{ p: 2, fontSize: 13 }} align='center'>Invoic ID</TableCell>
                                    <TableCell sx={{ p: 2, fontSize: 13 }} align='center'>Client</TableCell>
                                    <TableCell sx={{ p: 2, fontSize: 13 }} align='center'>Amount</TableCell>
                                    <TableCell sx={{ p: 2, fontSize: 13 }} align='center'>Create</TableCell>
                                    <TableCell sx={{ p: 2, fontSize: 13 }} align='center'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    invoices.map((one, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ py: 1, px: 2, fontSize: 13 }} align='center'>{i + 1}</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontSize: 13 }} align='center'>{`INV-${one.invoiceId}`}</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontSize: 13 }} align='center'>
                                                <Stack direction="row" alignItems="center" justifyContent='center'>
                                                    <Avatar src={one.toUser.avatar ? `${avatarUrl}${one.toUser.avatar}` : ""} sx={{ mr: 2, textTransform: 'uppercase', bgcolor: one.toUser.color, width: 40, height: 40, border: '1px solid #dddddd', color: '#000', }}>{one.toUser.firstName ? one.toUser.firstName[0] : 'C'}</Avatar>
                                                    <Stack>
                                                        <Typography>{one.toUser.firstName}</Typography>
                                                        <Typography>{one.toUser.lastName}</Typography>
                                                    </Stack>
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontSize: 13 }} align='center'>
                                                {
                                                    (() => {
                                                        const total = one.details.reduce((f, s) => f + s.total, 0);
                                                        if (total) return `$${total}`;
                                                        else return '-'
                                                    })()
                                                }
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontSize: 13 }} align='center'>
                                                {moment(one.createDate).format("DD MMMM, yyyy")}
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontSize: 13 }} align='center'>
                                                <Stack direction='row' spacing={1} justifyContent='center' sx={{ width: "100%" }}>
                                                    <IconButton sx={{ width: 26, height: 26, }} component='a' href={`https://oawo.us/invoice/${one._id}`} ><RemoveRedEyeIcon sx={{ fontSize: 16 }} /></IconButton>
                                                    <IconButton sx={{ width: 26, height: 26, }} onClick={() => readyEdit(one)} ><BorderColorIcon sx={{ fontSize: 16 }} /></IconButton>
                                                    <IconButton sx={{ width: 26, height: 26, }} onClick={() => removeInvoice(one._id)} ><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
            {
                createOpen &&
                <CreateModal open={createOpen} setInvoices={setInvoices} closeCreateModal={closeCreateModal} />
            }
            {
                updateOpen &&
                <UpdateModal open={updateOpen} setInvoices={setInvoices} closeUpdateModal={closeUpdateModal} data={isUpdate} />
            }
        </>
    )
}


export default Invoice;