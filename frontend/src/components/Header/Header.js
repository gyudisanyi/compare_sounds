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

import generalFetch from '../../utilities/generalFetch';

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

    const handleMenuClick = async (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (id) => {
    setAnchorEl(null);
    if (Object.keys(context.sets).includes(id) || id === context.currentSet) {
      context.changeCurrentSet(id);
      path.push(`/sets/${id}`);
    }
  };
  
  const handleEditOpen = () => {
    setAnchorEl(null);
    setEditOpen(true);
  }

  const handleEditClose = () => {
    setEditOpen(false);
  }
  const newSet = async () => {
    setAnchorEl(null);
    const res = await generalFetch("sets/new", "POST");
    console.log(res.newSetId);
    context.changeCurrentSet(res.newSetId);
    path.push(`/sets/${res.newSetId}`);
    setEditOpen(true);
  }

  
  const Reload = () => {
    path.push(`/sets/${Object.keys(context.sets)[0] || 1}`);
    window.location.reload();
  }
  
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <EditSet open={editOpen} onClose={handleEditClose} />
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
            {Object.keys(context.sets).length > 0 ? Object.keys(context.sets).map((key) => (<MenuItem key={key} onClick={() => handleMenuClose(key)}>{context.sets[key].title}</MenuItem>)) : "ajjajj"}
            <hr />
            <MenuItem disabled={context.url === "../"} key="addset" id="addset" onClick={newSet}>Add new set</MenuItem>
          </Menu>
          <Typography variant="h6" className={classes.title}>
            {context.collection.set.title}
            {parseInt(localStorage.getItem('userid')) === context.collection.set.user_id
              ?
              <>
                <Button color="inherit" onClick={handleEditOpen}>Edit</Button>
              </>
              :
              ` by ${context.collection.set.username}`
            }
            {context.url === "../"
              ?
              <Button color="inherit"
                onClick={Reload}>
                Reload
              </Button>
              : ``}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}