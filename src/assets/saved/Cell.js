import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useRef } from 'react';
import { TableContext } from '../../contexts/table';

const activeStyle = {
    boxSizing: "content-box",
    border: "1px solid transparent",
    mt: "-1px",
    pr: 0,
    borderRight: 0,
    boxShadow: "0 0 0 2px #2d7ff9 !important",
    borderRadius: "1px",
    zIndex: "100000 !important"
}

const Cell = (props) => {
    const wrapperRef = useRef(null);
    const { data, width, border, position } = props
    const { active, selectActive } = useContext(TableContext);

    const style = {
        width: width,
        height: 32,
        bgcolor: '#fff',
        borderBottom: '1px solid #dde1e3',
        borderLeft: border ? 'none' : '1px solid #dde1e3',
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                selectActive("")
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, selectActive]);

    return (
        <Stack
            ref={wrapperRef}
            onClick={() => selectActive(position)}
            sx={
                active === position ? {
                    ...style,
                    ...activeStyle,
                } :
                    style
            }
        >
            <Box sx={{ p: '6px' }} >
                <Typography component='div' sx={{ cursor: 'default', overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#111111' }}>
                    {data.data}
                </Typography>
            </Box>
        </Stack>
    )
}

export default Cell;