import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import NavBar from './public/NavBar'
import AsideBar from './public/AsideBar'
import { permissions } from '../utils/api'
import errorHandle from '../utils/errorHandle'

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLaoding: true
        }
    }

    componentWillMount() {
        permissions().done(() => {
            this.setState({
                isLaoding: false
            })
        }).fail((data) => {
            errorHandle({ data: data, router: this.props.router })
        })
    }

    render() {
        if (this.state.isLaoding === true) {
            return (
                <div className="view">
                    <NavBar />
                    <AsideBar router={this.props.router} />
                    <div className="main">
                        <p className="p3">权限初始化中...</p>
                    </div>
                </div>
            )
        } else {
            if (this.props.children) {
                return (
                    <div className="view">
                        {this.props.children}
                    </div>
                )
            } else {
                return (
                    <div className="view">
                        <NavBar router={this.props.router} isSignin={true} />
                        <AsideBar router={this.props.router} />
                        <div className="main">
                            <h5>控制台</h5>
                        </div>
                    </div>
                )
            }
        }
    }
}