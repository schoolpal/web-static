import React from "react";
import ReactDOM from "react-dom";

import Header from "../Header/Header";
import Commands from "../Commands/Commands";
import DialogGroup from "../Dialog/DialogGroup";

import getUsers from "../../api/getUsers"
import nodeListToArray from "../../utils/nodeListToArray";

const Table = ({list, changedState}) => {
  if (list.length) {
    return (
      <div className="card__supporting-datatable">
        <table id="list" className="data-table groups js-data-table js-groups data-table--selectable">
          <thead>
          <tr>
            <th className="data-table__cell--non-numeric">状态</th>
            <th className="data-table__cell--non-numeric">用户名</th>
            <th className="data-table__cell--non-numeric">姓名</th>
            <th className="data-table__cell--non-numeric">昵称</th>
            <th className="data-table__cell--non-numeric">电话号码</th>
            <th className="data-table__cell--non-numeric">电子邮件</th>
            <th>IM(QQ)</th>
            <th className="data-table__cell--non-numeric">用户角色</th>
          </tr>
          </thead>
          <tbody>
          {
            list.map((user) => (
              <tr key={user.cId} uid={user.cId}>
                <td className="data-table__cell--non-numeric">
                  <label className="switch js-switch" htmlFor={`switch-${user.cId}`}>
                    <input
                      type="checkbox"
                      id={`switch-${user.cId}`}
                      className="switch__input"
                      value={user.cAvailable ? "on" : "off"}
                      onChange={changedState}
                      checked={user.cAvailable}
                    />
                    <span className="switch__label"></span>
                  </label>
                </td>
                <td className="data-table__cell--non-numeric">{user.cLoginname}</td>
                <td className="data-table__cell--non-numeric">{user.cRealname}</td>
                <td className="data-table__cell--non-numeric">{user.cNickname}</td>
                <td className="data-table__cell--non-numeric">{user.cPhone}</td>
                <td className="data-table__cell--non-numeric">{user.cEmail}</td>
                <td>{user.cQq}</td>
                <td className="data-table__cell--non-numeric">
                  {
                    user.roles.map((role) => {
                      return role.cName
                    }).join(',')
                  }
                </td>
              </tr>
            ))
          }
          </tbody>
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

class List extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      groupId: this.props.profile.org.cId,
      groupName: this.props.profile.org.cName,

      list: []
    }
    this.createGroupsDialog = this.createGroupsDialog.bind(this);
    this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
    this.addAction = this.addAction.bind(this);
    this.modAction = this.modAction.bind(this);
    this.delAction = this.delAction.bind(this);
    this.changedState = this.changedState.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({list: getUsers().data});
    }, 500);
  }

  componentDidUpdate() {
    const button = nodeListToArray(document.getElementById("users").querySelectorAll(".js-button"))
    const switchs = nodeListToArray(document.getElementById("users").querySelectorAll(".js-switch"))
    const checkbox = nodeListToArray(document.getElementById("users").querySelectorAll(".js-checkbox"))
    const dataTable = nodeListToArray(document.getElementById("users").querySelectorAll(".js-data-table"))
    let elems = [];

    elems = elems.concat(button, switchs, checkbox, dataTable);

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

  addAction() {
    const location = {
      pathname: `${this.props.match.url}/create`,
      state: {
        groupId: this.state.groupId,
        groupName: this.state.groupName
      }
    }

    this.props.history.push(location);
  }

  modAction() {
    const selectedRow = document.getElementById("list")["DataTable"].selected();

    if (!selectedRow) {
      return;
    }

    const location = {
      pathname: `${this.props.match.url}/${selectedRow[0].getAttribute("uid")}`,
      state: {
        groupId: this.state.groupId,
        groupName: this.state.groupName
      }
    }

    this.props.history.push(location);
  }

  delAction() {
    const selectedRow = document.getElementById("list")["DataTable"].selected();

    if (!selectedRow) {
      return;
    }
  }

  changedState(evt) {
    const uid = evt.target.id.split("-")[1];
    const updateList = this.state.list.map((item) => {
      if (item.cId === uid) {
        item.cAvailable = !item.cAvailable
      }

      return item;
    });

    this.setState({list: updateList});
  }

  render() {
    return (
      <div className="layout__container">
        <Header title="用户管理" profile={this.props.profile}/>
        <main>
          <div className="grid">
            <div className="cell cell--12-col">
              <div id="users" className="card shadow--2dp">
                <div className="card__title">
                  {this.state.groupName}
                  <div onClick={this.createGroupsDialog} className="button button--icon js-button">
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                  </div>
                  <div className="card__title--spacer"/>
                  <Commands
                    commands={this.props.commands}
                    addAction={this.addAction}
                    modAction={this.modAction}
                    delAction={this.delAction}
                  />
                </div>
                <div className="card__supporting-datatable">
                  <Table list={this.state.list} changedState={this.changedState}/>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default List