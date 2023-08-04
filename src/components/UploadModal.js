import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';

import { bytesToSize } from "../utilis/bytes-to-size";
import { fileToBase64 } from "../utilis/file-to-base64";
import { fileAxios, updateRow, updateLog } from '../utilis/request';

import File from '../assets/img/svg/file.svg';
import Delete from '../assets/img/svg/delete.svg';
import useConfig from '../hooks/useConfig';

import { fileTypes, imgTypes } from '../config/constant';
import useTableContext from '../hooks/useTable';

export default function UploadModal(porps) {
    const { open, close, position, data } = porps;
    const { user } = useConfig();
    const { body, changeBody, header } = useTableContext();

    const [error, setError] = useState("")
    const [files, setFiles] = useState([])
    const [start, setStart] = useState(false)
    const [progress, setProgress] = useState(0)
    const [tempFiles, setTempFiles] = useState([])

    const handleClose = () => {
        setFiles([]);
        setTempFiles([]);
        close(false);
    };

    const setValue = (newValue) => {
        setFiles([...files, ...newValue])
    }

    const handleSubmit = async () => {
        setStart(true)
        let form = new FormData()
        for (let file of files) {
            form.append('file', file)
        }
        try {
            const res = await fileAxios('table/upload', form, setProgress)
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
            setFiles([]);
            setTempFiles([]);
            close(false);
        } catch (e) {
            return;
        }
        setStart(false);
    }

    return (
        <div>
            <Dialog
                maxWidth='md'
                open={open}
                sx={{ "& .MuiDialog-paper": { width: '100%' } }}
                onClose={handleClose}
            >
                <DialogTitle >
                    File Upload
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            position: 'relative',
                            '& input:focus+div': {
                                borderStyle: 'solid',
                            }
                        }}
                    >
                        <Box
                            sx={{
                                lineHeight: 0,
                                ...(error && {
                                    border: '1px solid #f23a3c',
                                    boxShadow: '0 0 3px #f23a3c',
                                    '&:hover': {
                                        borderColor: '#fe8e92',
                                        boxShadow: '0 0 0 2px #ffa5a5',
                                    }
                                })
                            }}
                        >
                            {
                                !start &&
                                <label>
                                    <input
                                        multiple
                                        type="file"
                                        id='file'
                                        name='file'
                                        onChange={async (e) => {
                                            e.preventDefault()
                                            e.target.blur()

                                            let files = e.target.files;
                                            for (let i = 0; i < files.length; i++) {
                                                let file = files[i]
                                                let type = file.name.split('.').pop();
                                                if (!type) type = file.type.split('/')[1];
                                                if (file.size > 167772160) {
                                                    setError(`${file.name.length > 14 ? file.name.slice(0, 7) + '...' + file.name.slice(-7) : file.name} is too large, maximum file size is 20MB.`)
                                                    return;
                                                }
                                                if (!fileTypes.includes(type)) {
                                                    setError(`${file.name} has invalid extension. Only ${fileTypes.join(", ")} are allowed.`)
                                                    return;
                                                }
                                            }

                                            let moreTemp = [];
                                            for (let i = 0; i < files.length; i++) {
                                                let file = files[i];
                                                let type = file.name.split('.').pop();
                                                if (!type) type = file.type.split('/')[1]
                                                console.log(type)
                                                if (imgTypes.includes(type)) {
                                                    let base64 = await fileToBase64(file)
                                                    moreTemp.push({ name: file.name, size: bytesToSize(file.size, 1), base64 })
                                                } else {
                                                    moreTemp.push({ name: file.name, size: bytesToSize(file.size, 1) })
                                                }
                                            }

                                            setValue(e.target.files)
                                            setTempFiles([...tempFiles, ...moreTemp])
                                            e.target.value = ''

                                            if (error) {
                                                setError('')
                                            }
                                        }}
                                        style={{
                                            height: '132px',
                                            position: 'absolute',
                                            width: '100%',
                                            top: 0,
                                            left: 0,
                                            opacity: 0,
                                            cursor: 'pointer',
                                            fontSize: 0,
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            pointerEvents: 'none',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            direction: 'ltr',
                                            color: '#C96100',
                                            borderColor: "rgba(201, 97, 0, 0.77)",
                                            backgroundColor: '#fbfcff',
                                            border: '1px dashed',
                                            borderRadius: '4px',
                                            height: '132px',
                                            fontSize: '18px',
                                            top: '0',
                                            left: '0',
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            fontWeight: '600',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            wordBreak: 'break-word',
                                            '&:before': {
                                                backgroundImage: 'url(/browse_file.svg)',
                                                content: '""',
                                                width: '39px',
                                                height: '28px',
                                                marginBottom: '16px',
                                                backgroundRepeat: 'no-repeat',
                                            },
                                            '&:hover': {
                                                borderColor: 'rgba(201, 97, 0, 0.5)',
                                                boxShadow: '0 0 0 2px rgb(201 97 0 / 25%)',
                                            },
                                            '&:focus': {
                                                borderColor: '#c96100',
                                                boxShadow: '0 0 0 3px rgb(201 97 0 / 25%)',
                                            }
                                        }}
                                    >
                                        Browse File
                                        <Typography
                                            sx={{
                                                display: { xs: 'none', sm: 'initial' },
                                                fontSize: '14px',
                                                color: '#FF913E',
                                                fontWeight: '400',
                                                marginTop: '6px',
                                            }}
                                        >
                                            Drag and drop files here
                                        </Typography>
                                        <Typography
                                            sx={{
                                                display: { xs: 'initial', sm: 'none' },
                                                fontSize: '14px',
                                                color: '#FF913E',
                                                fontWeight: '400',
                                                marginTop: '6px',
                                            }}
                                        >
                                            Choose a file
                                        </Typography>
                                    </Box>
                                </label>
                            }
                            <Box sx={{ pt: tempFiles.length ? '6px' : '0px' }}>
                                {tempFiles.map((file, index) => {
                                    return <Box sx={{ mt: '10px' }} key={index}>
                                        <Stack direction="row">
                                            <Stack
                                                direction={'row'}
                                                sx={{
                                                    backgroundColor: '#dae6ff',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    color: 'white',
                                                    borderRadius: '4px',
                                                    alignItems: 'center',
                                                    flexGrow: 1,
                                                }}
                                            >
                                                <Box sx={{ p: '8px' }}>
                                                    <img
                                                        alt='upload'
                                                        src={file.base64 || File}
                                                        style={{
                                                            padding: file.base64 ? '0px' : '6px',
                                                            background: file.base64 ? 'transparent' : 'rgb(255, 255, 255)',
                                                            display: 'block',
                                                            objectPosition: 'center',
                                                            objectFit: 'cover',
                                                            width: '25px',
                                                            height: '25px',
                                                            border: '1px solid',
                                                            borderRadius: '4px',
                                                            borderColor: '#b5c2db',
                                                        }}
                                                    />
                                                </Box>
                                                <span style={{ flexGrow: 1 }}>
                                                    {file.name}
                                                </span>
                                                <span style={{ padding: '0 10px' }}>
                                                    {file.size}
                                                </span>
                                            </Stack>

                                            <Button component='span'
                                                onClick={() => {
                                                    setFiles(files.filter((file, i) => i !== index))
                                                    setTempFiles(tempFiles.filter((temp, i) => i !== index))
                                                }}
                                                sx={{
                                                    backgroundColor: '#dce5f6',
                                                    backgroundImage: `url(${Delete})`,
                                                    width: '32px',
                                                    borderRadius: '4px',
                                                    backgroundSize: '12px',
                                                    backgroundPosition: '50%',
                                                    marginLeft: '5px',
                                                    backgroundRepeat: 'no-repeat',
                                                    color: 'transparent',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </Stack>
                                    </Box>
                                })}
                            </Box>
                            {
                                start &&
                                <LinearProgress sx={{ mt: 2 }} variant="determinate" value={progress} />
                            }
                        </Box>
                        {
                            error &&
                            <Box sx={{ width: '100%', p: 1, mt: 1, borderRadius: 1, bgcolor: theme => theme.palette.error.light }}>
                                {error}
                            </Box>
                        }
                    </Box >
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button variant='contained' color='error' onClick={handleClose}>Cancel</Button>
                    <Button variant='contained' onClick={handleSubmit} disabled={!files.length} autoFocus>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
