import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars(props) {
  const classes = useStyles();
  const { alert, SetAlert } = props

//   const [open, setOpen] = React.useState(alert.isopen);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    SetAlert("");
  };
  return (
    <div className={classes.root}>
      <Snackbar open={alert.isopen} autoHideDuration={6000}  onClose={handleClose}>
        <Alert variant="filled" severity={alert.type}  onClose={handleClose} >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
