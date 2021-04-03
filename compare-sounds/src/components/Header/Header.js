import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
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

  const path = useHistory();
  const context = useContext(GlobalContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleMenuClick =  async (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (id) => {
    setAnchorEl(null);
    if (context.sets.map((set)=>set.id).includes(id)) {
      context.changeCurrentSet(id);
      path.push(`/sets/${id}`);
    }
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
    path.push(`/sets/${response.insertId}`);
    setEditOpen(true);
  }

  const deleteSet = async () => {
    setAnchorEl(null);
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}sets/${context.collection.set.id}`,
      {
        method: 'DELETE',
      }
    );
    await res.json();
    path.push(`/sets/${context.sets[0].id}`);

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
          {context.sets[0] ? context.sets.map((set)=>(<MenuItem key={set.id} onClick={()=>handleMenuClose(set.id)}>{set.title}</MenuItem>)) : "ajjajj"}
          <hr />
          <MenuItem disabled={context.URL==="../"} key="addset" id="addset" onClick={newSet}>Add new set</MenuItem>
          </Menu>
          <Typography variant="h6" className={classes.title}>
            {context.URL==="../" ? "OFFLINE :O " : ""}{context.collection.set.title}            
          <Button disabled={context.URL==="../"} color="inherit" onClick={handleEditOpen}>Edit</Button>
          <Button disabled={context.URL==="../"} color="inherit" onClick={deleteSet}>Delete</Button>
          <EditSet open={editOpen} onClose={handleEditClose} />
          </Typography>
          <Button color="inherit" onClick={handleAboutOpen}>About</Button>
          <About open={aboutOpen} onClose={handleAboutClose} />
        </Toolbar>
      </AppBar>
    </div>
  );
}