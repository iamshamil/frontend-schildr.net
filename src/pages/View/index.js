import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getInviteData } from '../../utilis/request';

import Loading from '../../components/Loading';
import TableContent from './TableContent';
import UserManagement from '../../components/UserManagement';

import useTableContext from '../../hooks/useTable';
import { useParams } from 'react-router-dom';

const View = () => {
    const { id } = useParams();
    const { initData, users, setUsers } = useTableContext();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        (async () => {
            let data = await getInviteData(id);
            if (data.status) {
                data = data.data;
                const hId = data.header._id ?? "";
                const header = data.header.row;
                const users = data.users;
                setName(data.header.name);
                setUsers(users);
                initData({ header, hId, body: data.body, notifications: [] });
                setLoading(true)
            }
        })()
        // eslint-disable-next-line
    }, [])

    return (
        <Stack sx={{ width: '100%', height: '100%' }}>
            <Stack sx={{ width: '100%', height: '100%' }}>
                <Stack sx={{ height: '100%', width: '100%', bgcolor: '#f5f5f5' }}>
                    <Stack sx={{ height: '100%', flex: '1 1 auto' }}>
                        <Stack sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                            <Box sx={{ height: '100%', width: '100%', bgcolor: '#f7f7f7', }}>
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    zIndex: 4,
                                    overflow: 'hidden',
                                    opacity: 1,
                                }}>
                                    {
                                        loading && users.length ?
                                            <>
                                                <Box sx={{ width: '100%', position: 'absolute', top: 0, letf: 0, right: 0, bgcolor: (theme) => theme.palette.primary.main }}>
                                                    <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ height: 56, px: 2 }}>
                                                        <Stack direction='row' alignItems='center'>
                                                            <Stack direction='row' alignItems='center'>
                                                                <Link href='/' sx={{ display: 'flex' }}>
                                                                    <Typography sx={{ fontSize: 20, color: "#fff" }}>{name}</Typography>
                                                                </Link>
                                                            </Stack>
                                                        </Stack>
                                                    </Stack>

                                                </Box >
                                                <TableContent />
                                            </>
                                            :
                                            <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Loading />
                                            </Box>
                                    }
                                </Box>
                            </Box>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <UserManagement />
        </Stack>
    )
}

export default View;