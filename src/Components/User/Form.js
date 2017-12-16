import React from 'react'
import nodeListToArray from "../../utils/nodeListToArray";
import getRolesById from "../../api/getRolesById";

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.RANK_ADMIN = 4;
    this.state = {
      isAdmin: false,

      roles: [],
      selectedRolesDic: [],
      selectedRoles: [],
    }
    this.changedAdmin = this.changedAdmin.bind(this);
    this.changedRole = this.changedRole.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
  }

  componentDidMount() {
    const roles = getRolesById().data;
    const selectedRolesDic = roles.filter(role => (role.cRankId !== this.RANK_ADMIN))

    this.setState({roles, selectedRolesDic})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && this.props.data !== nextProps.data) {
      const isAdmin = nextProps.data.roles.filter((role) => (role.cRankId === this.RANK_ADMIN)).length ? true : false;
      let selectedRoles = [];

      if (!isAdmin) {
        selectedRoles = nextProps.data.roles.map(role => (role.cId));
      }

      this.setState({isAdmin, selectedRoles}, () => {
        const radios = nodeListToArray(this.form.querySelectorAll(".js-radio"));
        const switchs = nodeListToArray(this.form.querySelectorAll(".js-switch"));
        const checkbox = nodeListToArray(this.form.querySelectorAll(".js-checkbox"))
        let elems = nodeListToArray(this.form.querySelectorAll(".js-textfield"));

        elems = elems.concat(radios, checkbox, switchs)
        window.componentHandler.upgradeElements(elems);

        document.getElementById("isAdmin").parentNode["Switch"].checkToggleState();
        document.getElementById("loginName").parentNode["Textfield"].change(nextProps.data.cLoginname);
        document.getElementById("realName").parentNode["Textfield"].change(nextProps.data.cRealname);
        document.getElementById("phone").parentNode["Textfield"].change(nextProps.data.cPhone);
        document.getElementById("email").parentNode["Textfield"].change(nextProps.data.cEmail);
        document.getElementById("nickName").parentNode["Textfield"].change(nextProps.data.cNickname);
        document.getElementById("im").parentNode["Textfield"].change(nextProps.data.cQq);
      })
    }
  }

  componentDidUpdate() {
    const radios = nodeListToArray(this.form.querySelectorAll(".js-radio"));
    const switchs = nodeListToArray(this.form.querySelectorAll(".js-switch"));
    const checkbox = nodeListToArray(this.form.querySelectorAll(".js-checkbox"))
    let elems = nodeListToArray(this.form.querySelectorAll(".js-textfield"));

    if (elems.length) {
      elems = elems.concat(radios, checkbox, switchs)
      window.componentHandler.upgradeElements(elems);
    }
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

    this.setState({
      selectedRoles: tempRoles
    })
  }

  getFormValue() {
    if (!this.form.checkValidity() || (!this.state.isAdmin && !this.state.selectedRoles.length)) {
      return null;
    }

    let query = {};

    for (let i = 0; i < this.form.length; i++) {
      if (this.form[i].name) {
        query[this.form[i].name] = this.form[i].value;
      }
    }

    if (this.state.isAdmin) {
      this.state.roles.find(role => {
        console.log(role.cRankId, this.RANK_ADMIN)
        return role.cRankId === this.RANK_ADMIN
      })
      query.roles = this.state.roles.find(role => (role.cRankId === this.RANK_ADMIN)).cId;
    } else {
      query.roles = this.state.selectedRoles.join(',');
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
              用户名
              <span className="list-item__text__secondary">必填字段</span>
            </span>
              <div className="list-item__end-form">
                <div className="textfield js-textfield is-upgraded">
                  <input id="loginName" name="loginName" className="textfield__input" type="text"
                         required={true} readOnly={this.props.isEditor}/>
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
                         required={!this.props.isEditor}/>
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
            <li className="list-item" style={isAdminClass}>
              <div className="grid">
                {
                  this.state.selectedRolesDic.map((role) => (
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
      )
    }
  }
}

export default Form;