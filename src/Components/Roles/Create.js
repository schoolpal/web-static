import React from 'react'
import {Redirect} from 'react-router-dom'

import Header from "../Header/Header"
import Progress from "../Progress/Progress"

import historyBack from "../../utils/historyBack";
import getFuncDic from "../../api/getFuncDic";
import getRankDic from "../../api/getRankDic";

const FUNC_ADMIN = "7";
const RANK_ADMIN = 4;
const RANK_MANGER = 1;

class Create extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAnimating: false,
      isAdmin: false,
      isCreated: false,

      funcDic: [],
      rankDic: [],

      selectedRole: "",
      selectedFunc: []
    }
    this.changedAdmin = this.changedAdmin.bind(this);
    this.changedFunc = this.changedFunc.bind(this);
    this.changedRole = this.changedRole.bind(this);
    this.createRole = this.createRole.bind(this);
  }

  componentDidMount() {
    let funcDic = getFuncDic().data;
    let rankDic = getRankDic().data;

    funcDic = funcDic.filter((func) => {
      return func.cId === func.cRootId && func.cId !== FUNC_ADMIN;
    });

    rankDic = rankDic.filter((rank) => {
      return rank.cId !== RANK_ADMIN;
    })

    this.setState({funcDic, rankDic})
  }

  componentDidUpdate() {
    window.componentHandler.upgradeAllRegistered();
  }

  changedAdmin(evt) {
    // const switchs = this.form.querySelectorAll(".js-switch");
    // const others = Array.prototype.filter.call(switchs, (item) => {
    //   return item !== evt.target.parentNode;
    // });

    this.setState({isAdmin: !this.state.isAdmin}, () => {
      // others[0]["Switch"].checkToggleState()
    })
  }

  changedFunc(evt) {
    let tempFunc = [];

    if (this.state.selectedFunc.includes(evt.target.value)) {
      if (this.state.selectedRole && this.state.isAdmin) {
        tempFunc = this.state.selectedFunc.filter((func) => (func !== evt.target.value));
      }
    } else {
      if (this.state.selectedRole && this.state.isAdmin) {
        tempFunc = tempFunc.concat(this.state.selectedFunc);
      }

      tempFunc.push(evt.target.value);
    }

    this.setState({
      selectedFunc: tempFunc
    }, () => {
      const checkboxs = this.form.querySelectorAll(".js-checkbox");

      for (let i = 0; i < checkboxs.length; i++) {
        checkboxs[i]["Checkbox"].checkToggleState();
      }
    })
  }

  changedRole(evt) {
    const isManger = evt.target.value === RANK_MANGER.toString();
    let tempFunc = [];

    if (!isManger && this.state.selectedFunc.length > 1) {
      tempFunc = this.state.selectedFunc.shift();
      this.setState({
        selectedFunc: tempFunc
      }, () => {
        const checkboxs = this.form.querySelectorAll(".js-checkbox");

        for (let i = 0; i < checkboxs.length; i++) {
          checkboxs[i]["Checkbox"].checkToggleState();
        }
      })
    }

    this.setState({
      selectedRole: evt.target.value
    })
  }

  createRole() {
    if (!this.form.checkValidity() || (!this.state.isAdmin && (!this.state.selectedFunc.length || !this.state.selectedRole))) {
      return
    }

    const toast = document.getElementById("toast");
    let query = {};

    query.orgId = this.props.location.state.groupId;
    query.name = this.form.name.value;
    query.desc = this.form.desc.value;

    if (this.state.isAdmin) {
      query.strFuncIds = FUNC_ADMIN;
      query.rankId = RANK_MANGER;
    } else {
      query.strFuncIds = this.state.selectedFunc.join(',');
      query.rankId = this.state.selectedRole;
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
      return <Redirect to="/roles"/>
    } else {
      const isAdminClass = {display: `${this.state.isAdmin ? "none" : "flex"}`};
      const isAdminText = this.state.isAdmin ? "管理员" : "非管理员";

      return (
        <div className="layout__container">
          <Header title="角色创建" profile={this.props.profile}/>
          <main>
            <div className="grid grid--no-spacing">
              <div className="cell--3-offset cell--1-offset-tablet"></div>
              <div className="cell--6-col">
                <div className="card shadow--2dp">
                  <Progress isAnimating={this.state.isAnimating}/>

                  <div className="card__title">
                    <div className="card__title-text">
                      <h2 className="card__title-text--large">角色信息</h2>
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
                        管理员
                        <span className="list-item__text__secondary">是否为管理员</span>
                      </span>
                        <div className="list-item__end-form">
                          <label className="switch js-switch" htmlFor="switch-1">
                            <input
                              type="checkbox"
                              id="switch-1"
                              className="switch__input"
                              value={this.state.isAdmin ? "on" : "off"}
                              onChange={this.changedAdmin}
                              checked={this.state.isAdmin}
                            />
                            <span className="switch__label"></span>
                          </label>
                        </div>
                      </li>
                      <li className="list-item">
                      <span className="list-item__text">
                        角色职能
                        <span className="list-item__text__secondary">{isAdminText}</span>
                      </span>
                      </li>
                      <li className="list-item" style={isAdminClass}>
                        <div className="grid">
                          {
                            this.state.funcDic.map((func) => (
                              <div key={func.cId} className="cell cell--4-col typography--text__center">
                                <label className="checkbox js-checkbox" htmlFor={`func-${func.cId}`}>
                                  <input
                                    type="checkbox"
                                    id={`func-${func.cId}`}
                                    value={func.cId}
                                    className="checkbox__input"
                                    onChange={this.changedFunc}
                                    checked={this.state.selectedFunc.includes(func.cId)}
                                  />
                                  <span className="checkbox__label">{func.cNameShort}</span>
                                </label>
                              </div>
                            ))
                          }
                        </div>
                      </li>
                      <li className="list-item">
                      <span className="list-item__text">
                        角色职级
                        <span className="list-item__text__secondary">{isAdminText}</span>
                      </span>
                      </li>
                      <li className="list-item" style={isAdminClass}>
                        <div className="grid">
                          {
                            this.state.rankDic.map((rank) => (
                              <div key={rank.cId} className="cell cell--4-col typography--text__center">
                                <label className="radio js-radio" htmlFor={`option-${rank.cId}`}>
                                  <input
                                    type="radio"
                                    id={`option-${rank.cId}`}
                                    className="radio__button"
                                    name="rank"
                                    value={rank.cId}
                                    onChange={this.changedRole}
                                  />
                                  <span className="radio__label">{rank.cName}</span>
                                </label>
                              </div>
                            ))
                          }
                        </div>
                      </li>
                      <li className="list-item">
                      <span className="list-item__text">
                        角色名称
                        <span className="list-item__text__secondary">必填字段</span>
                      </span>
                        <div className="list-item__end-form">
                          <div className="textfield js-textfield is-upgraded">
                            <input id="name" name="name" className="textfield__input" type="text" required={true}/>
                            <label className="textfield__label" htmlFor="name">角色名称...</label>
                          </div>
                        </div>
                      </li>
                      <li className="list-item">
                      <span className="list-item__text">
                        角色描述
                      </span>
                        <div className="list-item__end-form">
                          <div className="textfield js-textfield is-upgraded">
                            <input id="desc" name="desc" className="textfield__input" type="text"/>
                            <label className="textfield__label" htmlFor="desc">角色描述...</label>
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