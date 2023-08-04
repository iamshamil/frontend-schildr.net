import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { getFirstData } from '../../utilis/request';

import Loading from '../../components/Loading';
import GridTabs from './GridTabs';
import SubTools from './SubTools';
import TableContent from './TableContent';
import UserManagement from '../../components/UserManagement';

import useConfig from '../../hooks/useConfig';
import useTableContext from '../../hooks/useTable';
import { makeHeaderData } from '../../utilis/util';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Main = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { user } = useConfig();
    const { initData, users, setUsers, tableName } = useTableContext();

    const [headerNames, setHeaderNames] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            let data = await getFirstData({ userId: user._id, projectId });
            if (data.status) {
                data = data.data;
                let me = data.users.filter((e) => e._id === user._id)[0];
                let hId = data.header._id ?? "";

                const header = await makeHeaderData(me, hId, user, data.header.row);
                const users = data.users.map((one) => {
                    if (!one.allowed) one.allowed = {}
                    if (!one.editable) one.editable = {}
                    if (!one.showList) one.showList = {}
                    if (!one.allowIds) one.allowIds = {}
                    if (!one.myTable) one.myTable = []
                    return one;
                })

                setUsers(users);
                setHeaderNames(data.headers);
                initData({ header, hId, body: data.body, notifications: data.notification, project: data.project });
                setLoading(true)
            } else {
                toast.error(data.message)
                navigate('/')
            }
        })()
        // eslint-disable-next-line
    }, [])

    return (
        <Stack sx={{ width: '100%', height: '100%' }}>
            <GridTabs headerNames={headerNames} setHeaderNames={setHeaderNames} />

            <Stack sx={{ width: '100%', height: '100%' }}>
                <SubTools active={tableName === 'User Management'} />

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
                                                {
                                                    headerNames.length ?
                                                        <TableContent /> : <Box />
                                                }
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

export default Main;