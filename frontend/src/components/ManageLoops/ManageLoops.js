import React, { useEffect, useContext, useState } from 'react';
import { FormGroup, FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import { Button, Box, Input, IconButton, Dialog, DialogTitle, DialogContent, TextField } from '@material-ui/core';
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
  const { loops, set } = context.setData;

  const handleClose = () => {
    onClose();
  }

  const [loopset, setLoops] = useState(loops);

  useEffect(() => {
    setLoops(loops);
  }, [])

  function handleChange({ target }) {
    const act = target.id.split(' ')[0];
    const key = target.id.split(' ')[1];
    const updatedLoops = { ...loopset }
    updatedLoops[key][act] = target.value || target.checked;
    console.log(updatedLoops);
    setLoops(updatedLoops);
    return;
  }

  async function submitLoops() {
    console.log(loopset);
    const loopsData = {
      loops: loopset,
      deleted: Object.keys(loopset).filter((k) => loopset[k].deleted)
    }
    if (!loopsData.deleted[0]) {delete loopsData.deleted};
    const res = await generalFetch('loops/'+set.id, "PATCH", loopsData)
    console.log(res);
    window.location.reload();
    onClose();
  }

  const loopList = Object.keys(loopset).map((key) =>
    <FormControl key={key}>
      <FormControlLabel
        control=
        {<Checkbox
          name="delete"
          checkedIcon={<ClearIcon />}
          key={`deleted ${key}`}
          id={`deleted ${key}`}
          checked={!!loopset[key].deleted} />}
          label="Delete" />
      <TextField
        margin="dense"
        variant="outlined"
        size="small"
        label="description"
        defaultValue={loopset[key].description}
        id={`description ${key}`} />
      <Box width={60}>
      <TextField fullWidth
        type="number"
        margin="dense"
        variant="outlined"
        style={{width: '1/4'}}
        size="small"
        label="start"
        id={`start ${key}`}
        value={loopset[key].start}>
        Start
      </TextField>
      </Box>
      <Box width={60}>

      <TextField
        margin="dense"
        variant="outlined"
        width={60}
        size="small"
        label="end"
        type="number"
        id={`end ${key}`}
        value={loopset[key].end}>
        End
      </TextField>
      </Box>
    </FormControl>
  )

  return (
    <Dialog maxWidth="md" onClose={handleClose} open={open} fullScreen={fullScreen} scroll="body">
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
