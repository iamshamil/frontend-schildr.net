import { useContext, useMemo } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { TableContext } from '../../../contexts/table';
import CellType from './CellType';


const Cell = (props) => {
    const { data, handleContextMenu, width, position, type, order, group, cssClass } = props;
    const { active, selectActive, editable, selectEditable, selectEditabled, } = useContext(TableContext);

    const style = {
        order,
        zIndex: 1,
        width: width,
        bgcolor: data.search ? '#97ffa2' : '#fff',
        overflow: 'hidden',
        borderTop: '1px solid #dde1e3',
        borderRight: '1px solid #dde1e3',
    }

    const activeStyle = {
        boxSizing: "content-box",
        border: "1px solid transparent",
        mt: "-1px",
        ml: "-2px",
        pr: 0,
        borderRight: 0,
        boxShadow: type === 'multiSelect' ? "" : "0 0 0 2px #2d7ff9 !important",
        borderRadius: "1px",
        zIndex: "8 !important"
    }


    const setActive = () => {
        if (position.join('_') !== active && group === 'active') {
            selectActive(position.join('_'))
            selectEditable("");
            selectEditabled(editable);
        }
    }

    const editState = () => {
        if (type === 'attached') {
            selectActive(position.join('_'))
        } else if (type === 'select') {
            selectActive(position.join('_'))
        }
        else {
            selectEditabled(editable);
            selectEditable(position.join('_'));
        }
    }

    const handleKeyDown = (event) => {
        if (active === position.join('_') && editable !== position.join('_')) {
            if (type === 'longText' || type === 'text' || type === 'link') {
                selectEditabled(editable);
                selectEditable(position.join('_'));
            }
        }
    }

    /* eslint-disable */
    const height = useMemo(() => {
        if (editable === position.join('_') && active === position.join('_')) {
            if (type === 'longText') {
                return 142
            } else {
                return 32;
            }
        } else if (editable === position.join('_') || active === position.join('_')) {
            if (type === 'attached') {
                return 40;
            } else {
                return 32;
            }
        } else {
            return 32;
        }
    }, [editable, position])
    /* eslint-enable */
console.log('active :>> ', active);
    return (
        <Stack
            className={'cell' + cssClass}
            onClick={() => setActive()}
            onKeyDown={handleKeyDown}
            onContextMenu={handleContextMenu}
            tabIndex={position.join('-')}
            sx={active === position.join('_') && group === 'active' ?
                { ...style, ...activeStyle, height: height } :
                { ...style, height: height }}
        >
            <Box onDoubleClick={() => editState()} sx={{ height: '100%' }}>
                <CellType group={group} data={data} width={width} height={height} type={type} status={editable === position.join('_')} position={position} focus={active === position.join('_')} />
            </Box>
        </Stack>
    )
}

export default Cell;