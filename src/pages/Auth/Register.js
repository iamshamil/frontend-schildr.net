import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { Stack, Box, Typography, TextField, Button } from '@mui/material';

import { register } from '../../utilis/request';

import logo from '../../assets/img/logo/dark-logo.png';
import useConfig from '../../hooks/useConfig';
import { setSession } from '../../utilis/auth';

const roles = [
    "Portfolio manager",
    "Project manager",
    "Business Analyst",
    "Project member",
    "Client"
];

const SignIn = () => {
    const { user, setUser } = useConfig();
    const navigate = useNavigate()
    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm: "",
        role: "",
        skills: "",
        invalidPass: [],
    });
    const { email, password, invalidPass, firstName, lastName, role, confirm, skills } = values;

    const handleValue = (data) => { setValues({ ...values, ...data }) }

    const signup = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            handleValue({ invalidPass: ["Please check password and confirm password again"] });
            return;
        }
        let rdata = await register(values);
        if (rdata.status) {
            setUser(rdata.data);
            setSession(rdata.data._id);
            window.location.href = '/main';
        } else {
            handleValue({ invalidPass: rdata.data.map((e) => e.msg) })
        }
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        handleValue({ role: value });
    };

    useEffect(() => {
        if (user && user.token) {
            window.location.href = '/main';
        }
    }, [user])

    return (
        <Stack alignItems='center' justifyContent='center' sx={{ height: '100%' }}>
            <Stack alignItems='center' justifyContent='center'>
                <Box component='img' src={logo} sx={{ width: 200, mb: 2 }} />
            </Stack>
            <Stack alignItems='center' justifyContent='center' sx={{ width: '100%' }} >
                <form onSubmit={signup}>
                    <Stack spacing={3}>
                        <Box sm={1}>
                            <TextField label="First Name" variant='standard' sx={{ width: { md: 400, sm: 300, xs: 250 } }} type={'text'} value={firstName} onChange={(e) => handleValue({ firstName: e.target.value, invalidPass: [] })} />
                        </Box>
                        <Box sm={1}>
                            <TextField label="Last Name" variant='standard' sx={{ width: { md: 400, sm: 300, xs: 250 } }} type={'text'} value={lastName} onChange={(e) => handleValue({ lastName: e.target.value, invalidPass: [] })} />
                        </Box>
                        <Box sm={1}>
                            <TextField label="Your Email" variant='standard' sx={{ width: { md: 400, sm: 300, xs: 250 } }} type={'email'} value={email} onChange={(e) => handleValue({ email: e.target.value, invalidPass: [] })} />
                        </Box>
                        <Box sm={1}>
                            <TextField label="Password" variant='standard' sx={{ width: { md: 400, sm: 300, xs: 250 } }} type={'password'} value={password} onChange={(e) => handleValue({ password: e.target.value, invalidPass: [] })} />
                        </Box>
                        <Box sm={1}>
                            <TextField label="Confirm Password" variant='standard' sx={{ width: { md: 400, sm: 300, xs: 250 } }} type={'password'} value={confirm} onChange={(e) => handleValue({ confirm: e.target.value, invalidPass: [] })} />
                        </Box>
                        <Box sm={1}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={role}
                                    onChange={handleChange}
                                >
                                    {roles.map((name, i) => (
                                        <MenuItem key={i} value={name} > {name} </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        {
                            role === "Developer" &&
                            <Box>
                                <TextField
                                    label="Your Skills"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="React, Node, PHP, etc..."
                                    variant="standard"
                                    value={skills}
                                    onChange={(e) => handleValue({ skills: e.target.value, invalidPass: [] })}
                                />
                            </Box>
                        }
                        <Stack alignItems='center' marginTop={5} sx={{ width: '100%' }}>
                            <Button variant='contained' color='primary' sx={{ mx: 'auto', width: { md: 300, xs: 200 }, textTransform: 'capitalize' }} type='submit'>Sign Up</Button>
                        </Stack>
                    </Stack>
                    {
                        invalidPass.length ?
                            invalidPass.map((error, i) => (
                                <Box sx={{ my: 1, bgcolor: '#ff4c4c', borderRadius: 1, p: 1 }} key={i}>
                                    <Typography variant='h7' sx={{ color: '#fff' }}>{error}</Typography>
                                </Box>
                            )) : null
                    }
                    <Box marginTop={3} textAlign={'center'}>
                        <Typography variant='h7' align='center' sx={{ cursor: "pointer" }}>Already have an account? <Typography variant='span' onClick={() => navigate("/auth/login")} >Sign In!</Typography></Typography>
                    </Box>
                </form>
            </Stack>
        </Stack>
    )
}

export default SignIn
