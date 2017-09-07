import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import NavBar from './public/NavBar'
import AsideBar from './public/AsideBar'
import ChangePwd from './public/ChangePwd'
import { getProfile } from '../utils/userProfile'

export default class App extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const profile = getProfile();

        if (!profile) {
            this.props.router.replace({
                pathname: SCHOOLPAL_CONFIG.ROOTPATH + 'login',
                state: { nextPathname: this.props.location.pathname }
            })
        }
    }

    render() {
        const profile = getProfile();

        if (!profile) {
            return null
        }

        if (this.props.children) {
            return this.props.children
        } else {
            return (
                <div className="view">
                    <NavBar isSignin={true} />
                    <AsideBar router={this.props.router} />
                    <div className="main">
                        <p className="h6 p-3 b-b">当前登陆用户：{getProfile().name}</p>
                        <div className="main-container">
                            <ChangePwd />
                        </div>
                    </div>
                </div>
            )
        }
    }
}