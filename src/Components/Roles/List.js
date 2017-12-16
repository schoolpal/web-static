import React from "react";
import ReactDOM from "react-dom";

import Header from "../Header/Header";
import Commands from "../Commands/Commands";
import DialogGroup from "../Dialog/DialogGroup";

import getRoles from "../../api/getRoles"

const Table = ({list}) => {
  if (list.length) {
    return (
      <div className="card__supporting-datatable">
        <table id="list" className="data-table groups js-data-table js-groups data-table--selectable">
          <thead>
          <tr>
            <th className="data-table__cell--non-numeric">角色职能</th>
            <th className="data-table__cell--non-numeric">角色职级</th>
            <th className="data-table__cell--non-numeric">角色名称</th>
            <th className="data-table__cell--non-numeric">角色描述</th>
          </tr>
          </thead>
          <tbody>
          {
            list.map((role) => (
              <tr key={role.cId} rid={role.cId}>
                <td className="data-table__cell--non-numeric">
                  {
                    role.rootFuncs.map(func => (func.cNameShort)).join(", ")
                  }
                </td>
                <td className="data-table__cell--non-numeric">{role.cRankName}</td>
                <td className="data-table__cell--non-numeric">{role.cName}</td>
                <td className="data-table__cell--non-numeric">{role.cDesc ? role.cDesc : "--"}</td>
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
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({list: getRoles().data});
    }, 500);
  }

  componentDidUpdate() {
    const table = document.getElementById("list");

    window.componentHandler.upgradeElement(table);
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
      pathname: `${this.props.match.url}/${selectedRow[0].getAttribute("rid")}`,
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

  render() {
    return (
      <div className="layout__container">
        <Header title="角色管理" profile={this.props.profile}/>
        <main>
          <div className="grid">
            <div className="cell cell--12-col">
              <div className="card shadow--2dp">
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
                  <Table list={this.state.list}/>
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