import React from 'react';
import { DialogTitle, Dialog, Card, CardContent, Button, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import { useDropzone } from 'react-dropzone';

import generalFetch from '../../utilities/generalFetch';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function UploadImage ({ onClose, open, setId, trackId }) {

  const classes = useStyles();
  
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ multiple: false, accept: 'image/jpeg, image/png' });

  const handleSubmit = async () => {
    console.log(acceptedFiles)
    const formdata = new FormData();
    formdata.append('Id', trackId)
    formdata.append('Files', acceptedFiles[0]);
    try {
      const feedback = await generalFetch(`img/${setId}`, "PATCH", formdata);
      console.log(feedback);
    } catch (error) {
      console.log(error);
    };
    // window.location.reload();
    // onClose();
  }

  const handleClose = () => {
    onClose();
  }

  const accepted = !!acceptedFiles
  
  return (
    <Dialog maxWidth="sm" onClose={handleClose} open={open}>
      <Card>
        <CardContent>
          <DialogTitle>
            Upload image
            <IconButton className={classes.closeButton} aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>          
          </DialogTitle>
          {accepted}
          <DropZone getRootProps={getRootProps} getInputProps={getInputProps} />
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
        </CardContent>
      </Card>
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
          <em>(JPG, PNG will be accepted)</em>
        </div>
      </CardContent>
    </Card>
  )
}