import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Alerts from './Alerts'
import { useHistory } from 'react-router-dom'
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));
const CreatPost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [alert, setAlert] = useState({ isopen: false, type: '', message: '' })
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);


    useEffect(() => {
        if (url) {
            fetch("/creatpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo: url
                })
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.error) {
                        return <Alerts type="error" message="Error" />
                    }
                    else {
                        SetAlert({ isopen: true, type: "success", message: "Post created successfully" })
                        setTimeout(() => {
                            history.push('/')
                        }, 4000);
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])
    const postDetails = () => {
        if (!title || !body || !image) {
            return SetAlert({ isopen: true, type: "error", message:"Plz fillup all the fields" })
        } else {
            setOpen(!open)
            const formData = new FormData()
            formData.append("file", image)
            formData.append("upload_preset", "insta-clone")
            formData.append("cloud_name", "sitanshu")
            fetch("https://api.cloudinary.com/v1_1/sitanshu/image/upload", {
                method: 'post',
                body: formData
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        return SetAlert({ isopen: true, type: "error", message: data.error })
                    }
                    else {
                        console.log(data.url)
                        setUrl(data.url)
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }
    return (
        <>

            {
                <div className="mycard ">
                    <div className="card auth-card input-field">
                        <input type="text" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} ></input>
                        <input type="text" placeholder="Body" value={body} onChange={(event) => setBody(event.target.value)} ></input>
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>Upload Image</span>
                                <input type="file" onChange={(event) => { setImage(event.target.files[0]) }} />
                            </div>
                            <div className="file-path-wrapper">
                                <input value={image?.name} className="file-path validate" type="text" />
                            </div>
                        </div>
                        <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => postDetails()}>Submit</button>
                    </div>
                </div>
            }
            <Alerts alert={alert} setAlert={setAlert} />
            <Backdrop className={classes.backdrop} open={open} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}
export default CreatPost
