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

export default function EditSet({ onClose, open }) {

  const path = useHistory();

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const context = useContext(GlobalContext);
  const { set, tracks } = context.setData;

  const [updateSet, setupdateSet] = useState({ Title: set.title, Description: set.description })
  const [oldTracks, setOldTracks] = useState({ updateTitles: {}, updateDescriptions: {}, todelete: {} });

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

    setOldTracks(tracksNow);
  }

  const handleUpdateSet = ({ target }) => {
    setupdateSet({ ...updateSet, [target.name]: target.value });
  }

  
  const deleteSet = async () => {
    await generalFetch("sets/"+set.id, "DELETE");
    path.push(`/sets/${Object.keys(context.sets)[0]}`);
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
      const editedCollection = { ...context.collection };
      editedCollection.set.title = form.updateSet.Title;
      editedCollection.set.description = form.updateSet.Description;
      Object.keys(form.oldTracks.updateTitles).forEach(key =>
        editedCollection.tracks[key].title = form.oldTracks[key].Title);
      Object.keys(form.oldTracks.updateDescriptions).forEach(key =>
        editedCollection.tracks[key].description = form.oldTracks[key].Description);

      context.setCollection(editedCollection)
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
                <TextField variant="outlined" fullWidth label="New title" name="Title" placeholder="Add new title"></TextField>
                <TextField variant="outlined" fullWidth multiline rows={2} label="New description" name="Description" placeholder="Add new description"></TextField>
              </FormGroup>
            </CardContent>
          </Card>
          <FormGroup row onChange={handleOldTracks}>
            {existingTracksList}
          </FormGroup>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmission}>Submit</Button>
          <Button color="inherit" onClick={deleteSet}>Delete</Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  )
}

function DropZone({ getRootProps, getInputProps }) {

  return (
    <Card variant="outlined" square>
      <CardContent style={{ padding: "0", backgroundColor: "lightgray" }}>
        <div style={{ padding: "2em" }}{...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div>Drag 'n' drop / click to upload</div>
          <em>(Only audio will be accepted)</em>
        </div>
      </CardContent>
    </Card>
  )
}