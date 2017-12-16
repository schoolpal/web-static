import React from "react";

import Header from "../Header/Header";
import Commands from "../Commands/Commands";
import DialogGroup from "../Dialog/DialogGroup";
import Progress from "../Progress/Progress"

import getFuncByIds from "../../api/getFuncByIds";
import getRolesByGroup from "../../api/getRolesByGroup";
import getRoleById from "../../api/getRoleById"
import permissionsProcess from "../../utils/permissionsProcess"
import nodeListToArray from "../../utils/nodeListToArray"
import ReactDOM from "react-dom";

const Table = ({list, selectedFunc, changedFunc}) => {
  if (list.length) {
    return (
      <div className="card__supporting-datatable">
        <table id="list" className="data-table groups js-data-table js-groups">
          <thead>
          <tr>
            <th className="data-table__cell--non-numeric">系统菜单</th>
            <th>选取</th>
            <th className="data-table__cell--non-numeric">功能权限</th>
          </tr>
          </thead>
          <tbody>{TableItem(list, selectedFunc, changedFunc)}</tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div className="card__supporting-text">
        <p>数据加载中...</p>
      </div>
    );
  }
};

const TableItem = (data, selectedFunc, changedFunc) => {
  let table = [];

  data.map(item => {
    const level = item.cId.split('-').length;
    const spacingStyle = {marginLeft: 56 * level + "px"};
    let func = [];

    if (item.action) {
      func = item.action.map((func) => (
        <label key={func.cId} className="checkbox js-checkbox" htmlFor={func.cId}>
          <input
            type="checkbox"
            id={func.cId}
            className="checkbox__input"
            value={func.cId}
            onChange={changedFunc}
            checked={selectedFunc.includes(func.cId)}
          />
          <span className="checkbox__label">{func.cNameLong}</span>
        </label>
      ))
    }

    table.push(
      <tr key={item.cId} level={level} className="groups--show groups--arrowup">
        <td className="data-table__cell--non-numeric">
          <div className="groups-item" style={spacingStyle}>
            <HasChildren
              children={item.children && item.children.length ? true : false}
            />
            {item.cNameLong}
          </div>
        </td>
        <td>
          <label className="checkbox js-checkbox" htmlFor={item.cId}>
            <input
              type="checkbox"
              id={item.cId}
              className="checkbox__input"
              value={item.cId}
              onChange={changedFunc}
              checked={selectedFunc.includes(item.cId)}
            />
          </label>
        </td>
        <td className="data-table__cell--non-numeric">{func}</td>
      </tr>
    );

    if (item.children && item.children.length) {
      let children = [];

      children.push(TableItem(item.children, selectedFunc, changedFunc));
      table.push(children);
    }
  });

  return table;
};

const HasChildren = ({children}) => {
  if (children) {
    return (
      <i
        className="groups-item__start-detail fa fa-angle-down fa-fw groups-arrow"
        aria-hidden="true"
      />
    );
  } else {
    return <span className="groups-item__start-detail"/>;
  }
};

class Permissions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAnimating: false,

      groupId: this.props.profile.org.cId,
      groupName: this.props.profile.org.cName,

      selectedRole: null,
      selectedRoleText: null,
      selectedFunc: [],

      roles: [],
      list: []
    };
    this.createGroupsDialog = this.createGroupsDialog.bind(this);
    this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
    this.changedRole = this.changedRole.bind(this);
    this.changedFunc = this.changedFunc.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    const selectedFunc = getRoleById().data.functions.map((func) => (func.cId));

    setTimeout(() => {
      this.setState({
        selectedRole: getRolesByGroup().data[0].cId,
        selectedRoleText: getRolesByGroup().data[0].cName,
        selectedFunc: selectedFunc,
        roles: getRolesByGroup().data,
        list: permissionsProcess(getFuncByIds().data)
      }, () => {
        const checkboxs = this.form.querySelectorAll(".js-checkbox");

        for (let i = 0; i < checkboxs.length; i++) {
          checkboxs[i]["Checkbox"].checkToggleState();
        }
      });
    }, 500);
  }

  componentDidUpdate() {
    const button = nodeListToArray(document.getElementById("permissions").querySelectorAll(".js-button"))
    const menu = nodeListToArray(document.getElementById("permissions").querySelectorAll(".js-menu"))
    const checkbox = nodeListToArray(document.getElementById("permissions").querySelectorAll(".js-checkbox"))
    const dataTable = nodeListToArray(document.getElementById("permissions").querySelectorAll(".js-data-table"))
    let elems = nodeListToArray(document.getElementById("permissions").querySelectorAll(".js-groups"))

    elems = elems.concat(button, menu, checkbox, dataTable);

    window.componentHandler.upgradeElements(elems);
  }

  componentWillUnmount() {
    if (this.groupContainer) {
      document.body.removeChild(this.groupContainer);
    }
  }

  createGroupsDialog() {
    if (this.group === undefined) {
      this.groupContainer = document.createElement('div');
      ReactDOM.render(
        <DialogGroup
          accept={this.acceptGroupDialog}
          ref={(dom) => {
            this.group = dom
          }}
        />,
        document.body.appendChild(this.groupContainer)
      );
    }

    this.group.dialog.show();
  }

  acceptGroupDialog(selected) {
    this.setState({
      groupId: selected.getAttribute("gid"),
      groupName: selected.textContent
    })
  }

  changedRole(evt) {
    this.setState({
      selectedRole: evt.target.getAttribute("rid"),
      selectedRoleText: evt.target.textContent
    })
    evt.target.parentNode["Menu"].toggle();
  }

  changedFunc(evt) {
    let tempFunc = [];

    if (this.state.selectedFunc.includes(evt.target.value)) {
      tempFunc = this.state.selectedFunc.filter((func) => (func !== evt.target.value));
    } else {
      tempFunc = tempFunc.concat(this.state.selectedFunc);
      tempFunc.push(evt.target.value);
    }

    this.setState({selectedFunc: tempFunc})
  }

  update() {
    const toast = document.getElementById("toast");

    this.setState({isAnimating: true});
    setTimeout(() => {
      toast["Snackbar"].showSnackbar({message: "更新成功，需要重新登录才可生效！"})
      this.setState({isAnimating: false})
    }, 2500)
  }

  render() {
    const groupCommands = this.props.commands.find((item) => {
      return item.rule.test(this.props.location.pathname) === true
    })

    return (
      <div className="layout__container">
        <Header title="权限管理" profile={this.props.profile}/>
        <main>
          <div className="grid">
            <div className="cell cell--12-col">
              <div id="permissions" className="card shadow--2dp">
                <Progress isAnimating={this.state.isAnimating}/>

                <div className="card__title">
                  {this.state.groupName}
                  <div onClick={this.createGroupsDialog} className="button button--icon js-button"
                       style={{marginRight: "32px"}}>
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                  </div>

                  {this.state.selectedRoleText}
                  <div id="role-button" className="button button--icon js-button">
                    <i className="fa fa-angle-down" aria-hidden="true"></i>
                  </div>
                  <div className="menu menu--bottom-right js-menu" htmlFor="role-button">
                    {
                      this.state.roles.map((role) => (
                        <div key={role.cId} rid={role.cId} onClick={this.changedRole}
                             className="menu__item">{role.cName}</div>
                      ))
                    }
                  </div>
                </div>
                <form ref={(dom) => {
                  this.form = dom
                }}>
                  <Table
                    list={this.state.list}
                    selectedFunc={this.state.selectedFunc}
                    changedFunc={this.changedFunc}
                  />
                </form>
                <div className="card__actions">
                  <div className="layout-spacer"></div>
                  <Commands
                    commands={groupCommands.commands}
                    authAction={this.update}
                    disabled={this.state.isAnimating}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default Permissions;