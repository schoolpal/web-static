import React from 'react'

import getFuncDic from "../../api/getFuncDic";
import getRankDic from "../../api/getRankDic";
import nodeListToArray from "../../utils/nodeListToArray";

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.FUNC_ADMIN = "7";
    this.RANK_ADMIN = 4;
    this.RANK_MANGER = 1;

    this.state = {
      isAdmin: false,
      isManger: false,

      funcDic: [],
      rankDic: [],

      selectedRole: "",
      selectedFunc: []
    }
    this.changedAdmin = this.changedAdmin.bind(this);
    this.changedFunc = this.changedFunc.bind(this);
    this.changedRole = this.changedRole.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
  }

  componentDidMount() {
    let funcDic = getFuncDic().data;
    let rankDic = getRankDic().data;

    funcDic = funcDic.filter(func => (func.cId === func.cRootId && func.cId !== this.FUNC_ADMIN));
    rankDic = rankDic.filter(rank => (rank.cId !== this.RANK_ADMIN));

    this.setState({funcDic, rankDic}, () => {
      const checkboxs = nodeListToArray(this.form.querySelectorAll(".js-checkbox"));
      const radios = nodeListToArray(this.form.querySelectorAll(".js-radio"));
      const switchs = nodeListToArray(this.form.querySelectorAll(".js-switch"));
      let elems = nodeListToArray(this.form.querySelectorAll(".js-textfield"));

      if (elems.length) {
        elems = elems.concat(checkboxs, radios, switchs)
        window.componentHandler.upgradeElements(elems);
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && this.props.data !== nextProps.data) {
      let state = {};

      state.isAdmin = nextProps.data.cRankId === this.RANK_ADMIN;

      if (!state.isAdmin) {
        state.selectedRole = nextProps.data.cRankId;
        state.selectedFunc = nextProps.data.rootFuncs.map(func => (func.cId))
      }

      this.setState({...state}, () => {
        const checkboxs = nodeListToArray(this.form.querySelectorAll(".js-checkbox"));
        const radios = nodeListToArray(this.form.querySelectorAll(".js-radio"));
        const switchs = nodeListToArray(this.form.querySelectorAll(".js-switch"));
        let elems = nodeListToArray(this.form.querySelectorAll(".js-textfield"));

        elems = elems.concat(checkboxs, radios, switchs)
        window.componentHandler.upgradeElements(elems);

        document.getElementById("isAdmin").parentNode["Switch"].checkToggleState();
        document.getElementById("name").parentNode["Textfield"].change(nextProps.data.cName);
        document.getElementById("desc").parentNode["Textfield"].change(nextProps.data.cDesc);
      })
    }
  }

  changedAdmin() {
    this.setState({isAdmin: !this.state.isAdmin})
  }

  changedFunc(evt) {
    let tempFunc = [];

    if (this.state.selectedFunc.includes(evt.target.value)) {
      if (this.state.selectedRole && this.state.isManger) {
        tempFunc = this.state.selectedFunc.filter((func) => (func !== evt.target.value));
      }
    } else {
      if (this.state.selectedRole && this.state.isManger) {
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
    const isManger = evt.target.value === this.RANK_MANGER.toString();
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
      isManger,
      selectedRole: evt.target.value
    })
  }

  getFormValue() {
    if (!this.form.checkValidity() || (!this.state.isAdmin && (!this.state.selectedFunc.length || !this.state.selectedRole))) {
      return
    }

    let query = {};

    query.name = this.form.name.value;
    query.desc = this.form.desc.value;

    if (this.state.isAdmin) {
      query.strFuncIds = this.FUNC_ADMIN;
      query.rankId = this.RANK_ADMIN;
    } else {
      query.strFuncIds = this.state.selectedFunc.join(',');
      query.rankId = this.state.selectedRole;
    }

    return query;
  }

  render() {
    if (this.props.isEditor && !this.props.data) {
      return (
        <form ref={(dom) => {
          this.form = dom
        }}>
          <ul className="list list--two-line">
            <li className="list-item">
            <span className="list-item__text">
              数据加载中...
            </span>
            </li>
          </ul>
        </form>
      )
    } else {
      const isAdminClass = {display: `${this.state.isAdmin ? "none" : "flex"}`};
      const isAdminText = this.state.isAdmin ? "管理员" : "非管理员";

      return (
        <form ref={(dom) => {
          this.form = dom
        }}>
          <ul className="list list--auto-line">
            <li className="list-item">
            <span className="list-item__text">
              所属组织
            </span>
              <div className="list-item__end-form">
                {this.props.groupName}
              </div>
            </li>
            <li className="list-item">
            <span className="list-item__text">
              管理员
              <span className="list-item__text__secondary">是否为管理员</span>
            </span>
              <div className="list-item__end-form">
                <label className="switch js-switch" htmlFor="isAdmin">
                  <input
                    type="checkbox"
                    id="isAdmin"
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
      )
    }
  }
}

export default Form;