import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {GridList, GridListTile, Button} from '@material-ui/core';
import SetListItem from './SetListItem';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
  },
  gridListTile: {
    height: 120,
    width: '40%',
    overflow: 'hidden',
  },
}));

export default function SetList({sets, username}) {

  const path = useHistory();

  console.log(sets)
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cellHeight={150} cols={2} className={classes.gridList}>
        {sets.map((set) => (
          <>
            <GridListTile key={set.id} className={classes.gridListTile}>
              <Button onClick={() => path.push('sets/' + set.id)}>go</Button>
              <SetListItem set={set} />
            </GridListTile>          
          </>
        ))}
      </GridList>
    </div>


  )
}
