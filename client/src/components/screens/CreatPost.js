import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Alerts from './Alerts'
import { useHistory } from 'react-router-dom'


const CreatPost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

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
                        history.push('/')
                        // <Alerts type="sucess" message="Created post successfully" />
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])
    const postDetails = () => {
        const formData = new FormData()
        formData.append("file", image)
        formData.append("upload_preset", "insta-clone")
        formData.append("cloud_name", "sitanshu")
        fetch("https://api.cloudinary.com/v1_1/sitanshu/image/upload", {
            method: 'post',
            body: formData
        }).then(res => res.json())
            .then(data => {
                console.log(data.url)
                setUrl(data.url)
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <>
            <div className="card input-filed">
                <TextField id="standard-basic" label="Title" value={title} onChange={(event) => { setTitle(event.target.value) }} />
                <TextField id="standard-basic" label="Body" value={body} onChange={(event) => { setBody(event.target.value) }} />
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Image</span>
                        <input type="file"  onChange={(event) => { setImage(event.target.files[0]) }} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action" onClick={() => postDetails()} >Submit</button>

            </div>
        </>
    )
}
export default CreatPost