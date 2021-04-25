import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Button,
  Snackbar } from '@material-ui/core';
import LibraryMusicTwoToneIcon from '@material-ui/icons/LibraryMusicTwoTone';
import ShareIcon from '@material-ui/icons/Share';
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

  const context = useContext(GlobalContext);
  const { set } = context.setData;
  const { own } = set;
  const [setList, getSetList] = useState({});
  const [message, setMessage] = useState();
  const [published, setPublished] = useState(set.published);

  const path = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await generalFetch("user/" + set.username, "GET");
        if (response.message) setMessage(response.message);
        if (response.data) getSetList(Object.values(response.data));

      } catch (error) {
        if (error.message) setMessage(error.message);
        console.log({ error })
      }
    }
    fetchData();
  }, [])

  const publish = async () => {
    await generalFetch('publish/'+set.id, 'PATCH');
    setPublished(p => !p)
  }

  const handleMenuClick = async (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (id) => {
    setAnchorEl(null);
    if (setList.map(set => set.id).includes(id) || id === set.id) {
      path.push(`/sets/${id}`);
      window.location.reload();
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
    path.push(`/sets/${res.newSetId}`);
    setEditOpen(true);
  }

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const share = () => {
    handleClick();
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        {set
          ?
          <>
            <EditSet open={editOpen} setList={setList} onClose={handleEditClose} />
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
                {setList.length > 0 ?
                  setList.map((set) =>
                  (<MenuItem key={set.id}
                    onClick={() => handleMenuClose(set.id)}>
                    {set.title}
                  </MenuItem>))
                  : "No sets to list"}
                {own ?
                <>
                  <hr />
                  <MenuItem key="addset" id="addset" onClick={newSet}>Add new set</MenuItem>
                </>
                  : ``}
              </Menu>
              <Typography variant="h6" className={classes.title}>
                {`${set.title} `}
                {own
                  ?
                  <>
                    <Button variant={"contained"} color={published ? "secondary" : "default"} onClick={publish}>{published ? ` Published ` : ` Click to publish `}</Button>{`  `} 
                    <Button variant="contained" color="primary" onClick={handleEditOpen}>{` Edit `}</Button>
                  </>
                  :
                  ` by ${set.username}`
                }
              </Typography>
              <IconButton color="inherit" edge="end" onClick={share}><ShareIcon /></IconButton>
            </Toolbar>
          </>
          : <Typography variant="h6" className={classes.title}>
            {message || `No such set`}
        </Typography>
        }
      </AppBar>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        message="Link copied to clipboard!"
      />
    </div>
  );
}