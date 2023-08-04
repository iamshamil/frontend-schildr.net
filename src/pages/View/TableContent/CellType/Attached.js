import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import ImageModal from '../../../../components/ImageModal';
import { useState } from 'react';
import { uploadUrl } from '../../../../config/constant';
import { getImg } from '../../../../utilis/util';

const Attached = (props) => {
    const { data, focus, position } = props;
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const handleOpenModal = (i) => {
        if (focus) {
            setIndex(i);
            setOpen(true);
        }
    }


    const handleImgModal = () => {
        setOpen(false);
    }

    return (
        <>
            <Box tabIndex={position.join('-')} sx={{ height: '100%', width: '100%' }}>
                <Stack direction='row' alignItems='center' sx={{ px: '3px', height: '100%', display: 'inline-flex', position: "relative" }} >
                    {
                        data.data && data.data.map((src, i) => (
                            <Box
                                key={i}
                                sx={{
                                    height: focus ? 36 : 25,
                                    width: 'auto',
                                    mr: .25,
                                    zIndex: 1,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: '2px solid #0000001a',
                                    bgcolor: '#0000001a',
                                    '&:hover': { border: focus ? '2px solid #00000052' : '2px solid #0000001a', }
                                }}>
                                {
                                    src.mimetype.startsWith('image') ?
                                        <Box
                                            onClick={() => handleOpenModal(i)}
                                            sx={{
                                                height: focus ? 36 : 25,
                                                maxWidth: focus ? 64 : 44
                                            }} component='img' src={`${uploadUrl}${src.filename}`} alt='attached' />

                                        : <Box
                                            onClick={() => handleOpenModal(i)}
                                            sx={{
                                                height: focus ? 36 : 20,
                                                width: focus ? 36 : 20,
                                            }} component='img' src={getImg(src)} alt='attached' />
                                }
                            </Box>
                        ))
                    }
                </Stack>
            </Box>
            <ImageModal open={open} close={handleImgModal} data={data.data} index={index} />
        </>
    )
}

export default Attached;