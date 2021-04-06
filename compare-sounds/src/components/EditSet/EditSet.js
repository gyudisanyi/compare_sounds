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
  
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setFiles([...files, ...acceptedFiles])
  }, [files])

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'audio/*' });


  const [nameDescr, setNameDescr] = useState({ newTitle: context.collection.set.title, newDescription: context.collection.set.description })
  const [newTracks, setNewTracks] = useState({ titles: [], descriptions: [] });
  const [oldTracks, setOldTracks] = useState({ titles: {}, descriptions: {}, todelete: {} });

  const handleClose = () => {
    onClose();
  }

  useEffect(() => {
    setNewTracks({ titles: [], descriptions: [] });
    setOldTracks({ titles: {}, descriptions: {}, todelete: {} });
    setNameDescr({ newTitle: context.collection.set.title, newDescription: context.collection.set.description });
  }, [context.collection.set]);

  const handleNewTracks = ({ target }) => {
    const tracksNow = { ...newTracks };
    const id = target.id.split(' ')[1];
    tracksNow[target.name][id] = target.value || files[id].name;
    console.log(tracksNow);
    setNewTracks(tracksNow);
  }

  const removeFile = file => {
    const newFiles = [...files];    
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  }

  const handleOldTracks = ({ target }) => {
    const tracksNow = { ...oldTracks };
    const id = target.id.split(' ')[1];
    tracksNow[target.name][id] = target.value || target.checked;
    setOldTracks(tracksNow);
  }

  const handleNewNameDescr = ({ target }) => {
    setNameDescr({ ...nameDescr, [target.name]: target.value });
  }

  const handleSubmission = async (event) => {

    event.preventDefault();

    const data = new FormData();
    files.forEach((file) => data.append("File", file));
    data.append("Title", nameDescr.newTitle || context.collection.set.title);
    data.append("Description", nameDescr.newDescription || context.collection.set.description);
    const nutitles = [...Array(files.length)].map((u,i) => newTracks.titles[i] || files[i].name);
    nutitles.forEach((title) => {
      data.append("Tracktitles", title);
    });
    const nudesc = [...Array(files.length)].map((u,i) => newTracks.descriptions[i] || "No description");
    nudesc.forEach((descr) => {
      data.append("Trackdescriptions", descr);
    });
    data.append("AlteredTitles", Object.keys(oldTracks.titles).filter((k) => !!oldTracks.titles[k]).join(','));
    data.append("AlteredDescriptions", Object.keys(oldTracks.descriptions).filter((k) => !!oldTracks.descriptions[k]).join(','));
    Object.keys(oldTracks.titles).forEach((key) => {
      data.append("OldTrackTitles", oldTracks.titles[key]);
    });
    Object.keys(oldTracks.descriptions).forEach((key) => {
      data.append("OldTrackDescriptions", oldTracks.descriptions[key]);
    });

    data.append("ToDelete", Object.keys(oldTracks.todelete).filter(k => oldTracks.todelete[k]).join(','));

    console.log("TRYY", context.currentSet, context.collection.set.id)

    try {
      let response = await generalFetch(`sets/${context.collection.set.id}/`, "PATCH", data);
      console.log({ response })
    }
    catch (error) {
      console.log(error);
    };
    window.location.reload();
    onClose();
  };

  const existingTracksList = context.collection.tracks.map((t) => (
    <div>
      <FormControlLabel
        control={<Checkbox name="todelete" checkedIcon={<ClearIcon />} key={`del ${t.id}`} id={`del ${t.id}`} checked={!!oldTracks.todelete[t.id]} />}
        label="" />
      <TextField label={`New title for ${t.title}`} name="titles" placeholder={t.title} key={`et ${t.id}`} id={`et ${t.id}`}></TextField>
      <TextField label="Description" name="descriptions" placeholder={t.description} key={`ed ${t.id}`} id={`ed ${t.id}`}></TextField>
    </div>)
  )

  const acceptedFileItems = files.map((file, i) => (
    <div key={file.path} id={`b${i}`} width="100%">
      <Button key={file.path} onClick={() => removeFile(file)}><ClearIcon /></Button>
      <TextField label={`${file.path} title`} name="titles" defaultValue={file.name} key={`t ${i}`} id={`t ${i}`}></TextField>
      <TextField label="Description" name="descriptions" defaultValue="Add description" key={`d ${i}`} id={`d ${i}`}></TextField>
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
              <FormGroup row onChange={handleNewNameDescr}>
                <TextField label="New title" name="newTitle" placeholder="Add new title"></TextField>
                <TextField label="New description" name="newDescription" placeholder="Add new description"></TextField>
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