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
    const drawer = document.getElementById("drawer");
    const menu = document.getElementById("menu");

    window.componentHandler.upgradeElement(drawer);
    window.componentHandler.upgradeElement(menu);
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
      <header className="toolbar">
        <div className="toolbar__row">
          <button
            id="drawer-button"
            className="button button--icon toolbar__icon js-button"
          >
            <i className="fa fa-bars" aria-hidden="true"/>
          </button>
          <span className="toolbar__title">{this.props.title}</span>
          <div className="toolbar__spacer"></div>
          <button
            id="menu-button"
            className="button button--icon toolbar__icon js-button"
          >
            <i className="fa fa-ellipsis-v" aria-hidden="true"/>
          </button>
          <div id="menu" className="menu menu--bottom-right js-menu" htmlFor="menu-button">
            <div className="list list--two-line list--avatar-list">
              <div className="list-item">
                <span className="list-item__start-detail">
                  <img src="http://www.risecenter.com/images/index/rise_logo.png"/>
                </span>
                <span className="list-item__text">
                  {this.props.profile.cRealname}
                  <span className="list-item__text__secondary">{this.props.profile.roles.join(",")}</span>
                </span>
              </div>
            </div>
            <div className="menu__item">修改密码</div>
            <div onClick={this.createDialogTips} className="menu__item">登出系统</div>
          </div>
        </div>
      </header>
    )
  }
}

export default Header;
