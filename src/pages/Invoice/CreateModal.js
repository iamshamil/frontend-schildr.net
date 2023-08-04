import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import CloseIcon from '@mui/icons-material/Close';
import useConfig from '../../hooks/useConfig';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { getClient, createInvoice } from '../../utilis/request';
import { toast } from 'react-toastify';
const staticType = [
    {
        value: 1,
        label: "One time"
    },
    {
        value: 2,
        label: "Monthly"
    },
    {
        value: 3,
        label: "Yearly"
    },
]

const CreateModal = ({ open, closeCreateModal, setInvoices }) => {
    const { user } = useConfig();
    const [anchorEl, setAnchorEl] = useState(null);
    const [check, setCheck] = useState(false);
    const [clients, setClients] = useState([]);
    const [receiver, setReceiver] = useState();
    const [details, setdetails] = useState([
        {
            title: "",
            description: "",
            quantity: 1,
            price: 0,
            total: 0,
            type: 1,
        }
    ]);
    const [invoice, setInvoice] = useState({
        createDate: new Date()
    });
    const openPopover = Boolean(anchorEl);

    const closePopover = () => {
        setAnchorEl(null)
    }

    const showPopover = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const selectReceiver = (user) => {
        setReceiver(user)
        setAnchorEl(null)
    }

    const addDetail = () => {
        setdetails((pre) => [...pre, {
            title: "",
            description: "",
            quantity: 1,
            price: 0,
            total: 0,
            type: 1,
        }])
    }

    const updateDetail = (i, data) => {
        setdetails((pre) => pre.map((one, idx) => {
            if (i === idx) {
                one = { ...one, ...data }
            }
            return one;
        }))
    }

    const removeDetail = (i) => {
        setdetails((pre) => pre.filter((_, idx) => idx !== i))
    }

    const saveInvoice = async () => {
        setCheck(true);
        if (!receiver) return;
        for (const item of details) {
            if (!item.title || !item.description || !item.price) return;
        }
        const invoiceData = {
            fromUser: user._id,
            toUser: receiver._id,
            ...invoice,
            details
        }
        const rdata = await createInvoice(invoiceData);
        if (rdata.status) {
            setInvoices(pre => [...pre, rdata.data]);
            closeCreateModal();
        } else {
            toast.error(rdata.message)
        }
    }


    const initData = async () => {
        const data = await getClient();
        if (data.status) {
            setClients(data.data)
        } else {
            toast.error("Gettig clients list error!")
        }
    }

    useEffect(() => {
        if (open)
            initData()
    }, [open])

    return (
        <>
            <Dialog
                open={open}
                maxWidth="lg"
                sx={{ '& .MuiDialog-paper': { width: '100%' } }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #bdbdbd' }}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography>Create Invoice</Typography>
                        <Stack direction='row' alignItems='center'>
                            <IconButton onClick={closeCreateModal} >
                                <CloseIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <Stack direction="row" sx={{ py: 2, px: 4 }}>
                        <Stack sx={{ width: "50%", px: 3, borderRight: "1px dashed #0000003b" }} spacing={1}>
                            <Typography variant='h6' sx={{ opacity: .6, fontWeight: 600 }}>From:</Typography>
                            <Typography>{`${user.firstName} ${user.lastName}`}</Typography>
                            <Typography>Phone: {user.phoneNumber ?? "No phone"}</Typography>
                        </Stack>
                        <Stack sx={{ width: "50%", px: 3, }} spacing={1}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
                                <Typography variant='h6' sx={{ opacity: .6, fontWeight: 600 }}>To:</Typography>
                                <Button onClick={showPopover} color='success' size="small" startIcon={receiver ? <EditIcon /> : <AddIcon />} sx={{ fontWeight: 600 }} >{receiver ? "Change" : "Add"}</Button>
                            </Stack>
                            {
                                (() => {
                                    if (receiver) {
                                        return (
                                            <>
                                                <Typography>{`${receiver.firstName} ${receiver.lastName}`}</Typography>
                                                <Typography>Phone: {receiver.phoneNumber ?? "No phone"}</Typography>
                                            </>
                                        )
                                    } else if (!receiver && check) {
                                        return <Typography sx={{ color: (theme) => theme.palette.error.light }}>Invoice to is required</Typography>
                                    } else {
                                        return null;
                                    }
                                })()
                            }
                        </Stack>
                    </Stack>
                    <Stack direction='row' sx={{ p: 2, px: 4, bgcolor: "#f4f6f8" }} spacing={2}>
                        {/* <TextField disabled value="INV-1524987" label='Invoice number' sx={{ width: "calc((100% - 16px) /3 )" }} /> */}
                        {/* <TextField
                            select
                            label="Invoice Type"
                            value={invoice.type}
                            onChange={(e) => setInvoice(pre => ({ ...pre, type: e.target.value }))}
                            sx={{ width: "50%" }}
                        >
                            {staticType.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField> */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={invoice.createDate}
                                onChange={(newValue) => {
                                    setInvoice(pre => ({ ...pre, createDate: newValue }));
                                }}
                                renderInput={(params) => <TextField {...params} label="Date Create" sx={{ width: "50%" }} />}
                            />
                        </LocalizationProvider>
                    </Stack>
                    <Stack sx={{ py: 2, px: 4 }}>
                        <Typography variant='h6' sx={{ opacity: .6, fontWeight: 600, mb: 2 }}>Details:</Typography>
                        {
                            details.map(({ title, description, quantity, price, total, type }, i) => (
                                <Stack key={i} sx={{ pt: 3, pb: 1, borderBottom: "1px dashed #0000003b" }}>
                                    <Stack direction='row' spacing={2}>
                                        <TextField
                                            size='small'
                                            label="Product/Service"
                                            sx={{ width: "calc((100% - 100px * 3 - 150px - 16px * 4) / 2)" }}
                                            value={title}
                                            error={check && !title}
                                            onChange={(e) => updateDetail(i, { title: e.target.value })}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                                            }} />
                                        <TextField
                                            size='small'
                                            label="Description"
                                            onChange={(e) => updateDetail(i, { description: e.target.value })}
                                            value={description}
                                            error={check && !description}
                                            sx={{ width: "calc((100% - 100px * 3 - 150px - 16px * 4) / 2)" }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                                            }} />
                                        <TextField
                                            size='small'
                                            label="Quantity"
                                            type='number'
                                            onChange={(e) => updateDetail(i, { quantity: e.target.value, total: price * e.target.value })}
                                            value={quantity}
                                            sx={{ width: 100 }}
                                            error={check && !quantity}
                                            inputProps={{ min: 1 }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                                            }} />
                                        <TextField
                                            size='small'
                                            label="Price"
                                            type='number'
                                            onChange={(e) => updateDetail(i, { price: e.target.value, total: quantity * e.target.value })}
                                            value={price}
                                            error={check && !price}
                                            sx={{ width: 100 }}
                                            inputProps={{ min: 0 }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }} />
                                        <TextField
                                            disabled
                                            size='small'
                                            label="Total"
                                            type='number'
                                            value={total}
                                            sx={{ width: 100 }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }} />
                                        <TextField
                                            select
                                            size='small'
                                            label="Invoice Type"
                                            value={type}
                                            onChange={(e) => updateDetail(i, { type: e.target.value })}
                                            sx={{ width: 150 }}
                                        >
                                            {staticType.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                    <Box sx={{ mt: 1, textAlign: "right" }}>
                                        <Button color='error' onClick={() => removeDetail(i)} startIcon={<DeleteIcon />}>Remove</Button>
                                    </Box>
                                </Stack>
                            ))
                        }
                    </Stack>
                    <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ py: 2, px: 4 }} >
                        <Button color='success' size="small" onClick={addDetail} startIcon={<AddIcon />} sx={{ fontSize: 16, fontWeight: 600 }} >Add Item</Button>
                        <Stack direction="row" alignItems='center'>
                            <Typography><b>Total:</b></Typography>
                            <Typography sx={{ width: 120, textAlign: 'right' }}><b>
                                {
                                    (() => {
                                        const total = details.reduce((f, s) => f + s.total, 0);
                                        if (total) return total;
                                        else return '-'
                                    })()
                                }
                            </b></Typography>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 3, borderTop: '1px solid #bdbdbd' }}>
                    <Button variant='outlined' sx={{ fontSize: 16, fontWeight: 600 }} onClick={closeCreateModal} >Cancel</Button>
                    <Button variant='contained' color='success' sx={{ fontSize: 16, fontWeight: 600 }} onClick={saveInvoice}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog >
            <Popover
                anchorEl={anchorEl}
                open={openPopover}
                onClose={closePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Stack spacing={1}>
                    {
                        clients.length ? clients.map(({ firstName, lastName, phoneNumber, _id }) => (
                            <MenuItem key={_id} onClick={() => selectReceiver({ firstName, lastName, phoneNumber, _id })}>
                                <Typography>{`${firstName} ${lastName}`}</Typography>
                                <Typography>{phoneNumber}</Typography>
                            </MenuItem>
                        )) :
                            <MenuItem onClick={closePopover}>
                                <Typography sx={{ opacity: 0.5 }}><i>There isn't client</i></Typography>
                            </MenuItem>
                    }
                </Stack>
            </Popover>
        </>
    )
}


export default CreateModal;