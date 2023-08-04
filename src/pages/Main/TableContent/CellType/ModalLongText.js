import { useContext, useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import { TableContext } from '../../../../contexts/table';
import { ConfigContext } from '../../../../contexts/config';
import { updateLog, updateRow } from '../../../../hooks/request';

const ModalLongText = (props) => {
    const { data, status, position, isDel } = props;
    const { body, changeBody, header } = useContext(TableContext);
    const { user } = useContext(ConfigContext);
    const [value, setValue] = useState(data.data);

    const saveData = async (params, old, rowId) => {
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
    /* eslint-disable */
    useEffect(() => {
        if (status === false) {
            if (value !== data.data && !isDel) {
                let t = { data: body };
                let rowId = t.data[position[0]]._id;
                let old = t.data[position[0]].row[position[1]].data;
                t.data[position[0]].row[position[1]].data = value;
                // saveData(t.data[position[0]], old, rowId);
                // changeBody(t.data);
            }
        }
    }, [status])

    useEffect(() => {
        setValue(data.data);
    }, [data.data])
    /* eslint-enable */

    return (
        <TextField
            variant="outlined"
            defaultValue={value}
            multiline
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            sx={{
                width: '100%',
                height: '100%',
                '& .MuiInputBase-multiline': { height: '100%' },
                '& textarea': { padding: .5, height: '100% !important', fontSize: 13, },
            }} />
    )
}

export default ModalLongText;