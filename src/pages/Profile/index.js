import React, { useState } from 'react';
import { MuiColorInput } from 'mui-color-input'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { fileToBase64 } from '../../utilis/file-to-base64';
import { avatarUrl, imgTypes } from '../../config/constant';
import { bytesToSize } from '../../utilis/bytes-to-size';
import useConfig from '../../hooks/useConfig';
import { useEffect } from 'react';
import { fileAxios, updateUser } from '../../utilis/request';
import { toast } from 'react-toastify';
import Experience from './Experience';
import Certification from '../UserManagement/Certification';
import Education from './Education';

const Profile = () => {
    const { user, setUser } = useConfig();
    const [photo, setPhoto] = useState({});
    const [file, setFile] = useState({});
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        color: "",
        description: "",
        skills: "",
        phoneNumber: ""
    });

    const [updating, setUpdating] = useState(false);

    const { firstName, lastName, email, color, description, skills, phoneNumber } = data;

    const setValues = (data) => setData(pre => ({ ...pre, ...data }));

    const chooseFile = async (e) => {
        e.preventDefault()
        e.target.blur();
        let files = e.target.files;

        let moreTemp = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let type = file.type.split('/')[1]
            if (!type) type = file.name.split('.').pop();
            if (imgTypes.includes(type)) {
                let base64 = await fileToBase64(file)
                moreTemp.push({ name: file.name, size: bytesToSize(file.size, 1), base64 })
            } else {
                moreTemp.push({ name: file.name, size: bytesToSize(file.size, 1) })
            }
        }

        setPhoto(moreTemp[0])
        setFile(files[0])
    }

    const updateProfile = async () => {
        if (!firstName) {
            toast.error('Please input first name')
            return
        } else if (!lastName) {
            toast.error('Please input last name')
            return
        } else if (!email) {
            toast.error('Please input email')
            return
        } else if (!color) {
            toast.error('Please set color')
            return
        }

        setUpdating(true);
        let rdata = await updateUser({ id: user._id, data: { firstName, lastName, email, color, description, skills, phoneNumber } });
        if (rdata.status) {
            toast.success("Success!")
            setUser({ ...user, firstName, lastName, email, color, description, skills, phoneNumber });
        } else {
            toast.error(rdata.message)
        }
        setUpdating(false);
    }

    const uploadAvatar = async () => {
        let form = new FormData()
        form.append('file', file)
        form.append('id', user._id)
        const res = await fileAxios('auth/upload-avatar', form, () => false)
        if (res.status) {
            setUser({ ...user, avatar: res.data })
            setPhoto({})
        } else {
            toast.error(res.message)
        }
    }

    useEffect(() => {
        setValues({ firstName: user.firstName, lastName: user.lastName, email: user.email, color: user.color, description: user.description, skills: user.skills, phoneNumber: user.phoneNumber })
    }, [user]);

    return (
        <Box sx={{ bgcolor: '#f5f5f5', height: "100%", overflow: "auto", py: 4 }}>
            <Container maxWidth="lg">
                <Typography variant='h5' sx={{ fontWeight: "600", mb: 3 }}>Profile</Typography>
                <Grid container spacing={3}>
                    <Grid item md={3}>
                        <Card sx={{ bgcolor: "#fff", borderRadius: 4 }}>
                            <CardContent>
                                <Stack alignItems="center">
                                    <Avatar alt="Remy Sharp" src={photo?.base64 || (user.avatar ? `${avatarUrl}${user.avatar}` : "")} sx={{ width: 200, height: 200, mt: 2, mb: 3, color: "#fff", fontSize: 32, fontWeight: 600 }} />
                                    <Stack direction="row" spacing={2}>
                                        <Button startIcon={<AddPhotoAlternateIcon />} variant="contained" color="secondary" component="label">
                                            Choose
                                            <input hidden accept="image/*" type="file" onChange={chooseFile} />
                                        </Button>
                                        {
                                            !!Object.keys(photo).length &&
                                            <LoadingButton onClick={uploadAvatar} startIcon={<CloudUploadIcon />} variant='contained' color='primary' >
                                                Upload
                                            </LoadingButton>
                                        }
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={9}>
                        <Card sx={{ bgcolor: "#fff", borderRadius: 4 }}>
                            <CardContent>
                                <Box sx={{ gridTemplateColumns: "repeat(2, 1fr)", display: "grid", gap: "16px 16px", mb: 1 }}>
                                    <TextField label="First Name" value={firstName} onChange={(e) => setValues({ firstName: e.target.value })} />
                                    <TextField label="Last Name" value={lastName} onChange={(e) => setValues({ lastName: e.target.value })} />
                                    <TextField label="Email" value={email} onChange={(e) => setValues({ email: e.target.value })} />
                                    <MuiColorInput label="Color" value={color} onChange={(e) => setValues({ color: e })} />
                                </Box>
                                <Stack spacing={2} mt={2}>
                                    <TextField label="Phone" fullWidth value={phoneNumber} onChange={(e) => setValues({ phoneNumber: e.target.value })} />
                                    <TextField multiline rows={2} label="Description" fullWidth value={description} onChange={(e) => setValues({ description: e.target.value })} />
                                    {
                                        user.role === "Developer" &&
                                        <TextField multiline rows={2} label="Skills" fullWidth value={skills} onChange={(e) => setValues({ skills: e.target.value })} />
                                    }
                                </Stack>
                                <Stack sx={{ mt: 3, justifyContent: 'flex-end' }}>
                                    <LoadingButton variant='contained' loading={updating} onClick={updateProfile}>Update</LoadingButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={12}>
                        <Card sx={{ bgcolor: "#fff", borderRadius: 4 }}>
                            <CardContent>
                                <Stack spacing={4}>
                                    <Experience />
                                    <Education />
                                    <Certification showTitle user={user} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}


export default Profile;