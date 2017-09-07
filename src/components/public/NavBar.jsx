import React from 'react';
import ReactDOM from 'react-dom';
import { Link, browserHistory } from 'react-router';
import { logout } from '../../utils/api';
import Dialog from './Dialog';
import { clearProfile } from '../../utils/userProfile'

export default class NavBar extends React.Component {
    constructor(props) {
        super(props)
        this.confrimSignout = this.confrimSignout.bind(this)
        this.signout = this.signout.bind(this)
    }

    confrimSignout() {
        const div = document.createElement('div');

        ReactDOM.render(
            <Dialog
                container={div}
                text="是否退出系统？"
                action={this.signout}
            />,
            document.body.appendChild(div)
        )
    }

    signout() {
        logout()
        clearProfile()
        browserHistory.replace(SCHOOLPAL_CONFIG.ROOTPATH + 'login')
    }

    render() {
        if (this.props.isSignin) {
            return (
                <nav className="navbar navbar-inverse bg-primary">
                    <form>
                        <Link to={SCHOOLPAL_CONFIG.ROOTPATH} className="text-white">校客</Link>
                        <button type="button" onClick={this.confrimSignout} className="btn btn-warning float-right">
                            <i className="fa fa-sign-out fa-lg" aria-hidden="true"></i> 退出系统
                        </button>
                    </form>
                </nav>
            )
        } else {
            return (
                <nav className="navbar navbar-inverse bg-primary">
                    <form>
                        <a className="text-white">校客</a>
                    </form>
                </nav>
            )
        };
    }
}