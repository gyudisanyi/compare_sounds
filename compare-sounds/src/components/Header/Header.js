import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import LibraryMusicTwoToneIcon from '@material-ui/icons/LibraryMusicTwoTone';
import IconButton from '@material-ui/core/IconButton';
import GlobalContext from '../../context/GlobalContext';

import About from '../About/About';
import EditSet from '../EditSet/EditSet';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();

  const context = useContext(GlobalContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleMenuClick =  async (event, add) => {
    if(add) {console.log(add)};
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (id) => {
    setAnchorEl(null);
    console.log(id)
    context.changeCurrentSet(id);
  };

  const newSet = async () => {
    setAnchorEl(null);
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}sets/new/`,
      {
        method: 'POST',
      }
    );
    const response = await res.json();
    console.log("YsdfsdfsdfsdfOOOO");
    context.changeCurrentSet(response.insertId);
  }

  const handleAboutOpen = () => {
    setAboutOpen(true);
  }

  const handleAboutClose = () => {
    setAboutOpen(false);
  }

  const handleEditOpen = () => {
    setAnchorEl(null);
    setEditOpen(true);
  }

  const handleEditClose = () => {
    setEditOpen(false);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleMenuClick}>
           <LibraryMusicTwoToneIcon />
          </IconButton>
          <Menu
            id="collections-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
          {context.sets.map((set)=>(<MenuItem key={set.id} onClick={()=>handleMenuClose(set.id)}>{set.title}</MenuItem>))}
          <hr />
          <MenuItem key="addset" id="addset" onClick={newSet}>Add new set</MenuItem>
          </Menu>
          <Typography variant="h6" className={classes.title}>
            {context.collection.set.title}            
          <Button color="inherit" onClick={handleEditOpen}>Edit</Button>
          <EditSet open={editOpen} onClose={handleEditClose} />
          </Typography>
          <Button color="inherit" onClick={handleAboutOpen}>About</Button>
          <About open={aboutOpen} onClose={handleAboutClose} />
        </Toolbar>
      </AppBar>
    </div>
  );
}