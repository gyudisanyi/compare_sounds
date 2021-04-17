import React from 'react';
import { DialogTitle, Dialog, Card, CardContent, Button, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

import generalFetch from '../../utilities/generalFetch';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

const requestHeaders = {
  Accept: 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
}

export default function UploadImage({ onClose, open, setId, trackId }) {

  const classes = useStyles();

  const getUploadParams = ({ file, meta }) => {
    const url = process.env.REACT_APP_API_URL+'img/'+setId;
    const body = new FormData()
    body.append('Files', file);
    body.append('Id', trackId);
    return { url, method: "PATCH", headers: requestHeaders, body, meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` } }
  }

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
    window.location.reload();
    onClose();
    
  }

  const handleClose = () => {
    onClose();
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <Card>
        <CardContent>
          <DialogTitle>
            Upload image
            <IconButton className={classes.closeButton} aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Dropzone
            getUploadParams={getUploadParams}
            maxFiles={1}
            multiple={false}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            accept="image/*"
            inputContent={(files, extra) => (extra.reject ? 'Image files only' : 'Drag Files')}
            styles={{
              dropzone: { width: 400, height: 200 },
              dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
              inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
            }}
          />
        </CardContent>
      </Card>
    </Dialog>
  )

}
