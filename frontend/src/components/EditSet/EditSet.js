import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormGroup, FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import { Button, IconButton, Dialog, DialogTitle, DialogContent, Card, CardContent, TextField } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';

import generalFetch from '../../utilities/generalFetch';

import GlobalContext from '../../context/GlobalContext';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function EditSet({ onClose, setList, open }) {

  const path = useHistory();

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const context = useContext(GlobalContext);
  const { set, tracks } = context.setData;

  const [updateSet, setupdateSet] = useState({ Title: set.title, Description: set.description })
  const [oldTracks, setOldTracks] = useState({ updateTitles: {}, updateDescriptions: {}, todelete: {} });
  const [deletions, setDeletions] = useState(0);

  useEffect(() => {
    setOldTracks({ updateTitles: {}, updateDescriptions: {}, todelete: {} });
    setupdateSet({ Title: set.title, Description: set.description });
  }, [set]);

  const handleClose = () => {
    onClose();
  }

  const handleOldTracks = ({ target }) => {
    const tracksNow = { ...oldTracks };
    const id = target.id.split(' ')[1];
    tracksNow[target.name][id] = target.value || target.checked;
    if (target.name === `todelete`) {setDeletions(Object.keys(oldTracks.todelete).filter(k => oldTracks.todelete[k]).length)}
    setOldTracks(tracksNow);
  }

  const handleUpdateSet = ({ target }) => {
    setupdateSet({ ...updateSet, [target.name]: target.value });
  }

  
  const deleteSet = async () => {
    await generalFetch("sets/"+set.id, "DELETE");
    try {
      path.push(`/sets/${setList.map(set => set.id)[0] || 1}`);
    } catch {
      path.push('/');
    }
    onClose();
    window.location.reload();
  }

  const handleSubmission = async (event) => {
    
    const formdata = new FormData();

    const form = {
      updateSet,
      oldTracks,
    }

    formdata.append("form", JSON.stringify(form))

    try {
      const feedback = await generalFetch(`sets/${set.id}/`, "PATCH", formdata);
      console.log(feedback);
    }
    catch (error) {
      console.log(error);
    };
    window.location.reload(); 
    onClose();
  };

  const existingTracksList = Object.keys(tracks).map((key) => (
    <FormControl key={key} fullWidth={true}>
      <FormControlLabel
        label={`Delete ${tracks[key].title}`}
        control=
        {<Checkbox
          name="todelete"
          checkedIcon={<ClearIcon />}
          key={`del ${key}`}
          id={`del ${key}`}
          checked={!!oldTracks.todelete[key]} />}
      />
      <TextField
        variant="outlined"
        label="New title"
        name="updateTitles"
        key={`et ${key}`} id={`et ${key}`} />
      <TextField
        variant="outlined"
        multiline rows={2}
        label="New description"
        name="updateDescriptions"
        placeholder={tracks[key].description}
        key={`ed ${key}`} id={`ed ${key}`} />
    </FormControl>
  ))
  

  return (
    <Dialog maxWidth="md" onClose={handleClose} open={open} fullScreen={fullScreen} scroll="body">

      <DialogTitle>
        Edit {set.title}
        <IconButton className={classes.closeButton} aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl onSubmit={handleSubmission} >
          <Card square>
            <CardContent>
              <FormGroup row onChange={handleUpdateSet}>
                <TextField 
                  label="New title (50)" 
                  variant="outlined" 
                  fullWidth 
                  name="Title" 
                  InputProps={{ inputProps: {maxlength: 50}}}
                  placeholder="Add new title" />
                <TextField 
                  label="New description (250)" 
                  variant="outlined" 
                  fullWidth 
                  multiline rows={3} 
                  InputProps={{ inputProps: {maxlength: 250}}}
                  name="Description" 
                  placeholder="Add new description"></TextField>
              </FormGroup>
            </CardContent>
          </Card>
          <FormGroup row onChange={handleOldTracks}>
            {existingTracksList}
          </FormGroup>
          <Button name="save" type="submit" variant="contained" color="primary" onClick={handleSubmission}>Save {deletions > 0 ? `(${deletions} deletions)` : ``}</Button>
          <Button color="inherit" onClick={deleteSet}>Delete set</Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  )
}