import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
// import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { UserContext } from '../../App'
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: "26px auto"
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
    size: "small"
  },
}));

export default function RecipeReviewCard(data) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [newData, setData] = useState([])
  const { state, dispatch } = useContext(UserContext)

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const likePost = (id) => {
    fetch('/like', {
      method: 'put',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postid: id
      })
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        const newData = data.post.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(err => {
        console.log(err)
      })
  }
  const unlikePost = (id) => {
    fetch('/unlike', {
      method: 'put',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postid: id
      })
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        const newData = data.post.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(err => {
        console.log(err)
      })
  }
  const makecomment = (text, postid) => {
    fetch('/comment', {
      method: 'put',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        text,
        postid
      })
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        const newData = data.post.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(err => {
        console.log(err)
      })
  }
  const deletepost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: 'delete',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        const newData = data.post.filter(item => {
         return item._id !== result._id
        })
        setData(newData)
      }).catch(err => {
        console.log(err)
      })
  }
  const deletecomment = (commentId, postid) => {
    fetch('/deletecomment', {
      method: 'put',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        commentId,
        postid
      })
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        const newData = data.post.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(err => {
        console.log(err)
      })
  }
  return (
    data.post.map(item => {
      return (
        <Card className={classes.root}>
          <CardHeader
            avatar={<Avatar src={item.postedby.pic} aria-label="recipe" className={classes.avatar} />
            }
            action={item.postedby._id == state._id &&
              <Fab color="secondary" aria-label="edit">
                <DeleteIcon onClick={()=>deletepost(item._id)} />
              </Fab>
            }
            title={item.postedby.name}
            subheader={item.title}
          />
          <CardMedia
            className={classes.media}
            image={item.photo}
            title="Paella dish"
          />
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            {item.likes.includes(state._id) ?
              <ThumbDownIcon onClick={() => unlikePost(item._id)} /> :
              <ThumbUpIcon onClick={() => likePost(item._id)} />
            }
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {item.likes.length} likes
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {item.body}
            </Typography>
            {
              item.comments.map(comment => {
                return (
                  <>
                  <p><span>{comment.postedby.name}:</span> {comment.text} <DeleteIcon onClick={()=>deletecomment(comment._id,item._id)}/> </p>
                  </>
                )
              })
            }
            <form onSubmit={(event) => {
              event.preventDefault()
              makecomment(event.target[0].value, item._id)
            }}>
              <input type="text" placeholder="Enter your comments" />
            </form>
          </CardContent>
        </Card>
      )
    })
  );
}