import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';

const CheckBoxCell = (props) => {
    const { data, position, onModal, } = props;
    const [value, setValue] = useState(data.data);

    /* eslint-disable */
    useEffect(() => {
        setValue(data.data);
    }, [position, data.data])
    /* eslint-enable */

    if (onModal) {
        return (
            <Checkbox disabled={true} checked={value} sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: 28 } }} />
        )
    } else {
        return (<Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Checkbox disabled={true} checked={value} sx={{ p: '0px !important', '& .MuiSvgIcon-root': { fontSize: 28 } }} />
        </Box>)
    }
}

export default CheckBoxCell;