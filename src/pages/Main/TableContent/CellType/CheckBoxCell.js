import { useContext, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { TableContext } from '../../../../contexts/table';
import { updateRow, updateLog } from '../../../../utilis/request';
import { ConfigContext } from '../../../../contexts/config';

const CheckBoxCell = (props) => {
    const { data, position, onModal, group } = props;
    const { header, body, changeBody, } = useContext(TableContext);
    const { user } = useContext(ConfigContext);
    const [value, setValue] = useState(data.data);

    const saveRequest = async (params, val, rowId) => {
        let rdata = await updateRow({ data: params, updater: user._id });
        if (rdata.status) {
            let log = {
                type: 'activity',
                old: !val,
                rowId,
                new: val,
                dataType: 'checkBox',
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

    const saveData = (e) => {
        let t = { data: body };
        let rowId = t.data[position[0]]._id;
        t.data[position[0]].row[position[1]].data = e.target.checked;

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

        saveRequest(t.data[position[0]], e.target.checked, rowId);
        changeBody(t.data);
    }

    /* eslint-disable */
    useEffect(() => {
        setValue(data.data);
    }, [position, data.data])
    /* eslint-enable */

    if (onModal) {
        return (
            <Checkbox disabled={group !== 'active' ? true : (!header[position[1]].editable)} checked={value} onChange={saveData} sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: 28 } }} />
        )
    } else {
        return (<Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Checkbox disabled={group !== 'active' ? true : (!header[position[1]].editable)} checked={value} onChange={saveData} sx={{ p: '0px !important', '& .MuiSvgIcon-root': { fontSize: 28 } }} />
        </Box>)
    }
}

export default CheckBoxCell;