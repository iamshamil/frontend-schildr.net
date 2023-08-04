import { useContext, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { TableContext } from '../../../../contexts/table';
import { ConfigContext } from '../../../../contexts/config';
import { updateLog, updateRow } from '../../../../utilis/request';

const LongText = (props) => {
    const { data, position, onModal, status, isDel, group } = props;
    const { header, body, modalChange, changeBody, editabled } = useContext(TableContext);
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
            <TextField
                variant="outlined"
                defaultValue={value}
                multiline
                disabled={true}
                rows={4}
                sx={{
                    width: '100%',
                    height: '100%',
                    '& .MuiInputBase-multiline': { height: '100%' },
                    '& textarea': { padding: .5, height: '100% !important', fontSize: 13, },
                }} />
        )
    } else {
        if (status && group === 'active' && header[position[1]].editable) {
            return (
                <TextField
                    variant="outlined"
                    autoFocus
                    defaultValue={value}
                    multiline
                    disabled={true}
                    rows={2}
                    sx={{
                        width: '100%',
                        height: '100%',
                        '& .MuiInputBase-multiline': { height: '100%' },
                        '& fieldset': { display: onModal ? 'block' : 'none' },
                        '& textarea': { padding: onModal ? .5 : 0, height: '100% !important', fontSize: 13, },
                    }} />
            )
        } else {
            return (
                <Box sx={{ p: '6px' }}>
                    <Typography component='div' sx={{ userSelect: 'none', overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#111111', cursor: 'default' }}>
                        {value}
                    </Typography>
                </Box>
            )
        }
    }
}

export default LongText;