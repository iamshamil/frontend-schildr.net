import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';

import TableBody from './TableBody';
import { addButtonWidth, allCheckWidth, scrollWidth } from '../../../config/constant';
import useTableContext from '../../../hooks/useTable';

const TableContent = () => {
    const { header, isAdmin } = useTableContext();
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
    }, [header, isAdmin])

    const { mainW, } = data;

    return (
        <Box sx={{
            top: 56,
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