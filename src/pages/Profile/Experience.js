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
import { getExperience, createExperience, updateExperience, deleteExperience } from '../../utilis/request';
import useConfig from '../../hooks/useConfig';

const Experience = () => {
    const { user } = useConfig();
    const [isUpdate, setIsUpdate] = useState("");
    const [rows, setRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [values, setValues] = useState({
        company: "",
        role: "",
        start: "",
        end: "",
        check: false,
        error: ""
    });

    const { company, role, start, end, check, error } = values;

    const handleValue = (data) => {
        setValues(pre => ({ ...pre, ...data }))
    }

    const clearValue = () => {
        setValues({
            company: "",
            role: "",
            start: "",
            end: "",
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
        if (company && role && start && end) {
            const data = await createExperience({ company, role, start, end, owner: user._id })
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
        if (company && role && start && end && isUpdate) {
            const data = await updateExperience({ company, role, start, end, id: isUpdate })
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
        const data = await deleteExperience(id)
        if (data.status) {
            setRows(pre => pre.filter((e) => e._id !== id))
        } else {
            toast.error(data.message)
        }
    }

    const editModal = (row) => {
        handleValue({ company: row.company, role: row.role, start: row.start, end: row.end })
        setIsUpdate(row._id)
        setModal(true)
    }

    const getData = useCallback(async () => {
        const data = await getExperience(user._id)
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
                    <Typography variant='h6'>Experience</Typography>
                    <Button variant='contained' endIcon={<AddIcon />} onClick={openModal}>Add</Button>
                </Stack>
                <Table sx={{ minWidth: 700, borderRadius: 1, overflow: "hidden" }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>No</StyledTableCell>
                            <StyledTableCell align='center'>Company</StyledTableCell>
                            <StyledTableCell align='center'>Role</StyledTableCell>
                            <StyledTableCell align='center'>Start Date</StyledTableCell>
                            <StyledTableCell align='center'>End Date</StyledTableCell>
                            <StyledTableCell align='center'>Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) => (
                            <StyledTableRow key={i}>
                                <StyledTableCell component="th" scope="row" align='center'>{i + 1}</StyledTableCell>
                                <StyledTableCell align='center'>{row.company}</StyledTableCell>
                                <StyledTableCell align='center'>{row.role}</StyledTableCell>
                                <StyledTableCell align='center'>{row.start ? moment(row.start).format("MM/DD/yyyy") : ""}</StyledTableCell>
                                <StyledTableCell align='center'>{row.end ? moment(row.end).format("MM/DD/yyyy") : ""}</StyledTableCell>
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
                            `Update Experience` :
                            `Add New Experience`
                    }
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        <TextField value={company} error={check && !company} onChange={(e) => handleValue({ company: e.target.value })} label='Company' sx={{ width: 500 }} />
                        <TextField value={role} error={check && !role} onChange={(e) => handleValue({ role: e.target.value })} label='Role' />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={start}
                                onChange={(newValue) => {
                                    handleValue({ start: newValue });
                                }}
                                renderInput={(params) => <TextField {...params} error={check && !start} label="Start Date" />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={end}
                                onChange={(newValue) => {
                                    handleValue({ end: newValue });
                                }}
                                renderInput={(params) => <TextField {...params} error={check && !end} label="End Date" />}
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