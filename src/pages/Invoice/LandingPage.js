import { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useParams } from "react-router-dom";
import { getInvoiceById } from "../../utilis/request";
import { Typography } from "@mui/material";
import moment from "moment";

const Br = () => <br style={{ height: 16, }} />


const LandingPage = () => {
    const { invoiceId } = useParams();
    const [data, setdata] = useState();

    const initData = useCallback(async () => {
        const data = await getInvoiceById(invoiceId)
        if (data.status) {
            setdata(data.data)
        }
    }, [invoiceId])

    useEffect(() => {
        if (invoiceId)
            initData()
    }, [invoiceId, initData]);

    if (data) {
        return (
            <Box sx={{ bgcolor: "#fff", width: "100%", height: "100%", overflow: "auto" }}>
                <Br />
                <Box sx={{
                    maxWidth: '90%',
                    width: "100%",
                    mx: "auto",
                    p: "5%",
                    px: 2,
                    backgroundImage: `url(${require('../../assets/img/invoiceback.jpg')})`,
                    bgcolor: "#121a41",
                    backgroundSize: "100%",
                    backgroundRepeat: "no-repeat"
                }}>
                    <Box sx={{
                        display: "flex",
                        flexWrap: "wrap"
                    }}>
                        <Grid container spacing={2}>
                            <Grid item md={4} />
                            <Grid item md={8}>
                                <Box sx={{
                                    p: "0 5%",
                                    textAlign: { sm: "right", xs: "left" },
                                    wordSpacing: "normal !important"
                                }}>
                                    <Box component='img' src={require('../../assets/img/logo/dark-logo.png')} alt="logo" sx={{ width: 250, filter: "brightness(0)invert(100%)" }} />
                                    <Br />
                                    <Br />
                                    <Br />
                                    <Typography variant="h1" sx={{ fontSize: { sm: 40, xs: 25 }, color: "#fff", mb: "0.5rem", fontWeight: 700 }}>
                                        {`Dear, ${data.toUser.firstName} ${data.toUser.lastName}`}
                                    </Typography>
                                    <Br />
                                    <Typography sx={{ fontSize: { sm: 18, xs: 15 }, mb: 2.5, mt: 0, textAlign: { sm: "right", xs: "left" }, color: "#fff" }}>
                                        Thank you for your interest in our products. You can see the proposal of the product you are interested in below. If you have any question don’t hesitate to contact us.
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontSize: 20, color: "#343f52", fontWeight: 700, mb: 2 }}>
                                        {moment(data.createData).format("DD MMMM, yyyy")}
                                    </Typography>
                                    <Typography component="span" sx={{
                                        cursor: "pointer",
                                        width: 0,
                                        display: "block",
                                        m: 2.5,
                                        ml: "auto",
                                        height: 0,
                                        borderLeft: "30px solid transparent",
                                        borderRight: "30px solid transparent",
                                        borderTop: "30px solid #fa746c",
                                        textIndent: "-9999px",
                                        transformOrigin: "50% 50%",
                                        animation: "downarrow 0.6s infinite alternate ease-in-out"
                                    }} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Box sx={{
                    mx: "auto",
                    maxWidth: "90%",
                    width: "100%",
                    p: "50px 0",
                    border: "1px solid #b5b5b5",
                }}>
                    <Box sx={{
                        margin: "80px 0",
                        py: "15px",
                        px: "5%"
                    }}>
                        <Box sx={{
                            display: "flex",
                            flexWrap: "wrap",
                        }}>
                            <Grid container spacing={1}>
                                <Grid item sm={6} xs={12}>
                                    <Box component='img' sx={{ width: 200 }} src={require('../../assets/img/logo/dark-logo.png')} alt="logo" />
                                    <Stack sx={{
                                        p: "5px 10px",
                                        m: "10px 0 20px"
                                    }}>
                                        <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                            <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>OAWO INC.</Typography>
                                        </Typography>
                                        <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                            <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>Branch contacts:</Typography>
                                        </Typography>
                                    </Stack>
                                    <Stack sx={{
                                        p: "5px 10px",
                                        m: "10px 0 20px"
                                    }}>
                                        <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                            <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>Created by:</Typography>{`${data.fromUser.firstName} ${data.fromUser.lastName}`}
                                        </Typography>
                                        <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                            <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>Phones:</Typography>{data.fromUser.phoneNumber}
                                        </Typography>
                                    </Stack>
                                    <Br />
                                    <Br />
                                    <Br />
                                </Grid>
                                <Grid item sm={6} xs={12} sx={{ textAlign: { sm: "right", xs: "left" } }}>
                                    <Typography variant="h4" sx={{
                                        p: "5px 10px",
                                        my: "10px",
                                        fontWeight: "bold",
                                        fontSize: 20
                                    }}>
                                        INVOICE
                                    </Typography>
                                    <Stack sx={{
                                        p: "5px 10px",
                                        m: "10px 0 20px"
                                    }}>
                                        <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                            <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>INVOICE Number:</Typography>
                                            <Typography component='span' sx={{ fontSize: 13, display: "inline-block", width: 200, color: "#60697b" }}>{`INV-${data.invoiceId}`}</Typography>
                                        </Typography>
                                        <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                            <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>Date:</Typography>
                                            <Typography component='span' sx={{ fontSize: 13, display: "inline-block", width: 200, color: "#60697b" }}>{moment(data.createData).format("DD MMMM, yyyy")}</Typography>
                                        </Typography>
                                    </Stack>
                                    <Stack sx={{
                                        p: "5px 10px",
                                        m: "10px 0 20px"
                                    }}>
                                        <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                            <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>Requested by:</Typography>
                                            <Typography component='span' sx={{ fontSize: 13, display: "inline-block", width: 200, color: "#60697b" }}>{`${data.toUser.firstName} ${data.toUser.lastName}`}</Typography>
                                        </Typography>
                                        <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                            <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>Phones:</Typography>
                                            <Typography component='span' sx={{ fontSize: 13, display: "inline-block", width: 200, color: "#60697b" }}>{data.toUser.phoneNumber}</Typography>
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack
                                        sx={{
                                            p: "5px 10px",
                                            "& table": {
                                                borderCollapse: "collapse",
                                                width: "100%",
                                                mb: "20px",
                                                "& th": {
                                                    border: "1px solid #edeff3",
                                                    textAlign: "left",
                                                    padding: "5px",
                                                    color: "#60697b",
                                                    fontSize: { sm: 14, xs: 8 }
                                                },
                                                "& td": {
                                                    border: "1px solid #edeff3",
                                                    textAlign: "left",
                                                    padding: "5px",
                                                    color: "#60697b",
                                                    fontSize: { sm: 14, xs: 8 }
                                                }
                                            }
                                        }}>
                                        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: 18, color: "#343f52", mb: "10px" }}>Management Systems</Typography>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "3%" }}>No</th>
                                                    <th style={{ width: "28%" }}>Product Name	</th>
                                                    <th style={{ width: "37%" }}>Description</th>
                                                    <th style={{ width: "8%" }}>Qty</th>
                                                    <th style={{ width: "8%" }}>Unit Price ($)	</th>
                                                    <th style={{ width: "8%" }}>Total ($) </th>
                                                    <th style={{ width: "8%" }}>Type</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data.details.map((one, i) => (
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>{one.title}</td>
                                                            <td>{one.description}</td>
                                                            <td>{one.quantity}</td>
                                                            <td>{one.price}</td>
                                                            <td>{one.total}</td>
                                                            <td>{
                                                                (() => {
                                                                    switch (one.type) {
                                                                        case 1:
                                                                            return 'One Time'
                                                                        case 2:
                                                                            return 'Monthly'
                                                                        case 3:
                                                                            return 'Yearly'
                                                                        default:
                                                                            return 'One Time'
                                                                    }
                                                                })()
                                                            }</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: 20, color: "#343f52", "& b": { fontWeight: "bolder" } }}>Total: <b>${data.details.reduce((f, s) => f + s.total, 0)}</b></Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ px: "10px" }}>
                                        <Typography variant="h6" sx={{ fontSize: 18, fontWeight: "bolder", color: '#343f52', my: "20px" }}>OUR REQUISITES</Typography>
                                        <Stack spacing={1}>
                                            <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                                <Typography component='span' sx={{ fontSize: 13, display: "inline-block", width: 200, color: "#60697b" }}>Company Name:</Typography>
                                                <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>OAWO INC.</Typography>
                                            </Typography>
                                            <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                                <Typography component='span' sx={{ fontSize: 13, display: "inline-block", width: 200, color: "#60697b" }}>Bank Name:</Typography>
                                                <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>Bank of America</Typography>
                                            </Typography>
                                            <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                                <Typography component='span' sx={{ fontSize: 13, display: "inline-block", width: 200, color: "#60697b" }}>Account Number:</Typography>
                                                <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>381056602692</Typography>
                                            </Typography>
                                            <Typography sx={{ fontSize: 13, mb: '3px', lineHeight: 1.7 }}>
                                                <Typography component='span' sx={{ fontSize: 13, display: "inline-block", width: 200, color: "#60697b" }}>Routing Number:</Typography>
                                                <Typography component='b' sx={{ fontSize: 13, display: "inline-block", fontWeight: "bolder", width: 200, color: "#60697b" }}>021200339 (Paper and Electronic) 026009593 (wires)</Typography>
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </Box>
        )
    }

}

export default LandingPage;