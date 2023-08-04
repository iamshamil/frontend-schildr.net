import React, { useState, forwardRef, useEffect } from 'react';
import Zoom from 'react-medium-image-zoom'

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { uploadUrl, imgTypes, videoTypes, docModuleTypes, certificationUrl } from '../config/constant';

// Import Swiper styles
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import 'react-medium-image-zoom/dist/styles.css'

import notSupport from "../assets/img/attachment_preview_not_supported.png"
import { downloadFile } from '../utilis/request';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ImageModal = (props) => {
    const { open, close, data, index, isProfile } = props;
    const [swiper, setSwiper] = useState(0);
    const [size, setSize] = useState([0, 0]);

    const serverUrl = isProfile ? certificationUrl : uploadUrl;

    const moveSlide = (k) => {
        if (k === "prev") {
            document.querySelector(".iamge-slider .swiper-button-prev").click();
        } else {
            document.querySelector(".iamge-slider .swiper-button-next").click();
        }
    };

    const handleClose = () => {
        close()
    };

    const loadingHand = (e) => {
        setSize([e.target.width, e.target.height])
    }

    const handleDownload = () => {
        downloadFile(data[swiper]);
    }

    useEffect(() => {
        setSwiper(index);
    }, [index])


    return (
        <Dialog
            fullScreen
            open={open}
            onClose={() => handleClose()}
            TransitionComponent={Transition}
            sx={{ '& .MuiDialog-paper': { bgcolor: '#000000cf' } }}
        >
            <Stack sx={{ p: 2, position: 'absolute', top: 0, right: 0 }} alignItems="flex-end">
                <IconButton onClick={handleClose}>
                    <CloseIcon sx={{ color: '#fff', fontSize: 50 }} />
                </IconButton>
            </Stack>
            <Stack
                sx={{ width: "100%", height: '100%' }}
                direction="row"
                alignItems="center"
                justifyContent="center"
            >
                <IconButton onClick={() => moveSlide("prev")}>
                    <ArrowBackIosIcon sx={{ color: '#fff', fontSize: 50 }} />
                </IconButton>

                <Stack
                    alignItems='center'
                    justifyContent="center"
                    sx={{
                        width: "70%",
                        height: "90%",
                        '& .iamge-slider': {
                            width: '100%',
                            mb: 2,
                            '& .swiper-button-next': {
                                display: 'none'
                            },
                            '& .swiper-button-prev': {
                                display: 'none'
                            },
                            '& .swiper-slide': {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        },
                        '& .img-btn': {
                            width: '100%'
                        }
                    }}
                >
                    <Swiper
                        onSlideChange={(e) => setSwiper(e.realIndex)}
                        initialSlide={index}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation={true}
                        modules={[Navigation]}
                        className="iamge-slider"
                    >
                        {data.length ? data.map((src, idx) => (
                            <SwiperSlide key={idx}>
                                <Box key={idx} sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {
                                        (() => {
                                            let type = src.filename.split('.').pop();
                                            if (!type) type = src.mimetype.split('/')[1]
                                            const srcUrl = serverUrl + src.filename;

                                            if (swiper === idx) {
                                                if (imgTypes.includes(type)) {
                                                    return (
                                                        <Zoom>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%" }}>
                                                                <Box component="img" sx={size[0] === size[1] ? { maxWidth: "100%", maxHeight: "100%", minWidth: 50, minHeight: 50 } : (size[0] > size[1] ? { width: "100%", minWidth: 50, minHeight: 50 } : { height: "100%", minWidth: 50, minHeight: 50 })} onLoad={loadingHand} src={srcUrl} />
                                                            </Box>
                                                        </Zoom>
                                                    )
                                                } else if (videoTypes.includes(type)) {
                                                    return (
                                                        <Box sx={{ height: '100%', width: '100%', '& iframe': { width: "100%", height: "100%", ml: "-2px", mt: "-2px" } }}>
                                                            <iframe
                                                                src={srcUrl}
                                                                title={src.mimetype}
                                                            />
                                                        </Box>
                                                    )
                                                } else if (src.mimetype.startsWith('application/pdf')) {
                                                    return (
                                                        <Box sx={{ height: '100%', width: '100%', '& iframe': { width: '100%', height: '100%' } }}>
                                                            <iframe
                                                                title='pdf'
                                                                src={srcUrl}
                                                            />
                                                        </Box>)
                                                } else if (docModuleTypes.includes(type)) {
                                                    return (
                                                        <Box sx={{ height: '100%', width: '100%' }}>
                                                            <DocViewer pluginRenderers={DocViewerRenderers} documents={[{ uri: srcUrl }]} />
                                                        </Box>
                                                    )
                                                } else {
                                                    return (
                                                        <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Stack sx={{ width: 150 }} alignItems='center' >
                                                                <Box component="img" src={notSupport} sx={{ width: 50 }} />
                                                                <Typography sx={{ color: '#fff', textAlign: 'center' }}>Previews for this filetype are not available</Typography>
                                                                <Typography sx={{ color: '#fff', textAlign: 'center', opacity: .4 }}>{`${src.originalname} - ${Math.round(src.size / 1024)}KB`}</Typography>
                                                            </Stack>
                                                        </Box>
                                                    )
                                                }
                                            } else {
                                                return null;
                                            }
                                        })()
                                    }
                                </Box>
                            </SwiperSlide>
                        )) : null}
                    </Swiper>
                </Stack>
                <IconButton onClick={() => moveSlide("next")}>
                    <ArrowForwardIosIcon sx={{ color: '#fff', fontSize: 50 }} />
                </IconButton>
            </Stack>
            <Button variant='contained' startIcon={<DownloadIcon />} onClick={handleDownload} sx={{ position: 'absolute', bottom: 40, right: "5%" }}>Download</Button>
        </Dialog>
    );
};

export default ImageModal;