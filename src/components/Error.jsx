import React from 'react';
import NavBar from './public/NavBar'
import AsideBar from './public/AsideBar'

export default class Error extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="view">
                <NavBar isSignin={true} />
                <AsideBar router={this.props.router} />
                <div className="main">
                    <div className="main-container">
                        <p className="mt-3">
                            {this.props.router.location.state && this.props.router.location.state.text ? this.props.router.location.state.text : '您访问的页面不存在 ！'}
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}