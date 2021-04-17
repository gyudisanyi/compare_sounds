import React, { useContext } from 'react';
import { DialogTitle, Dialog, Card, CardContent, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import GlobalContext from '../../context/GlobalContext';

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

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

export default function UploadTracks({ onClose, open, maxFiles }) {

  const context = useContext(GlobalContext);
  const setId = context.setData.set.id;
  const classes = useStyles();

  const getUploadParams = ({ file, meta }) => {
    const url = process.env.REACT_APP_API_URL+'sounds/'+setId;
    const body = new FormData()
    body.append('Files', file);
    body.append('durations', meta.duration);
    return { url, method: "POST", headers: requestHeaders, body, meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` } }
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
            Upload tracks
            <IconButton className={classes.closeButton} aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Dropzone
            getUploadParams={getUploadParams}
            maxFiles={maxFiles}
            multiple={true}
            inputWithFilesContent={(files, extra) => (extra.reject ? 'Audio files only' :`${maxFiles - files.length} more`)}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            accept="audio/*"
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
