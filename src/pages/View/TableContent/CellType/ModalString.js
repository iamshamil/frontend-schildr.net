import { useContext, useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import { TableContext } from '../../../../contexts/table';
import { updateLog, updateRow } from '../../../../hooks/request';
import { ConfigContext } from '../../../../contexts/config';

const ModalString = (props) => {
    const { data, position, status } = props;
    const { header, body, changeBody, modalChange } = useContext(TableContext);
    const { user, } = useContext(ConfigContext);
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
            if (value !== data.data && !modalChange) {
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
                
                saveData(t.data[position[0]], old, rowId);
                changeBody(t.data);
            }
        }
    }, [status])

    useEffect(() => {
        setValue(data.data);
    }, [data.data])
    /* eslint-enable */

    return (
        < TextField
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{
                width: '100%',
                height: '100%',
                '& input': { height: '100%', p: 1.5, fontSize: 13, },
            }} />
    )
}

export default ModalString;