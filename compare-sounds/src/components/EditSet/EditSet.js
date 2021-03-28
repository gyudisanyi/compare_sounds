import React, { useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FormGroup, FormLabel, FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import { Typography, Button, IconButton, DialogTitle, Dialog, Card, CardContent, TextField } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import GlobalContext from '../../context/GlobalContext';

export default function EditSet({ onClose, open }) {
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const context = useContext(GlobalContext);

  const [nameDescr, setNameDescr] = useState({newTitle: context.collection.set.title, newDescription: context.collection.set.description})
  console.log({nameDescr}, "NIIII");
  const [newTracks, setNewTracks] = useState({titles: [], descriptions: []});
  const [oldTracks, setOldTracks] = useState({titles: {}, descriptions: {}, todelete: {}});

  console.log(Object.keys(oldTracks.titles).filter((k) => oldTracks.titles[k]).join(','))

  const handleClose = () => {
    onClose();
  }

  const handleNewTracks = ({target}) => {
    console.log({target});
    const tracksNow= {...newTracks};
    const id = target.id.split(' ')[1];
    tracksNow[target.name][id]=target.value;
    console.log({tracksNow});
    setNewTracks(tracksNow);
  }

  const handleOldTracks = ({target}) => {
    console.log({target});
    console.log(target.id, target.name, target.value, target.checked);
    const tracksNow= {...oldTracks};
    const id = target.id.split(' ')[1];
    tracksNow[target.name][id]=target.value || target.checked;
    console.log({tracksNow});
    setOldTracks(tracksNow);
  }
  
  const handleNewNameDescr = ({target}) => {
    console.log({target});
    setNameDescr({ ...nameDescr, [target.name]: target.value });
  }


  const handleSubmission = async (event) => {
    
    event.preventDefault();

    console.log({newTracks}, {nameDescr}, {oldTracks});
    
    const data = new FormData();
    acceptedFiles.forEach((file) => data.append("File", file));
    data.append("Title", nameDescr.newTitle);
    data.append("Description", nameDescr.newDescription);
    newTracks.titles.forEach((title) => {
      data.append("Tracktitles", title);
    });
    newTracks.descriptions.forEach((descr) => {
      data.append("Trackdescriptions", descr);
    });
    data.append("AlteredTitles", Object.keys(oldTracks.titles).filter((k) => !!oldTracks.titles[k]).join(','));
    data.append("AlteredDescriptions", Object.keys(oldTracks.descriptions).filter((k) => !!oldTracks.descriptions[k]).join(','));
    Object.keys(oldTracks.titles).forEach((key) => {
      data.append("OldTracktitles", oldTracks.titles[key]);
    });
    Object.keys(oldTracks.descriptions).forEach((key) => {
      data.append("OldTrackdescriptions", oldTracks.descriptions[key]);
    });

    data.append("ToDelete", Object.keys(oldTracks.todelete).filter(k => oldTracks.todelete[k]).join(','));

    try {
      let response = await fetch(
      `${process.env.REACT_APP_API_URL}sets/${context.currentSet}/`,
      {
        method: 'PATCH',
        body: data,
      }
    );
    console.log({response})}
    catch(error) {
      console.log(error);
    };
    onClose();
  };

  const existingTracksList = context.collection.tracks.map((t) => (
    <div>
    <FormControlLabel
      control={<Checkbox name="todelete" checkedIcon={<ClearIcon />} key={`del ${t.id}`} id={`del ${t.id}`} checked={!!oldTracks.todelete[t.id]}/>}
      label=""/>
    <TextField name="titles" defaultValue={t.title} key={`et ${t.id}`} id={`et ${t.id}`}></TextField>
    <TextField name="descriptions" defaultValue={t.description} key={`ed ${t.id}`} id={`ed ${t.id}`}></TextField>
    </div>)
  )

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: 'audio/*' });

  const acceptedFileItems = acceptedFiles.map((file, i) => (
    <div key={i} width="100%">{file.path}<br/>
    <TextField name="titles" key={`t ${i}`} id={`t ${i}`}></TextField>
    <TextField name="descriptions" key={`d ${i}`} id={`d ${i}`}></TextField>
    </div>
  ));

  return (
    <Dialog onClose={handleClose} open={open} fullScreen={fullScreen} scroll="body">
      <Card>
        <CardContent>
        
          <DialogTitle>Edit {context.collection.set.title}
          <IconButton aria-label="close" position="absolute" right="10px" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          </DialogTitle>

          <Typography variant="body2">
            <FormControl onSubmit={handleSubmission}>
            <FormLabel component="legend">Edit title, description</FormLabel>
            <FormGroup onChange={handleNewNameDescr}>
              <TextField name="newTitle" placeholder={context.collection.set.title} defaultValue={context.collection.set.title}></TextField>
              <TextField name="newDescription" defaultValue={context.collection.set.description}></TextField>
            </FormGroup>
            <hr/>
            <FormLabel component="legend">Delete tracks</FormLabel>
              <FormGroup row onChange={handleOldTracks}>
                {existingTracksList}
              </FormGroup>
              <FormLabel component="legend">Upload tracks</FormLabel>
              <Card variant="outlined">
                <Typography variant="caption" align="center">
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop or click to select some files</p>
                    <em>(Only audio will be accepted)</em>
                  </div>
                </Typography>
              </Card>
              <FormGroup onChange={handleNewTracks}>
                {acceptedFileItems}
              </FormGroup>
            <Button type="submit" variant="contained" onClick={handleSubmission}>Submit</Button>
            </FormControl>
          </Typography>
        </CardContent>
      </Card>
    </Dialog>
  )
}