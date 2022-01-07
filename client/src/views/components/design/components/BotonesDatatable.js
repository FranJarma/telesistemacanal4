import { IconButton, Menu, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';

const BotonesDatatable = ({botones}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
    <>
        <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
    >
        <i className='bx bx-dots-vertical'></i>
    </IconButton>
        <Menu
        style={{boxShadow: 'none'}}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        {botones}
        </Menu>
    </>
);
}
 
export default BotonesDatatable;