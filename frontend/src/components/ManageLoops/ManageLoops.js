import React, { useEffect, useContext, useState } from 'react';
import { FormGroup, FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import { Button, Input, IconButton, Dialog, DialogTitle, DialogContent, Card, CardHeader, CardContent, TextField } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';

import GlobalContext from '../../context/GlobalContext';
import generalFetch from '../../utilities/generalFetch';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function ManageLoops({ onClose, open }) {

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const context = useContext(GlobalContext);

  const handleClose = () => {
    onClose();
  }

  const [loops, setLoops] = useState(context.collection.loops);

  useEffect(() => {
    setLoops(context.collection.loops);
  }, [context.collection.loops])

  function handleChange({ target }) {
    const act = target.id.split(' ')[0];
    const key = target.id.split(' ')[1];
    const updatedLoops = { ...loops }
    updatedLoops[key][act] = target.value || target.checked;
    console.log(updatedLoops);
    setLoops(updatedLoops);
    return;
  }

  async function submitLoops() {
    console.log(loops);
    const loopsData = {
      loops,
      deleted: Object.keys(loops).filter((k) => loops[k].deleted)
    }
    if (!loopsData.deleted[0]) {delete loopsData.deleted};
    const res = await generalFetch('loops/'+context.collection.set.id, "PATCH", loopsData)
    console.log(res);
  }

  const loopList = Object.keys(loops).map((key) =>
    <FormControl fullWidth={true}>
      <FormControlLabel
        control=
        {<Checkbox
          name="delete"
          checkedIcon={<ClearIcon />}
          key={`deleted ${key}`}
          id={`deleted ${key}`}
          checked={!!loops[key].deleted} />}
          label="Delete" />
      <TextField
        margin="dense"
        variant="outlined"
        size="small"
        label="description"
        defaultValue={loops[key].description}
        id={`description ${key}`} />
      <TextField
        margin="dense"
        variant="outlined"
        size="small"
        label="start"
        type="number"
        id={`start ${key}`}
        value={loops[key].start}>
        Start
    </TextField>
      <TextField
        margin="dense"
        variant="outlined"
        size="small"
        label="end"
        type="number"
        id={`end ${key}`}
        value={loops[key].end}>
        End
      </TextField>
    </FormControl>
  )

  return (
    <Dialog maxWidth="m" onClose={handleClose} open={open} fullScreen={fullScreen} scroll="body">
      <DialogTitle>
        Manage loops
        <IconButton className={classes.closeButton} aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormGroup onChange={handleChange}>
          {loopList}
        </FormGroup>
        <Button variant="contained" label="Submit" onClick={submitLoops}>Submit</Button>
      </DialogContent>
    </Dialog>
  )

}
