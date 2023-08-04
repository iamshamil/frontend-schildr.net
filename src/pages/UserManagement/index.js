import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import { MuiColorInput } from 'mui-color-input';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { roles } from '../../config/constant';
import { getColor } from '../../utilis/util';

import Certification from './Certification';

import useConfig from '../../hooks/useConfig';
import useTableContext from '../../hooks/useTable';
import { getUsers, updateUser, setPassword, createUser, deleteUser } from '../../utilis/request';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const UserManagement = () => {
    const navigate = useNavigate();
    const { user, setUser } = useConfig();
    const { isAdmin } = useTableContext();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [register, setRegister] = useState(false);
    const [userModal, setUserModal] = useState(false);
    const [select, setSelect] = useState("");
    const [checked, setChecked] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [openCertificate, setOpenCertificate] = useState(false);
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        position: '',
        password: '',
        confirm: '',
        passError: '',
        color: '',
        error: '',
        role: "",
        skills: "",
        description: '',
        errorArray: []
    });
    const { firstName, lastName, email, department, position, role, error, password, color, confirm, passError, errorArray, description, skills } = values;

    const handleValues = (data) => {
        setValues({ ...values, ...data })
    }

    const handleRegisterModal = () => {
        handleValues({ firstName: '', lastName: '', email: '', department: '', position: '', role: "", password: '', error: '', color: '', description: '' })
        setRegister(true)
    }

    const cancelCreate = () => {
        handleValues({ firstName: '', lastName: '', email: '', department: '', position: '', role: "", password: '', error: '', color: '', description: '' })
        setRegister(false)
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        handleValues({ role: value });
    };

    const createAccount = async () => {
        handleValues({ errorArray: [] })
        if (!firstName) {
            handleValues({ error: 'Please input first name' })
            return
        } else if (!lastName) {
            handleValues({ error: 'Please input last name' })
            return
        } else if (!email) {
            handleValues({ error: 'Please input email' })
            return
        } else if (!role) {
            handleValues({ error: 'Please input role' })
            return
        } else if (!password) {
            handleValues({ error: 'Please input password' })
            return
        } else {
            handleValues({ error: '' })
        }
        let rdata = await createUser({ id: select, data: { firstName, lastName, email, role, password, color, description } });
        if (rdata.status) {
            setUsers([...users, rdata.data]);
            handleValues({ firstName: '', lastName: '', email: '', department: '', position: '', role: "", password: '', error: '', color: '', description: '' })
            setRegister(false)
        } else {
            if (rdata.message) {
                handleValues({ errorArray: rdata.data })
            }
        }
    }

    const deleteAccount = async (id) => {
        let rdata = await deleteUser(id);
        if (rdata.status) {
            handleValues({ firstName: '', lastName: '', email: '', department: '', position: '', role: "", password: '', error: '', color: '', description: '' })
            closeModal(false);
            const idx = users.findIndex(e => e._id === id);
            if (idx > -1) {
                let temp = users;
                temp.splice(idx, 1);
                setUsers([...temp]);
            }
        } else {
            handleValues({ error: rdata.message })
        }
    }

    const cancelCertification = () => {
        setOpenCertificate(false);
    }

    const closeRegister = () => {
        setRegister(false);
    }

    const closeModal = () => {
        setUserModal(false);
    }

    const update = async () => {
        if (!firstName) {
            handleValues({ error: 'Please input first name' })
            return
        } else if (!lastName) {
            handleValues({ error: 'Please input last name' })
            return
        } else if (!email) {
            handleValues({ error: 'Please input email' })
            return
        } else if (!role) {
            handleValues({ error: 'Please input role' })
            return
        } else {
            handleValues({ error: '' })
        }
        let rdata = await updateUser({ id: select, data: { firstName, lastName, email, role, color, description } });
        if (rdata.status) {
            closeModal(false);
            if (email === user.email) {
                setUser({ ...user, firstName, lastName, email, department, position, role, color, description });
            }
            setSelect('');
            let idx = users.findIndex((e) => e._id === select);
            if (idx > -1) {
                let temp = users[idx];
                temp = { ...temp, firstName, lastName, department, position, role, email, color, description };
                let tempUser = users;
                tempUser[idx] = temp;
                setUsers([...tempUser]);
            }
        } else {
            handleValues({ error: rdata.message })
        }
    }

    const updatePassword = async () => {
        if (!password) {
            handleValues({ passError: 'Please input password' })
            return
        } else if (!confirm || password !== confirm) {
            handleValues({ passError: 'Please input correct password in confirm field' });
            return;
        } else {
            handleValues({ passError: '' })
        }
        let rdata = await setPassword({ id: select, password });
        if (rdata.status) {
            setSelect('');
            handleValues({ password: '', confirm: '' })
        } else {
            handleValues({ passError: rdata.message })
        }
    }

    const openModal = (id) => {
        let i = users.findIndex((e) => e._id === id);
        setSelect(users[i]._id);
        setValues({ ...values, firstName: users[i].firstName, lastName: users[i].lastName, email: users[i].email, department: users[i].department, position: users[i].position, role: users[i].role, color: users[i].color, description: users[i].description, skills: users[i].skills })
        setUserModal(true);
    }

    const getData = useCallback(async () => {
        const rdata = await getUsers();
        if (rdata.status) {
            setUsers(rdata.data);
        } else {
            toast.error(rdata.message)
        }
    }, [setUsers]);

    const openCertificationModal = (user) => {
        setOpenCertificate(true);
        setSelectedUser(user)
    }

    useEffect(() => {
        if (!isAdmin) {
            navigate('/')
        } else {
            getData();
        }
        // eslint-disable-next-line
    }, [isAdmin]);

    return (
        <>
            <Box sx={{ bgcolor: '#f5f5f5', height: '100%', overflow: "auto", py: 4 }}>
                <Container maxWidth="lg">
                    <Typography variant='h5' sx={{ fontWeight: "600", mb: 3 }}>User Management</Typography>
                    <TableContainer component={Card} sx={{ p: 4, borderRadius: 4 }}>
                        <Stack direction='row' alignItems="center">
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Input
                                    size="small"
                                    placeholder='Search'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    }
                                />
                            </Box>
                            <Button variant='contained' color='info' onClick={handleRegisterModal} startIcon={<PersonAddIcon sx={{ fontSize: 15 }} />} sx={{ ml: 'auto', textTransform: 'capitalize' }} >Create Account</Button>
                        </Stack>

                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ p: 2, fontSize: 13 }} align='center'>No</TableCell>
                                    <TableCell sx={{ p: 2, fontSize: 13 }}></TableCell>
                                    <TableCell sx={{ p: 2, fontSize: 13 }}>First Name</TableCell>
                                    <TableCell sx={{ p: 2, fontSize: 13 }}>Last Name</TableCell>
                                    <TableCell sx={{ p: 2, fontSize: 13 }}>Email</TableCell>
                                    <TableCell sx={{ p: 2, fontSize: 13 }}>Role</TableCell>
                                    <TableCell sx={{ p: 2, fontSize: 13 }} align='center'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    (() => {
                                        console.log(search)
                                        let data = users
                                        if (search) {
                                            data = users.filter(({ firstName, lastName, email }) => `${firstName.toLocaleLowerCase()} ${lastName.toLocaleLowerCase()} ${email.toLocaleLowerCase()}`.includes(search.toLocaleLowerCase()))
                                        } else {
                                            data = users;
                                        }
                                        return data.map((row, i) => (
                                            <TableRow
                                                key={i}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell sx={{ py: 1, px: 2, fontSize: 13 }} align='center'> {i + 1}</TableCell>
                                                <TableCell sx={{ py: 1, px: 2, fontSize: 13 }} align='center'>
                                                    <Avatar sx={{ bgcolor: row.color ? row.color : '#999', textTransform: 'uppercase', width: 24, height: 24, fontSize: 12, color: getColor(row.color) }}>{row.firstName ? row.firstName[0] : 'C'}</Avatar>
                                                </TableCell>
                                                <TableCell sx={{ py: 1, px: 2, fontSize: 13 }} component="th" scope="row">
                                                    {row.firstName}
                                                </TableCell>
                                                <TableCell sx={{ py: 1, px: 2, fontSize: 13 }}>{row.lastName}</TableCell>
                                                <TableCell sx={{ py: 1, px: 2, fontSize: 13 }}>{row.email}</TableCell>
                                                <TableCell sx={{ py: 1, px: 2, fontSize: 13 }}>{row.role}</TableCell>
                                                <TableCell sx={{ py: 1, px: 2, fontSize: 13 }} align='center'>
                                                    <Stack direction='row' spacing={1} justifyContent='center' sx={{ width: "100%" }}>
                                                        <IconButton sx={{ width: 26, height: 26, }} onClick={() => openModal(row._id)}><BorderColorIcon sx={{ fontSize: 16 }} /></IconButton>
                                                        <IconButton sx={{ width: 26, height: 26, }} onClick={() => openCertificationModal(row)}><VerifiedUserIcon sx={{ fontSize: 16 }} /></IconButton>
                                                        <IconButton sx={{ width: 26, height: 26, }} onClick={() => deleteAccount(row._id)}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    })()
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box >
            <Dialog
                open={userModal}
                maxWidth="sm"
                sx={{ '& .MuiDialog-paper': { width: '100%' } }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #bdbdbd' }}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography>Edit User Information</Typography>
                        <Stack direction='row' alignItems='center'>
                            <IconButton onClick={closeModal} ><CloseIcon sx={{ fontSize: 15 }} /></IconButton>
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ p: 2 }}>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
                            <TextField value={firstName} onChange={(e) => handleValues({ firstName: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="First Name" />
                            <TextField value={lastName} onChange={(e) => handleValues({ lastName: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Last Name" />
                        </Stack>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
                            <TextField value={email} onChange={(e) => handleValues({ email: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Email" />
                            <MuiColorInput value={color ? color : '#fff'} onChange={(e) => handleValues({ color: e })} sx={{ '& input': { p: 1.5 }, width: '50%' }} label="Color" />
                        </Stack>
                        <Stack>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={role}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Role" sx={{ '& .MuiSelect-select': { width: '100%', p: 1.5 }, width: '100%' }} />}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                                width: 250,
                                            },
                                        }
                                    }
                                    }
                                >
                                    {roles.map((name) => (
                                        <MenuItem key={name} value={name} >
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                        {
                            skills && role === "Developer" &&
                            <Stack>
                                <TextField label="Skill" value={skills} readonly />
                            </Stack>
                        }
                        <Stack>
                            <TextField value={description} onChange={(e) => handleValues({ description: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 } }} label="Description" multiline rows={4} />
                        </Stack>
                        {
                            error ?
                                <Stack>
                                    <Typography sx={{ color: '#fff', bgcolor: theme => theme.palette.error.main, borderRadius: 1, p: 1 }}>{error}</Typography>
                                </Stack> : null
                        }
                        <Stack>
                            <Button variant='contained' onClick={update}>Update</Button>
                        </Stack>
                        <Divider sx={{ height: 2 }} />
                        <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ pl: 1 }} >
                            <Typography sx={{ fontSize: 13 }}>Password setting</Typography>
                            <IconButton onClick={() => setChecked(!checked)}>
                                {
                                    checked ?
                                        <KeyboardArrowDownIcon /> :
                                        <KeyboardArrowUpIcon />
                                }
                            </IconButton>
                        </Stack>
                        <Collapse in={checked}>
                            <Stack spacing={1.5}>
                                <Stack>
                                    <TextField type='password' value={password} onChange={(e) => handleValues({ password: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 } }} label="New Password" />
                                </Stack>
                                <Stack>
                                    <TextField type='password' value={confirm} onChange={(e) => handleValues({ confirm: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 } }} label="Confirm" />
                                </Stack>
                                {
                                    passError ?
                                        <Stack>
                                            <Typography sx={{ color: '#fff', bgcolor: theme => theme.palette.error.main, borderRadius: 1, p: 1 }}>{passError}</Typography>
                                        </Stack> : null
                                }
                                <Stack>
                                    <Button variant='contained' onClick={updatePassword}>Change Password</Button>
                                </Stack>
                            </Stack>
                        </Collapse>
                    </Stack>
                </DialogContent>
            </Dialog>
            <Dialog
                open={register}
                maxWidth="sm"
                sx={{ '& .MuiDialog-paper': { width: '100%' } }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #bdbdbd' }}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography>Create Account</Typography>
                        <Stack direction='row' alignItems='center'>
                            <IconButton onClick={closeRegister} ><CloseIcon sx={{ fontSize: 15 }} /></IconButton>
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={1.5} sx={{ p: 2 }}>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
                            <TextField value={firstName} onChange={(e) => handleValues({ firstName: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="First Name" />
                            <TextField value={lastName} onChange={(e) => handleValues({ lastName: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Last Name" />
                        </Stack>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
                            <TextField value={email} onChange={(e) => handleValues({ email: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Email" />
                            <MuiColorInput value={color ? color : '#fff'} onChange={(e) => handleValues({ color: e })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="Color" />
                        </Stack>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
                            <TextField type='password' value={password} onChange={(e) => handleValues({ password: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 }, width: '50%' }} label="New Password" />
                            <FormControl sx={{ width: '50%' }}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={role}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Role" sx={{ '& .MuiSelect-select': { width: '100%', p: 1.5, fontSize: 15, }, width: '100%' }} />}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                                width: 250,
                                            },
                                        }
                                    }
                                    }
                                >
                                    {roles.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack>
                            <TextField value={description} onChange={(e) => handleValues({ description: e.target.value })} sx={{ '& input': { fontSize: 15, p: 1.5 } }} label="Description" multiline rows={4} />
                        </Stack>
                        {
                            error ?
                                <Stack>
                                    <Typography sx={{ color: '#fff', bgcolor: theme => theme.palette.error.main, borderRadius: 1, p: 1 }}>{error}</Typography>
                                </Stack>
                                : null
                        }
                        {
                            errorArray.length ?
                                <Stack spacing={.5}>
                                    {
                                        errorArray.map((e, i) => (
                                            <Stack key={i}>
                                                <Typography sx={{ color: '#fff', bgcolor: theme => theme.palette.error.main, borderRadius: 1, p: 1 }}>{e.msg}</Typography>
                                            </Stack>
                                        ))
                                    }
                                </Stack>
                                : null
                        }
                        <Stack direction='row' alignItems='center' spacing={1} justifyContent='flex-end'>
                            <Button variant='outlined' color='error' onClick={cancelCreate} sx={{ textTransform: 'capitalize' }}>Cancel</Button>
                            <Button variant='contained' onClick={createAccount} sx={{ textTransform: 'capitalize' }}>Create</Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
            <Dialog
                open={openCertificate}
                onClose={cancelCertification}
                maxWidth="lg"
                sx={{ '& .MuiDialog-paper': { width: '100%' } }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #bdbdbd' }}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography>Certification</Typography>
                        <Stack direction='row' alignItems='center'>
                            <IconButton onClick={cancelCertification} ><CloseIcon sx={{ fontSize: 15 }} /></IconButton>
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ pt: '8px !important' }}>
                    <Certification allowAdd showAction user={selectedUser} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UserManagement;
