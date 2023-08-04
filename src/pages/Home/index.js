import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { MuiColorInput } from 'mui-color-input'

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { createProject, getProjects, updateProject, deleteProject } from "../../utilis/request";
import { toast } from 'react-toastify';
import { getColor } from '../../utilis/util';
import useConfig from '../../hooks/useConfig';

const Home = () => {
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState("");
    const [projects, setProjects] = useState([]);
    const [values, setValues] = useState({
        name: "",
        color: "#dddddd",
        mark: 0,
        check: false,
        error: ""
    });
    const { user } = useConfig()

    const { name, color, error, check } = values;

    const handleValue = (data) => setValues((pre) => ({ ...pre, ...data }));

    const openModal = (e) => {
        e.preventDefault();
        setOpen(true);
    }

    const openEdit = (e, item) => {
        e.preventDefault();
        setIsEdit(item._id)
        setOpen(true);
        handleValue({ name: item.name, color: item.color, check: false })
    }

    const closeModal = () => {
        setOpen(false);
        setValues({ name: "", check: false, error: "", mark: 0 });
    }

    const createOne = async () => {
        handleValue({ check: true })
        if (!name) {
            return;
        }

        if (isEdit) {
            const rdata = await updateProject({ name, color, id: isEdit })
            if (rdata.status) {
                setProjects(pre => {
                    return pre.map((e) => {
                        if (e._id === rdata.data._id) {
                            return rdata.data
                        } else {
                            return e;
                        }
                    })
                })
                closeModal();
            } else {
                toast.error(rdata.message)
            }
        } else {
            const rdata = await createProject({ name, color })
            if (rdata.status) {
                setProjects(pre => {
                    return [...pre, rdata.data]
                })
                closeModal();
            } else {
                toast.error(rdata.message)
            }
        }
    }

    const remove = async (e, id) => {
        e.preventDefault();
        const data = await deleteProject(id)
        if (data.status) {
            setProjects(pre => pre.filter((e) => e._id !== id));
        } else {
            toast.error(data.message)
        }
    }


    const getData = async () => {
        const rdata = await getProjects(user._id);
        if (rdata.status) {
            setProjects(rdata.data);
        } else {
            toast.error(rdata.message)
        }
    }

    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Box sx={{ width: '100%', height: '100%', bgcolor: '#f5f5f5', p: 4 }}>
                <Typography variant='h5' sx={{ fontWeight: "600", mb: 3 }}>Home</Typography>
                <Grid container spacing={2}>
                    {
                        projects.map((e, i) => (
                            <Grid key={i} item xl={12 / 6} md={12 / 5} sm={12 / 2} xs={12}>
                                <Button
                                    component={RouterLink}
                                    to={e._id}
                                    sx={{
                                        position: "relative",
                                        color: e.color,
                                        borderRadius: 2,
                                        justifyContent: "flex-start",
                                        width: "100%",
                                        border: "1px solid #e0e1e1",
                                        p: 2.,
                                        bgcolor: "#fff",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            borderColor: "#fff",
                                            boxShadow: "0 0 9px 0px #c0c0c0",
                                            "& .manage": {
                                                display: "block"
                                            }
                                        }
                                    }}>
                                    <Box sx={{ bgcolor: e.color, borderRadius: 2, width: 56, height: 56, fontSize: 20, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", mr: 2, textTransform: "uppercase", color: getColor(e.color) }}>
                                        {e.name[0]}
                                    </Box>
                                    <Stack sx={{ width: "calc(100% - 76px)", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        <Typography sx={{ fontSize: 16, textAlign: "start", color: "#000" }}>{e.name}</Typography>
                                        <Typography sx={{ fontSize: 12, opacity: 0.7, textAlign: "start", color: "#000" }}>{moment(e.createdAt).format("MM/DD/yyyy")}</Typography>
                                    </Stack>
                                    {
                                        user?.role === "Admin" &&
                                        <Stack className='manage' direction='row' sx={{ position: "absolute", top: 5, right: 5, zIndex: 999, display: "none" }}>
                                            <IconButton sx={{ p: .5 }} onClick={(p) => openEdit(p, e)}><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                                            <IconButton sx={{ p: .5 }} onClick={(p) => remove(p, e._id)}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                                        </Stack>
                                    }
                                </Button>
                            </Grid>
                        ))
                    }
                </Grid>
                {
                    user && user.role === "Admin" &&
                    <Box sx={{ borderTop: "1px solid #e0e1e1", pt: 4, mt: 4 }}>
                        <Grid container spacing={2}>
                            <Grid item xl={12 / 6} md={12 / 5} sm={12 / 2} xs={12}>
                                <Button
                                    onClick={openModal}
                                    sx={{ borderRadius: 2, justifyContent: "flex-start", width: "100%", border: "1px solid #e0e1e1", p: 2., bgcolor: "#fff", cursor: "pointer", transition: "all 0.2s", "&:hover": { boxShadow: "0 0 9px 0px #c0c0c0", borderColor: "#fff" } }}>
                                    <Box sx={{ bgcolor: (theme) => theme.palette.info.main, borderRadius: 2, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
                                        <AddIcon sx={{ color: "#fff" }} />
                                    </Box>
                                    <Stack sx={{ width: "calc(100% - 76px)", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        <Typography sx={{ fontSize: 16, textAlign: "start", color: "#000" }}>Create one</Typography>
                                        <Typography sx={{ fontSize: 12, opacity: 0.7, textAlign: "start", color: "#000" }}>{moment(new Date()).format("MM/DD/yyyy")}</Typography>
                                    </Stack>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                }
            </Box >

            <Dialog
                open={open}
                onClose={closeModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`${isEdit ? "Edit" : "Create a new"} project`}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={1} sx={{ py: 1 }}>
                        <TextField required value={name} error={!name && check} onChange={(e) => handleValue({ name: e.target.value })} placeholder='Project Name' sx={{ width: 500 }} />
                        <MuiColorInput required value={color} error={!color && check} onChange={(e) => handleValue({ color: e })} placeholder='Color' />
                        {
                            error ?
                                <Box sx={{ my: 1, bgcolor: '#ff4c4c', borderRadius: 1, p: 1 }} >
                                    <Typography variant='h7' sx={{ color: '#fff' }}>{error}</Typography>
                                </Box>
                                : null
                        }
                    </Stack>
                    <Stack direction='row' justifyContent='flex-end' sx={{ pt: 2 }}>
                        <Button variant='contained' color='error' onClick={closeModal} sx={{ mr: 1 }}>Cancel</Button>
                        <Button variant='contained' color='info' onClick={createOne}>
                            {isEdit ? "Update" : "Create"}
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Home;
