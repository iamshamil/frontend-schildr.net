import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import AddIcon from '@mui/icons-material/Add';
import ImageModal from '../../../../components/ImageModal';
import UploadModal from '../../../../components/UploadModal';
import { useState } from 'react';
import { uploadUrl } from '../../../../config/constant';

import useTableContext from '../../../../hooks/useTable';
import { fileAxios, updateLog, updateRow } from '../../../../utilis/request';
import useConfig from '../../../../hooks/useConfig';
import { TextField } from '@mui/material';
import { getImg } from '../../../../utilis/util';

const Attached = (props) => {
    const { data, focus, position, group } = props;
    const [open, setOpen] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [index, setIndex] = useState(0);
    const { user } = useConfig()
    const { header, body, changeBody } = useTableContext()

    const handleOpenModal = (i) => {
        if (focus) {
            setIndex(i);
            setOpen(true);
        }
    }

    const handleUploadModal = () => {
        setOpenUpload(false);
    }

    const handleImgModal = () => {
        setOpen(false);
    }

    const openUploadModal = () => {
        setOpenUpload(true);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setOpenUpload(true);
        }
    };

    const handlePaste = async (evt) => {
        const clipboardItems = evt.clipboardData.items;
        const items = [].slice.call(clipboardItems).filter(function (item) {
            return item.type.indexOf('image') !== -1;
        });
        if (items.length === 0) {
            return;
        }

        const item = items[0];
        const blob = item.getAsFile();
        let form = new FormData();
        form.append('file', blob)

        const res = await fileAxios('table/upload', form, (e) => console.log(e))
        if (res.status) {
            let t = { data: body };
            let rowId = t.data[position[0]]._id;
            for (let item of res.data) {
                t.data[position[0]].row[position[1]].data.push(item);
            }
            changeBody(t.data);
            let rdata = await updateRow({ data: t.data[position[0]], modifier: user })
            if (rdata.status) {
                let log = {
                    type: 'activity',
                    rowId,
                    history: { status: 'add', data: res.data },
                    dataType: 'attached',
                    sign: { [user._id]: true },
                    creator: user,
                    cellName: header[position[1]].name,
                    cellId: data.id,
                    columnId: header[position[1]].id
                }
                updateLog(log);
            }
        }
    }


    return (
        <>
            <Box tabIndex={position.join('-')} onKeyDown={handleKeyDown} sx={{ height: '100%', width: '100%' }}>
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
                    {
                        focus && group === 'active' && header[position[1]].editable &&
                        <Stack onClick={() => openUploadModal()} alignItems='center' justifyContent='center' sx={{ height: 38, mr: .25, borderRadius: '3px', px: .5, cursor: 'pointer', bgcolor: '#0000000d', zIndex: 1, '&:hover': { bgcolor: '#0000001a' } }}>
                            <AddIcon sx={{ fontSize: 12 }} />
                        </Stack>
                    }
                    <TextField sx={{ position: "absolute", height: "100%", width: "100%", opacity: 0, zIndex: 0 }} onPaste={handlePaste} />
                </Stack>
            </Box>
            <ImageModal open={open} close={handleImgModal} data={data.data} index={index} />
            <UploadModal open={openUpload} close={handleUploadModal} position={position} data={data} />
        </>
    )
}

export default Attached;