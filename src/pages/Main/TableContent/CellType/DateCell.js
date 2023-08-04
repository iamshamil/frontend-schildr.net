import { useContext } from 'react';

import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { TableContext } from '../../../../contexts/table';
import { ConfigContext } from '../../../../contexts/config';
import { updateRow, updateLog } from '../../../../utilis/request';

const DateCell = (props) => {
    const { data, position, group } = props;
    const { header, body, changeBody } = useContext(TableContext);
    const { user } = useContext(ConfigContext);

    const saveData = async (params, old, newVal, rowId) => {
        let rdata = await updateRow({ data: params, updater: user._id });
        if (rdata.status) {
            let log = {
                type: 'activity',
                old,
                new: newVal,
                dataType: 'date',
                sign: { [user._id]: true },
                creator: user,
                rowId,
                cellName: header[position[1]].name,
                cellId: data.id,
                columnId: header[position[1]].id
            }
            updateLog(log);
        } else {
            alert('server error!');
        }
    }

    const setValue = (value) => {
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

        saveData(t.data[position[0]], old, value, rowId);
        changeBody(t.data);
    }
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                disabled={group !== 'active' ? true : (!header[position[1]].editable)}
                value={data.data}
                onChange={(newValue) => {
                    setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params}
                    sx={{
                        width: '100%',
                        height: '100%',
                        '& fieldset': { display: 'none' },
                        '& div': { height: '100%' },
                        '& input': { padding: 0, height: '100%', px: .7, fontSize: 13, },
                    }}
                />}
            />
        </LocalizationProvider>
    )
}

export default DateCell;