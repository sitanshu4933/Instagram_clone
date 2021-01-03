import { Container } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'


const NotFound = () => {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-5">
                        <h5>404 ! Page not found</h5>
                        <Link to="/"> <h6>click here to go home page....</h6></Link>
                    </div>
                </div>
            </div>
        </>
    )
}
export default NotFound