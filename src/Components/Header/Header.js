import React from "react";
import {Redirect} from 'react-router-dom'

import DialogTips from "../Dialog/DialogTips";
import ReactDOM from "react-dom";

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {isLogout: false};
    this.logout = this.logout.bind(this);
    this.createDialogTips = this.createDialogTips.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if (this.tipsContainer) {
      document.body.removeChild(this.tipsContainer);
    }
  }

  createDialogTips() {
    if (this.tips === undefined) {
      this.tipsContainer = document.createElement('div');

      ReactDOM.render(
        <DialogTips
          accept={this.logout}
          title="请确认"
          text={"是否要退出本系统？"}
          ref={(dom) => {
            this.tips = dom
          }}
        />,
        document.body.appendChild(this.tipsContainer)
      );
    }

    this.tips.dialog.show();
  }

  logout() {
    this.setState({isLogout: true})
  }

  render() {
    if (this.state.isLogout) {
      return <Redirect to="/login"/>
    }

    return (
      <nav className="navbar navbar-dark bg-primary">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <button id="drawer-button" type="button" className="btn btn-link">
              <i className="fa fa-bars fa-lg" aria-hidden="true"/>
            </button>
          </li>
        </ul>

        <div className="navbar-text">
          <button id="menu-button" className="btn btn-link" data-toggle="dropdown">
            <i className="fa fa-ellipsis-v fa-lg" aria-hidden="true"/>
          </button>
        </div>

        <div className="dropdown-menu" aria-labelledby="menu-button">
          <a className="dropdown-item" href="#">Action</a>
          <a className="dropdown-item" href="#">Another action</a>
          <a className="dropdown-item" href="#">Something else here</a>
        </div>

        {/*<div className="toolbar__row">*/}
          {/*<div id="menu" className="menu menu--bottom-right js-menu" htmlFor="menu-button">*/}
            {/*<div className="list list--two-line list--avatar-list">*/}
              {/*<div className="list-item">*/}
                {/*<span className="list-item__start-detail">*/}
                  {/*<img src="http://www.risecenter.com/images/index/rise_logo.png"/>*/}
                {/*</span>*/}
                {/*<span className="list-item__text">*/}
                  {/*{this.props.profile.cRealname}*/}
                  {/*<span className="list-item__text__secondary">{this.props.profile.roles.join(",")}</span>*/}
                {/*</span>*/}
              {/*</div>*/}
            {/*</div>*/}
            {/*<div className="menu__item">修改密码</div>*/}
            {/*<div onClick={this.createDialogTips} className="menu__item">登出系统</div>*/}
          {/*</div>*/}
        {/*</div>*/}
      </nav>
    )
  }
}

export default Header;
