import { useContext, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { TableContext } from '../../../../contexts/table';
import { updateRow, updateLog } from '../../../../utilis/request';
import { ConfigContext } from '../../../../contexts/config';

const SimpleString = (props) => {
    const { data, position, onModal, status, isDel, group } = props;
    const { header, body, modalChange, changeBody, editable, editabled, } = useContext(TableContext);
    const { user } = useContext(ConfigContext);
    const [value, setValue] = useState(data.data);

    const saveRequest = async (params, old, rowId) => {
        let rdata = await updateRow({ data: params, updater: user._id });
        if (rdata.status) {
            let log = {
                type: 'activity',
                old,
                rowId,
                new: value,
                dataType: 'string',
                sign: { [user._id]: true },
                creator: user,
                cellName: header[position[1]].name,
                cellId: data.id,
                columnId: header[position[1]].id
            }
            updateLog(log);
        } else {
            alert('server error!');
        }
    }

    const saveData = () => {
        let t = { data: body };
        let rowId = t.data[position[0]]._id;
        let old = t.data[position[0]].row[position[1]].data;
        t.data[position[0]].row[position[1]].data = value;

        if (t.data[position[0]].updater?._id !== user._id) {
            let temp = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                color: user.color
            }
            t.data[position[0]].updater = temp;
        }
        t.data[position[0]].updatedAt = new Date();

        saveRequest(t.data[position[0]], old, rowId);
        changeBody(t.data);
    }

    /* eslint-disable */
    useEffect(() => {
        if (value !== data.data && !isDel) {
            if ((onModal && status === false) || (editabled === position.join('_'))) {
                saveData();
            }
        }
        setValue(data.data);
    }, [editabled, position, modalChange, status, onModal, isDel, data.data])
    /* eslint-enable */

    if (onModal) {
        return (
            < TextField
                variant="outlined"
                disabled={true}
                value={value}
                sx={{
                    width: '100%',
                    height: '100%',
                    '& input': { height: '100%', p: 1.5, fontSize: 13, },
                }} />
        )
    } else {
        if (editable === position.join('_') && group === 'active' && header[position[1]].editable) {
            return (
                < TextField
                    variant="outlined"
                    value={value}
                    sx={{
                        width: '100%',
                        height: '100%',
                        '& fieldset': { display: 'none' },
                        '& input': { height: '100%', p: 1, fontSize: 13, },
                    }} />
            )
        } else {
            return (<Box sx={{ p: '6px' }}>
                <Typography component='div' sx={{ userSelect: 'none', overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#111111', cursor: 'default' }}>
                    {value}
                </Typography>
            </Box>)
        }
    }
}

export default SimpleString;