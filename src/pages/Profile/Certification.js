import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment'

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import LoadingButton from '@mui/lab/LoadingButton';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { StyledTableCell, StyledTableRow } from './tableComponent';
import { getCertification, createCertification, deleteCertification, updateCertification } from '../../utilis/request';
import useConfig from '../../hooks/useConfig';
import { certificationUrl, fileTypes } from '../../config/constant';
import { getImg } from '../../utilis/util';
import ImageModal from '../../components/ImageModal';

const Experience = () => {
    const { user } = useConfig();
    const [open, setOpen] = useState(false);
    const [viewFile, setViewFile] = useState();
    const [doc, setDoc] = useState({});
    const [isUpdate, setIsUpdate] = useState("");
    const [rows, setRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState({
        file: {},
        company: "",
        type: "",
        date: "",
        expiry: "",
        check: false,
        error: ""
    });

    const { company, type, date, expiry, check, error } = values;

    const handleValue = (data) => {
        setValues(pre => ({ ...pre, ...data }))
    }

    const clearValue = () => {
        setValues({
            company: "",
            file: {},
            date: "",
            type: "",
            expiry: "",
            check: false,
            error: ""
        })
    }

    const openModal = () => {
        setModal(true);
        setIsUpdate("");
    }

    const closeModal = () => {
        setModal(false)
        clearValue()
    }

    const fileViewer = (row) => {
        setViewFile(row.file)
        setOpen(true)
    }

    const closeView = () => {
        setOpen(false);
    }

    const create = async () => {
        handleValue({ check: true })
        if (company && type && date && expiry && doc.name) {
            let form = new FormData();
            form.append('file', doc)
            form.append('company', company)
            form.append('type', type)
            form.append('date', date)
            form.append('expiry', expiry)
            form.append('owner', user._id)
            console.log(form)
            const data = await createCertification(form)
            if (data.status) {
                setRows(pre => [...pre, data.data])
                clearValue()
                setDoc({})
                closeModal()
            } else {
                toast.error(data.message)
            }
        }
    }

    const udpate = async () => {
        handleValue({ check: true })
        if (company && type && date && expiry) {
            let form = new FormData();
            if (doc.name) {
                form.append('file', doc)
            }
            form.append('id', isUpdate)
            form.append('company', company)
            form.append('type', type)
            form.append('date', date)
            form.append('expiry', expiry)

            const data = await updateCertification(form)
            if (data.status) {
                setRows(pre => pre.map((e) => {
                    if (e._id === isUpdate) return data.data
                    else return e;
                }))
                clearValue()
                setDoc({})
                closeModal()
            } else {
                toast.error(data.message)
            }
        }
    }

    const deleteRow = async (id) => {
        const data = await deleteCertification(id)
        if (data.status) {
            setRows(pre => pre.filter((e) => e._id !== id))
        } else {
            toast.error(data.message)
        }
    }

    const editModal = (row) => {
        handleValue({ company: row.company, file: row.file, date: row.date, expiry: row.expiry, type: row.type })
        setIsUpdate(row._id)
        setModal(true)
    }

    const chooseFile = async (e) => {
        e.preventDefault()
        e.target.blur();
        let file = e.target.files[0];
        let type = file.type.split('/')[1]
        if (!type) type = file.name.split('.').pop();
        if (fileTypes.includes(type)) {
            setDoc(file)
            handleValue({ error: "" })
        } else {
            handleValue({ error: "Please choose valid file" })
        }
    }

    const getData = useCallback(async () => {
        const data = await getCertification(user._id)
        if (data.status) {
            setRows(data.data)
        } else {
            toast.error("Getting experience data is failed")
        }
    }, [user._id])

    useEffect(() => {
        getData()
    }, [getData]);

    return (
        <>
            <Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant='h6'>Certification</Typography>
                    <Button variant='contained' endIcon={<AddIcon />} onClick={openModal}>Add</Button>
                </Stack>
                <Table sx={{ minWidth: 700, borderRadius: 1, overflow: "hidden" }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>No</StyledTableCell>
                            <StyledTableCell align='center'></StyledTableCell>
                            <StyledTableCell align='center'>Document Type</StyledTableCell>
                            <StyledTableCell align='center'>Issuing company</StyledTableCell>
                            <StyledTableCell align='center'>Date of issue</StyledTableCell>
                            <StyledTableCell align='center'>Date of expiry</StyledTableCell>
                            <StyledTableCell align='center'>Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) => (
                            <StyledTableRow key={i}>
                                <StyledTableCell component="th" scope="row" align='center'>{i + 1}</StyledTableCell>
                                <StyledTableCell align='center' onClick={() => fileViewer(row)}>
                                    {
                                        (() => {
                                            const type = row.file.mimetype.split('/')[0];
                                            if (type === 'image') {
                                                return <Box component="img" src={`${certificationUrl}${row.file.filename}`} sx={{ height: 32 }} />
                                            } else {
                                                return <Box component="img" src={getImg(row.file)} sx={{ height: 32 }} />
                                            }
                                        })()
                                    }
                                </StyledTableCell>
                                <StyledTableCell align='center'>{row.type}</StyledTableCell>
                                <StyledTableCell align='center'>{row.company}</StyledTableCell>
                                <StyledTableCell align='center'>{row.date ? moment(row.date).format("MM/DD/yyyy") : ""}</StyledTableCell>
                                <StyledTableCell align='center'>{row.expiry ? moment(row.expiry).format("MM/DD/yyyy") : ""}</StyledTableCell>
                                <StyledTableCell align='center'>
                                    <IconButton onClick={() => editModal(row)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => deleteRow(row._id)}><DeleteIcon /></IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </Stack>
            <ImageModal open={open} close={closeView} data={viewFile ? [viewFile] : []} index={0} isProfile={true} />
            <Dialog open={modal} onClose={closeModal} >
                <DialogTitle>
                    {
                        isUpdate ?
                            `Update Certification` :
                            `Add New Certification`
                    }
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        <TextField value={type} error={check && !type} onChange={(e) => handleValue({ type: e.target.value })} label='Document Type' sx={{ width: 500 }} />
                        <TextField value={company} error={check && !company} onChange={(e) => handleValue({ company: e.target.value })} label='Issuing company	' />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={date}
                                onChange={(newValue) => {
                                    handleValue({ date: newValue });
                                }}
                                renderInput={(params) => <TextField {...params} error={check && !date} label="Date of issue" />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={expiry}
                                onChange={(newValue) => {
                                    handleValue({ expiry: newValue });
                                }}
                                renderInput={(params) => <TextField {...params} error={check && !expiry} label="Date of expiry" />}
                            />
                        </LocalizationProvider>
                        <Button startIcon={<AttachFileIcon />} variant="contained" color="secondary" sx={check && !isUpdate && !doc.name ? { border: "3px solid white", boxShadow: "0 0 6px 1px red" } : {}} component="label">
                            {doc.name ?? "Choose file"}
                            <input hidden type="file" onChange={chooseFile} />
                        </Button>
                        {
                            error ?
                                <Box sx={{ my: 1, bgcolor: '#ff4c4c', borderRadius: 1, p: 1 }} >
                                    <Typography variant='h7' sx={{ color: '#fff' }}>{error}</Typography>
                                </Box>
                                : null
                        }
                    </Stack>
                    <Stack direction='row' justifyContent='flex-end' sx={{ pt: 2 }}>
                        <Button variant='contained' color='error' sx={{ mr: 1 }} onClick={closeModal}>Cancel</Button>
                        {
                            isUpdate ?
                                <Button variant='contained' color='secondary' onClick={udpate}>
                                    update
                                </Button> :
                                <LoadingButton variant='contained' color='info' onClick={create}>
                                    Add
                                </LoadingButton>
                        }
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Experience;