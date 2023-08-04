import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const DateCell = ({ data }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                disabled={true}
                value={data.data}
                onChange={() => false}
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