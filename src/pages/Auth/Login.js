import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stack, Box, Typography, TextField, Button } from '@mui/material';
import { login } from '../../utilis/request';

import logo from '../../assets/img/logo/dark-logo.png';
import { setSession, getSession } from '../../utilis/auth';
import useConfig from '../../hooks/useConfig';

function SignIn() {
    const navigate = useNavigate()
    const { setUser } = useConfig()
    const [values, setValues] = useState({
        email: "",
        password: "",
        invalidPass: [],
    });
    const { email, password, invalidPass } = values;

    const handleValue = (data) => { setValues({ ...values, ...data }) }

    const signIn = async (e) => {
        e.preventDefault();
        let rdata = await login(values);
        if (rdata.status) {
            setUser(rdata.data);
            setSession(rdata.data.token);
            window.location.href = '/';
        } else {
            handleValue({ invalidPass: [{ msg: rdata.message }] })
        }
    }

    useEffect(() => {
        if (getSession()) {
            window.location.href = '/';
        }
    }, [])


    return (
        <Stack alignItems='center' justifyContent='center' sx={{ height: '100%' }}>
            <Stack alignItems='center' justifyContent='center'>
                <Box component='img' src={logo} sx={{ width: 200, mb: 2 }} />
            </Stack>
            <Stack alignItems='center' justifyContent='center' sx={{ width: '100%' }} >
                <form onSubmit={signIn}>
                    <Box sm={1}>
                        <TextField label="Your Email" variant='standard' sx={{ width: { md: 400, sm: 300, xs: 250 } }} type={'email'} value={email} onChange={(e) => handleValue({ email: e.target.value, invalidPass: [] })} />
                    </Box>
                    <Box marginTop={5}>
                        <TextField label="Password" variant='standard' sx={{ width: { md: 400, sm: 300, xs: 250 } }} type={'password'} value={password} onChange={(e) => handleValue({ password: e.target.value, invalidPass: [] })} />
                    </Box>
                    <Stack alignItems='center' marginTop={5} sx={{ width: '100%' }}>
                        <Button variant='contained' color='primary' sx={{ mx: 'auto', width: { md: 300, xs: 200 }, textTransform: 'capitalize' }} type='submit'>Sign In</Button>
                    </Stack>
                    {
                        invalidPass.length ?
                            invalidPass.map((error, i) => (
                                <Box sx={{ my: 1, bgcolor: '#ff4c4c', borderRadius: 1, p: 1 }} key={i}>
                                    <Typography variant='h7' sx={{ color: '#fff' }}>{error.msg}</Typography>
                                </Box>
                            )) : null
                    }
                    <Box marginTop={3} textAlign={'center'}>
                        <Typography variant='h7' align='center' sx={{ cursor: "pointer" }}>Don't have an account, <Typography variant='span' onClick={() => navigate("/auth/signup")} >Sign Up!</Typography></Typography>
                    </Box>
                </form>
            </Stack>
        </Stack>
    )
}

export default SignIn