import React, { useContext, useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
// import M from 'materialize-css'
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AppBar from '@material-ui/core/AppBar';

const useStyles2 = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 860,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
}));

const Navbar = () => {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [search, setSearch] = React.useState()
    const [findUser, setFindUser] = React.useState([])

    const searchRef = useRef()
    const useStyles = makeStyles((theme) => ({
        root: {
          flexGrow: 1,
        },
        menuButton: {
          marginRight: theme.spacing(2),
        },
        title: {
          flexGrow: 1,
          display: 'none',
          [theme.breakpoints.up('sm')]: {
            display: 'block',
          },
        },
        search: {
          position: 'relative',
          borderRadius: theme.shape.borderRadius,
          backgroundColor: fade(theme.palette.common.white, 0.15),
          '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
          },
          marginLeft: 0,
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
          },
        },
        searchIcon: {
          padding: theme.spacing(0, 2),
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        inputRoot: {
          color: 'inherit',
        },
        inputInput: {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
              width: '20ch',
            },
          },
        },
      }));
    const handleClick = (event) => {
        setAnchorEl(event.current);

    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const classes = useStyles();
    const classes2 = useStyles2();
    const renderlist = () => {
        if (state) {
            return [<li><div className={classes.root}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase ref={searchRef}
                        onChange={(e) => {
                            searchUser(e.target.value)
                        }}
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </div>
            </div>
            </li>
                ,
            <li><Link key='2' to="/profile">Profile</Link></li>,
            <li><Link key='3' to="/creatpost">Create Post</Link></li>,
            <li><Link key='3' to="/myfollowingpost">My Following Post</Link></li>,
            <li>
                <button className="btn waves-effect waves-light #f44336 red" type="submit" name="action" onClick={() => {
                    localStorage.clear()
                    dispatch({ type: null })
                    history.push('/login')
                }}>LogOut</button>

            </li>
            ]
        } else {
            return [
                <li><Link key='4' to="/login">Login</Link></li>,
                <li><Link key='5' to="/signup">Signup</Link></li>,
            ]
        }
    }
    const searchUser = (name) => {
        setSearch(name)
        fetch(`/search-user`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                name
            })
        }).then(res => res.json())
            .then(result => {
                setFindUser(result)
                console.log(findUser)
                if(!findUser.length==0)
                handleClick(searchRef)
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <>
            <nav>
                <div className="nav-wrapper">
                    <Link key='6' to={state ? "/" : "/login"} className="brand-logo">Instagram</Link>
                    <ul id="nav-mobile" className="right ">
                        {renderlist()}
                    </ul>
                </div>
            </nav>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <List className={classes2.root} >
                    {
                        <ul className={classes2.ul}>
                            {findUser.map((item) => (
                                <ListItem >
                                   <Link to={item._id !== state._id ? "/profile/" + item._id : "/profile"}> <ListItemText primary={` ${item.name}`} /></Link>
                                </ListItem>
                            ))}
                        </ul>
                    }
                </List>
            </Popover>
        </>
    )
}
export default Navbar