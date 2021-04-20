import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles'
import {
  Dialog,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
} from '@material-ui/core';

import TheApp from './TheApp';
import WhatsNext from './WhatsNext';
import TheAuthor from './TheAuthor';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function About({ onClose, open }) {

  const handleClose = () => {
    onClose();
  }

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="The app" {...a11yProps(0)} />
            <Tab label="What's next" {...a11yProps(1)} />
            <Tab label="The author" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <TheApp/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <WhatsNext />
        </TabPanel>
          <TabPanel value={value} index={2}>
          <TheAuthor />
        </TabPanel>
      </div>
    </Dialog>
  )
}