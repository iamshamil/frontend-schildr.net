import { useContext, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import { TableContext } from '../../../contexts/table';

import TableBody from './TableBody';
import { ConfigContext } from '../../../contexts/config';
import { addButtonWidth, allCheckWidth, scrollWidth } from '../../../config/constant';

const TableContent = () => {
    const { header, isAdmin } = useContext(TableContext);
    const { user } = useContext(ConfigContext);
    const [data, setData] = useState({
        fixedHeader: [],
        rightHeader: [],
        mainW: 0
    });

    useEffect(() => {
        let fixed = [], right = [];
        for (let item of header) {
            if (item.fixed) {
                fixed.push(item)
            } else {
                right.push(item)
            }
        }
        let mainW = isAdmin ? addButtonWidth + allCheckWidth : allCheckWidth + scrollWidth;
        for (const one of header) {
            if (!one.hide && one.allowed) {
                mainW += one.width;
            }
        }
        mainW = mainW > window.screen.width ? mainW : window.screen.width
        setData({ fixedHeader: fixed, rightHeader: right, mainW })
    }, [header, user.role, isAdmin])

    const { mainW, } = data;

    return (
        <Box sx={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
            overflow: 'auto',
        }}>
            <TableBody mainW={mainW} />
        </Box >
    )
}

export default TableContent;