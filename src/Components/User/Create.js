import React from 'react'
import {Redirect} from 'react-router-dom'

import Header from "../Header/Header"
import Progress from "../Progress/Progress"

import historyBack from "../../utils/historyBack";
import getRolesById from "../../api/getRolesById";

const RANK_ADMIN = 4;

class Create extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAnimating: false,
      isAdmin: false,
      isCreated: false,

      roles: [],

      selectedRoles: [],
    }
    this.changedAdmin = this.changedAdmin.bind(this);
    this.changedRole = this.changedRole.bind(this);
    this.createRole = this.createRole.bind(this);
  }

  componentDidMount() {
    let roles = getRolesById().data;

    roles = roles.filter((role) => {
      return role.cId !== RANK_ADMIN;
    })

    this.setState({roles})
  }

  componentDidUpdate() {
    window.componentHandler.upgradeAllRegistered();
  }

  changedAdmin() {
    this.setState({isAdmin: !this.state.isAdmin})
  }

  changedRole(evt) {
    let tempRoles = [];

    if (this.state.selectedRoles.includes(evt.target.value)) {
      tempRoles = this.state.selectedRoles.filter((role) => (role !== evt.target.value))
    } else {
      tempRoles = tempRoles.concat(this.state.selectedRoles);
      tempRoles.push(evt.target.value);
    }
    console.log(tempRoles)
    this.setState({
      selectedRoles: tempRoles
    })
  }

  createRole() {
    if (!this.form.checkValidity() || (!this.state.isAdmin && !this.state.selectedRoles.length)) {
      return
    }

    const toast = document.getElementById("toast");
    let query = {};

    for (let i = 0; i < this.form.length; i++) {
      if (this.form[i].name) {
        query[this.form[i].name] = this.form[i].value;
      }
    }

    query.orgId = this.props.location.state.groupId;

    if (this.state.isAdmin) {
      query.roles = this.state.roles.find((role) => (role.cRankId === RANK_ADMIN)).cId;
    } else {
      query.roles = this.state.selectedRoles.join(',');
    }

    console.log(query)
    this.setState({isAnimating: true});
    setTimeout(() => {
      toast["Snackbar"].showSnackbar({message: "创建成功，将跳转到列表页！"})
      this.setState({isCreated: true})
    }, 2500)
  }

  render() {
    if (this.state.isCreated) {
      return <Redirect to="/users"/>
    } else {
      const isAdminClass = {display: `${this.state.isAdmin ? "none" : "flex"}`};
      const isAdminText = this.state.isAdmin ? "管理员" : "非管理员";

      return (
        <div className="layout__container">
          <Header title="用户创建" profile={this.props.profile}/>
          <main>
            <div className="grid grid--no-spacing">
              <div className="cell--3-offset cell--1-offset-tablet"></div>
              <div className="cell--6-col">
                <div className="card shadow--2dp">
                  <Progress isAnimating={this.state.isAnimating}/>

                  <div className="card__title">
                    <div className="card__title-text">
                      <h2 className="card__title-text--large">用户信息</h2>
                    </div>
                  </div>
                  <form ref={(dom) => {
                    this.form = dom
                  }}>
                    <ul className="list list--auto-line">
                      <li className="list-item">
                      <span className="list-item__text">
                        所属组织
                      </span>
                        <div className="list-item__end-form">
                          {this.props.location.state.groupName}
                        </div>
                      </li>
                      <li className="list-item">
                      <span className="list-item__text">
                        用户名
                        <span className="list-item__text__secondary">必填字段</span>
                      </span>
                        <div className="list-item__end-form">
                          <div className="textfield js-textfield is-upgraded">
                            <input id="loginName" name="loginName" className="textfield__input" type="text"
                                   required={true}/>
                            <label className="textfield__label" htmlFor="loginName">用户名...</label>
                          </div>
                        </div>
                      </li>
                      <li className="list-item">
                      <span className="list-item__text">
                        登陆密码
                        <span className="list-item__text__secondary">必填字段</span>
                      </span>
                        <div className="list-item__end-form">
                          <div className="textfield js-textfield is-upgraded">
                            <input id="password" name="password" className="textfield__input" type="text"
                                   required={true}/>
                            <label className="textfield__label" htmlFor="password">登陆密码...</label>
                          </div>
                        </div>
                      </li>
                      <li className="list-item">
                        <span className="list-item__text">
                          用户角色
                          <span className="list-item__text__secondary">{isAdminText}</span>
                        </span>
                        <div className="list-item__end-form">
                          <label className="switch js-switch" htmlFor="switch">
                            <input
                              type="checkbox"
                              id="switch"
                              className="switch__input"
                              value={this.state.isAdmin ? "on" : "off"}
                              onChange={this.changedAdmin}
                              checked={this.state.isAdmin}
                            />
                            <span className="switch__label"></span>
                          </label>
                        </div>
                      </li>
                      <li className="list-item" style={isAdminClass}>
                        <div className="grid">
                          {
                            this.state.roles.map((role) => (
                              <div key={role.cId} className="cell cell--4-col typography--text__center">
                                <label className="checkbox js-checkbox" htmlFor={`role-${role.cId}`}>
                                  <input
                                    type="checkbox"
                                    id={`role-${role.cId}`}
                                    value={role.cId}
                                    className="checkbox__input"
                                    onChange={this.changedRole}
                                    checked={this.state.selectedRoles.includes(role.cId)}
                                  />
                                  <span className="checkbox__label">{role.cName}</span>
                                </label>
                              </div>
                            ))
                          }
                        </div>
                      </li>
                      <li className="list-item">
                      <span className="list-item__text">
                        姓名
                        <span className="list-item__text__secondary">必填字段</span>
                      </span>
                        <div className="list-item__end-form">
                          <div className="textfield js-textfield is-upgraded">
                            <input id="realName" name="realName" className="textfield__input" type="text"
                                   required={true}/>
                            <label className="textfield__label" htmlFor="realName">姓名...</label>
                          </div>
                        </div>
                      </li>
                      <li className="list-item">
                      <span className="list-item__text">
                        电话号码
                        <span className="list-item__text__secondary">必填字段</span>
                      </span>
                        <div className="list-item__end-form">
                          <div className="textfield js-textfield is-upgraded">
                            <input id="phone" name="phone" className="textfield__input" type="text" required={true}/>
                            <label className="textfield__label" htmlFor="phone">电话号码...</label>
                          </div>
                        </div>
                      </li>
                      <li className="list-item">
                      <span className="list-item__text">
                        电子邮箱
                        <span className="list-item__text__secondary">必填字段</span>
                      </span>
                        <div className="list-item__end-form">
                          <div className="textfield js-textfield is-upgraded">
                            <input id="email" name="email" className="textfield__input" type="text" required={true}/>
                            <label className="textfield__label" htmlFor="email">电子邮箱...</label>
                          </div>
                        </div>
                      </li>
                      <li className="list-item">
                      <span className="list-item__text">
                        昵称
                      </span>
                        <div className="list-item__end-form">
                          <div className="textfield js-textfield is-upgraded">
                            <input id="nickName" name="nickName" className="textfield__input" type="text"/>
                            <label className="textfield__label" htmlFor="nickName">昵称...</label>
                          </div>
                        </div>
                      </li>
                      <li className="list-item">
                      <span className="list-item__text">
                        IM(QQ...)
                      </span>
                        <div className="list-item__end-form">
                          <div className="textfield js-textfield is-upgraded">
                            <input id="im" name="im" className="textfield__input" type="text"/>
                            <label className="textfield__label" htmlFor="im">IM(QQ...)...</label>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </form>
                  <div className="card__actions card--border">
                    <div className="layout-spacer"></div>
                    <button onClick={() => {
                      historyBack(this.props.history)
                    }} className="button js-button">
                      返回
                    </button>
                    <button
                      onClick={this.createRole}
                      className="button button--primary js-button"
                      disabled={this.state.isAnimating}
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
              <div className="cell--3-offset cell--1-offset-tablet"></div>
            </div>
          </main>
        </div>
      )
    }
  }
}

export default Create;