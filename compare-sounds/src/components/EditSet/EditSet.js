import React, { useEffect, useCallback, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FormGroup, FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import { Button, IconButton, Dialog, DialogTitle, DialogContent, Card, CardHeader, CardContent, TextField } from '@material-ui/core';
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

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const context = useContext(GlobalContext);

  const [Files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setFiles([...Files, ...acceptedFiles])
  }, [Files])

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'audio/*' });

  const [updateSet, setupdateSet] = useState({ Title: context.collection.set.title, Description: context.collection.set.description })
  const [newTracks, setNewTracks] = useState({ titles: {}, descriptions: {} });
  const [oldTracks, setOldTracks] = useState({ updateTitles: {}, updateDescriptions: {}, todelete: {} });

  useEffect(() => {
    setNewTracks({ titles: {}, descriptions: {} });
    setOldTracks({ updateTitles: {}, updateDescriptions: {}, todelete: {} });
    setupdateSet({ Title: context.collection.set.title, Description: context.collection.set.description });
  }, [context.collection.set]);

  const handleClose = () => {
    onClose();
  }

  const handleNewTracks = ({ target }) => {
    const tracksNow = { ...newTracks };
    const id = target.id.split(' ')[1];
    tracksNow[target.name][id] = target.value || id;
    setNewTracks(tracksNow);
  }

  const removeFile = (file) => {
    const newFiles = [...Files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
    const tracksNow = { ...newTracks };
    delete tracksNow.titles[file.name];
    delete tracksNow.descriptions[file.name];
    setNewTracks(tracksNow);
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

  const handleSubmission = async (event) => {

    event.preventDefault();
    
    const formdata = new FormData();

    Files.forEach((file) => newTracks.titles[file.name] = newTracks.titles[file.name] || file.name );
    Files.forEach((file) => newTracks.descriptions[file.name] = newTracks.descriptions[file.name] || "Add description pliz" );

    const form = {
      updateSet,
      oldTracks,
      newTracks
    }

    Files.forEach((file) => formdata.append("Files", file));
    formdata.append("form", JSON.stringify(form))

    try {
      const feedback = await generalFetch(`sets/${context.collection.set.id}/`, "PATCH", formdata);
      console.log(feedback);
      const editedCollection = {...context.collection};
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
    if (Files) {console.log("FILES"); window.location.reload();}
    onClose();
  };

  const existingTracksList = Object.keys(context.collection.tracks).map((key) => (
    <div>
      <FormControlLabel
        control={<Checkbox name="todelete" checkedIcon={<ClearIcon />} key={`del ${key}`} id={`del ${key}`} checked={!!oldTracks.todelete[key]} />}
        label="" />
      <TextField label={`New title for ${context.collection.tracks[key].title}`} name="updateTitles" placeholder={context.collection.tracks[key].title} key={`et ${key}`} id={`et ${key}`}></TextField>
      <TextField label="Description" name="updateDescriptions" placeholder={context.collection.tracks[key].description} key={`ed ${key}`} id={`ed ${key}`}></TextField>
    </div>)
  )

  const acceptedFileItems = Files.map((file) => (
    <div key={file.name} id={`b${file.name}`} width="100%">
      <Button key={file.name} onClick={() => removeFile(file)}><ClearIcon /></Button>
      <TextField label={`${file.name} title`} name="titles" defaultValue={file.name} key={`t ${file.name}`} id={`t ${file.name}`}></TextField>
      <TextField label="Description" name="descriptions" defaultValue="Add description" key={`d ${file.name}`} id={`d ${file.name}`}></TextField>
    </div>
  ));

  return (
    <Dialog maxWidth="sm" onClose={handleClose} open={open} fullScreen={fullScreen} scroll="body">

      <DialogTitle>
        Edit {context.collection.set.title}
        <IconButton className={classes.closeButton} aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl onSubmit={handleSubmission}>
          <Card square>
            <CardContent>
              <FormGroup row onChange={handleUpdateSet}>
                <TextField label="New title" name="Title" placeholder="Add new title"></TextField>
                <TextField label="New description" name="Description" placeholder="Add new description"></TextField>
              </FormGroup>
            </CardContent>
          </Card>

          <Card square>
            <CardHeader subheader="Delete or update existing tracks" />
            <CardContent>
              <FormGroup row onChange={handleOldTracks}>
                {existingTracksList}
              </FormGroup>
            </CardContent>
          </Card>

          <DropZone getRootProps={getRootProps} getInputProps={getInputProps} />

          <FormGroup onChange={handleNewTracks}>
            {acceptedFileItems}
          </FormGroup>

          <Button type="submit" variant="contained" onClick={handleSubmission}>Submit</Button>

        </FormControl>
      </DialogContent>
    </Dialog>
  )
}

function DropZone({ getRootProps, getInputProps }) {

  return (
    <Card>
      <CardContent style={{ backgroundColor: "antiquewhite" }}>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div>Drag 'n' drop / click to upload</div>
          <em>(Only audio will be accepted)</em>
        </div>
      </CardContent>
    </Card>
  )
}