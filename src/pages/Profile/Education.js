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

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { StyledTableCell, StyledTableRow } from './tableComponent';
import { getEducation, createEducation, updateEducation, deleteEducation } from '../../utilis/request';
import useConfig from '../../hooks/useConfig';

const Experience = () => {
    const { user } = useConfig();
    const [isUpdate, setIsUpdate] = useState("");
    const [rows, setRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState({
        university: "",
        from: "",
        to: "",
        degree: "",
        area: "",
        check: false,
        error: ""
    });

    const { university, degree, from, to, area, check, error } = values;

    const handleValue = (data) => {
        setValues(pre => ({ ...pre, ...data }))
    }

    const clearValue = () => {
        setValues({
            university: "",
            from: "",
            to: "",
            degree: "",
            area: "",
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
    }

    const create = async () => {
        handleValue({ check: true })
        if (university && degree && from && to && area) {
            const data = await createEducation({ university, degree, from, to, area, owner: user._id })
            if (data.status) {
                setRows(pre => [...pre, data.data])
                clearValue()
                closeModal()
            } else {
                toast.error(data.message)
            }
        }
    }

    const udpate = async () => {
        handleValue({ check: true })
        if (university && degree && from && to && area && isUpdate) {
            const data = await updateEducation({ university, degree, from, to, area, id: isUpdate })
            if (data.status) {
                setRows(pre => pre.map((e) => {
                    if (e._id === isUpdate) return data.data
                    else return e;
                }))
                clearValue()
                closeModal()
            } else {
                toast.error(data.message)
            }
        }
    }

    const deleteRow = async (id) => {
        const data = await deleteEducation(id)
        if (data.status) {
            setRows(pre => pre.filter((e) => e._id !== id))
        } else {
            toast.error(data.message)
        }
    }

    const editModal = (row) => {
        handleValue({ university: row.university, degree: row.degree, from: row.from, to: row.to, area: row.area })
        setIsUpdate(row._id)
        setModal(true)
    }

    const getData = useCallback(async () => {
        const data = await getEducation(user._id)
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
                    <Typography variant='h6'>Education</Typography>
                    <Button variant='contained' endIcon={<AddIcon />} onClick={openModal}>Add</Button>
                </Stack>
                <Table sx={{ minWidth: 700, borderRadius: 1, overflow: "hidden" }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>No</StyledTableCell>
                            <StyledTableCell align='center'>University</StyledTableCell>
                            <StyledTableCell align='center'>From</StyledTableCell>
                            <StyledTableCell align='center'>To</StyledTableCell>
                            <StyledTableCell align='center'>Degree</StyledTableCell>
                            <StyledTableCell align='center'>Area of study</StyledTableCell>
                            <StyledTableCell align='center'>Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) => (
                            <StyledTableRow key={i}>
                                <StyledTableCell component="th" scope="row" align='center'>{i + 1}</StyledTableCell>
                                <StyledTableCell align='center'>{row.university}</StyledTableCell>
                                <StyledTableCell align='center'>{row.from ? moment(row.from).format("MM/DD/yyyy") : ""}</StyledTableCell>
                                <StyledTableCell align='center'>{row.to ? moment(row.to).format("MM/DD/yyyy") : ""}</StyledTableCell>
                                <StyledTableCell align='center'>{row.degree}</StyledTableCell>
                                <StyledTableCell align='center'>{row.area}</StyledTableCell>
                                <StyledTableCell align='center'>
                                    <IconButton onClick={() => editModal(row)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => deleteRow(row._id)}><DeleteIcon /></IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </Stack>

            <Dialog open={modal} onClose={closeModal} >
                <DialogTitle>
                    {
                        isUpdate ?
                            `Update Education` :
                            `Add New Education`
                    }
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        <TextField value={university} error={check && !university} onChange={(e) => handleValue({ university: e.target.value })} label='University' sx={{ width: 500 }} />
                        <TextField value={degree} error={check && !degree} onChange={(e) => handleValue({ degree: e.target.value })} label='Degree' />
                        <TextField value={area} error={check && !area} onChange={(e) => handleValue({ area: e.target.value })} label='Aare of study' />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={from}
                                onChange={(newValue) => {
                                    handleValue({ from: newValue });
                                }}
                                renderInput={(params) => <TextField {...params} error={check && !from} label="Start Date" />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={to}
                                onChange={(newValue) => {
                                    handleValue({ to: newValue });
                                }}
                                renderInput={(params) => <TextField {...params} error={check && !to} label="End Date" />}
                            />
                        </LocalizationProvider>
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
                                <Button variant='contained' color='info' onClick={create}>
                                    Add
                                </Button>
                        }
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Experience;