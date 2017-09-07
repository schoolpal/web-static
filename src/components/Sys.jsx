import React from 'react'
import NavBar from './public/NavBar'
import AsideBar from './public/AsideBar'


export default class Sys extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="view">
                <NavBar router={this.props.router} isSignin={true} />
                <AsideBar router={this.props.router} />
                <div className="main">
                    {this.props.children}
                </div>
            </div>
        )
    }
}