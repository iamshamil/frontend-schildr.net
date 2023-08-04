import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { getDatabyCID } from "../../utilis/request";
import { domain } from '../../config/constant';
import Globe from '../../components/Globe_rotate';

const Certified = () => {
    const { certificationId } = useParams();
    const naviage = useNavigate();
    const [data, setData] = useState();

    const initData = async (params) => {
        const data = await getDatabyCID(certificationId);
        if (data.status) {
            setData(data.data);
        } else {
            naviage("/")
        }
    }

    useEffect(() => {
        if (certificationId) {
            initData();
        } else {
            naviage("/")
        }
        // eslint-disable-next-line
    }, [certificationId])

    if (data) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                overflow: "auto",
                p: { sm: 4, xs: 1 },
                boxShadow: "0 0 10px 0px #00000059",
                background:"#fff"
            }}>
                <Container maxWidth="lg" sx={{ bgcolor: "#fff", pt: 6, pb: 3, px: 4,border:"1px solid silver"}}>
                    <Stack alignItems="center" justifyContent="center" sx={{ px: 4, mb: 2, flexDirection: { sm: "row", xs: "column" } }}>
                        <Box>
                            <Box component="img" src={require("../../assets/img/logo/dark-logo.png")} alt="logo" sx={{ height: 50, width: "auto" }} />
                        </Box>
                    </Stack>
                    <Stack alignItems="center" justifyContent="space-between" sx={{ mt: { sm: "-90px", xs: 0 }, flexDirection: { sm: "row", xs: "column" } }}>
                        <Box sx={{ display: { sm: "block", xs: "none" } }}>
                            <Globe />
                        </Box>
                        <Typography sx={{ fontSize: 20, opacity: 0.7, textAlign: 'right', fontFamily: "Helvetica", }}>ID: <b>{data.certificationId}</b></Typography>
                    </Stack>
                    <Stack alignItems="center">
                        <Typography variant='h3' sx={{ textTransform: "uppercase", fontWeight: "bolder", fontFamily: "Helvetica", color: "#404040" }}>Certificate</Typography>
                        <Typography variant='h6' sx={{ fontWeight: "500", fontFamily: "Helvetica", mt: 2, color: "#404040" }}>This is to certify that</Typography>

                        <Typography variant='h2'
                            sx={{
                                my: 2,
                                color: "#fa746c",
                                textAlign: "center",
                                fontWeight: "bolder",
                                fontFamily: "Helvetica",
                                textTransform: "capitalize",
                                background: "-webkit-linear-gradient(120deg, #556a8f,#fa746c)",
                                "-webkit-background-clip": "text",
                                "-webkit-text-fill-color": "transparent",
                            }}>
                            {`${data.owner.firstName} ${data.owner.lastName}`}
                        </Typography>

                        <Typography sx={{ fontFamily: "Helvetica", fontSize: 20 }}>has successfully completed the</Typography>

                        <Typography variant='h4' sx={{
                            my: 5,
                            position: "relative",
                            fontFamily: "Helvetica",
                            textTransform: "capitalize",
                            textAlign: "center",
                            color: "#404040",
                            "&:before": {
                                content: `""`,
                                height: 5,
                                width: 150,
                                bgcolor: "#fa746c",
                                position: "absolute",
                                left: "calc(50% - 70px)",
                                top: -20
                            },
                            "&:after": {
                                content: `""`,
                                height: 5,
                                width: 150,
                                bgcolor: "#fa746c",
                                position: "absolute",
                                left: "calc(50% - 70px)",
                                bottom: -20
                            },
                        }}>
                            {data.name}
                        </Typography>

                    </Stack>
                    <Grid container>
                        <Grid item sm={6} xs={12}>
                            <Stack alignItems="center" sx={{ my: 1 }}>
                                <Typography
                                    sx={{
                                        py: .5,
                                        px: 4,
                                        color: "#8d8d8d",
                                        fontSize: 18,
                                        fontFamily: "Helvetica",
                                        borderBottom: "2px solid #8d8d8d"
                                    }}>
                                    {`Date : ${moment(data.createdAt).add(Number(data.duration), 'Y').format("DD.MM.YYYY")}`}
                                </Typography>

                            </Stack>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <Stack alignItems="center" sx={{ my: 1 }}>
                                <Typography
                                    sx={{
                                        py: .5,
                                        px: 4,
                                        color: "#8d8d8d",
                                        fontSize: 18,
                                        fontFamily: "Helvetica",
                                        borderBottom: "2px solid #8d8d8d"
                                    }}>
                                    Shail Abbasov OAWO INC testest
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Typography sx={{
                        mt: 5,
                        fontSize: 18,
                        color: "#404040",
                        textAlign: "center",
                        fontFamily: "Helvetica",
                    }}>
                        The Certificate ID can be verified at <Link href={`${domain}/certified/${data.certificationId}`}>oawo.us</Link> to check the authenticity of this certificate
                    </Typography>
                </Container>
            </Box >
        )
    } else {
        return null;
    }
}

export default Certified;
