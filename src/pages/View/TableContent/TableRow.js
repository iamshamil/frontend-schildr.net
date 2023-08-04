import React from 'react'
import Stack from '@mui/material/Stack';

import FirstCell from './FirstCell'
import Cell from './Cell'
import useTableContext from '../../../hooks/useTable';


const TableRow = ({ group, row, y, popup, visible, setVisible, setOrder, isFixed }) => {
    const { header, body } = useTableContext();

    const handleContextMenu = (event) => {
        event.preventDefault();
        setVisible(true);
        setOrder({ id: row._id, index: row.order });
        if (popup.current) {
            const clickX = event.clientX;
            const clickY = event.clientY;
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            const rootW = 200;
            const rootH = 193;
            // const rootW = popup.current.offsetWidth;
            // const rootH = popup.current.offsetHeight;

            const right = (screenW - clickX) > rootW;
            const left = !right;
            const top = (screenH - clickY) > rootH;
            const bottom = !top;

            if (right) {
                popup.current.style.left = `${clickX + 5}px`;
            }

            if (left) {
                popup.current.style.left = `${clickX - rootW - 5}px`;
            }

            if (top) {
                popup.current.style.top = `${clickY - 120}px`;
            }

            if (bottom) {
                popup.current.style.top = `${clickY - rootH - 130}px`;
            }
        }
    };

    const makeRow = (data, id) => {
        if (header.length) {
            let res = [];
            if (isFixed) {
                res.push(<FirstCell order={row.order} id={id} key={y + '_'} y={y} group={group} />)
            }

            let endOrder = header.filter((e) => e.allowed);
            if (endOrder.length) {
                endOrder = endOrder.reduce((max, one) => max.order > one.order ? max : one);
            } else {
                endOrder = { order: 0 }
            }

            for (let i = 0; i < data.length; i++) {
                let cellData;
                switch (header[i].type) {
                    case 'createdAt':
                        cellData = { data: row.createdAt, search: false };
                        break;
                    case 'updatedAt':
                        cellData = { data: row.updater ? row.updatedAt : null, search: false };
                        break;
                    case 'createdBy':
                        cellData = { data: row.creator, search: false };
                        break;
                    case 'updatedBy':
                        cellData = { data: row.updater, search: false };
                        break;
                    default:
                        cellData = data[i];
                        break;
                }

                if (header[i].hide || !header[i].allowed) continue;

                let idx = body.findIndex((e) => e._id === id);

                if (isFixed && header[i].fixed) {
                    res.push(
                        <Cell
                            cssClass={header[i].order === endOrder.order ? ' last' : ''}
                            key={y + '_' + i}
                            group={group}
                            rorder={data.order}
                            order={header[i].order}
                            type={header[i].type}
                            width={header[i].width}
                            data={cellData}
                            position={[idx, i]}
                            popup={popup}
                            visible={visible}
                            setVisible={setVisible}
                            setOrder={setOrder}
                            handleContextMenu={handleContextMenu}
                        />
                    )
                } else if (!isFixed && !header[i].fixed) {
                    res.push(
                        <Cell
                            cssClass={header[i].order === endOrder.order ? ' last' : ''}
                            key={y + '_' + i}
                            group={group}
                            rorder={data.order}
                            order={header[i].order}
                            type={header[i].type}
                            width={header[i].width}
                            data={cellData}
                            position={[idx, i]}
                            popup={popup}
                            visible={visible}
                            setVisible={setVisible}
                            setOrder={setOrder}
                            handleContextMenu={handleContextMenu}
                        />
                    )

                }
            }
            return res;
        } else {
            return null;
        }
    }

    return (
        <Stack direction='row'
            className='grid-row'
            sx={{
                // order: row.order,
                height: 32,
                width: '100%',
                '&:hover': {
                    '& .show-head': { opacity: 1 },
                    '& .row-num': { opacity: 0 },
                    '& .cell': {
                        bgcolor: '#f8f8f8',
                    }
                }
            }}>
            {
                makeRow(row.row, row._id)
            }
        </Stack>
    )

}
export default TableRow;