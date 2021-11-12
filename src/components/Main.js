import React from 'react'
import Grid from './Grid'
import {Navbar, Container} from 'react-bootstrap'


const Main = () => {
    return (
        <div className="Main">
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>
                    <img
                    alt=""
                    src="/rito.svg"
                    width="100"
                    height="30"
                    className="d-inline-block align-top"
                    />{' '}
                Path finder
                </Navbar.Brand>
            </Navbar>
            <Grid/>
        </div>
    )
}

export default Main;