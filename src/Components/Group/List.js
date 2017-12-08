import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "../Header/Header";
import Editor from "../Group/Editor";

import getGroupList from "../../api/getGroupList";
import groupProcess from "../../utils/groupProcess";

const Table = ({ list }) => {
  if (list.length) {
    return (
      <div className="card__supporting-datatable">
        <table className="data-table groups js-data-table js-groups data-table--selectable">
          <thead>
            <tr>
              <th className="data-table__cell--non-numeric">组织名称</th>
              <th className="data-table__cell--non-numeric">所在地区</th>
              <th className="data-table__cell--non-numeric">详细地址</th>
              <th className="data-table__cell--non-numeric">负责人</th>
              <th>联系电话</th>
            </tr>
          </thead>
          <tbody>{TableItem(list)}</tbody>
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

const HasChildren = ({ children }) => {
  if (children) {
    return (
      <i
        className="groups-item__start-detail fa fa-angle-down fa-fw groups-arrow"
        aria-hidden="true"
      />
    );
  } else {
    return <span className="groups-item__start-detail" />;
  }
};

const TableItem = data => {
  let table = [];

  data.map(item => {
    const spacingStyle = { marginLeft: 56 * item.level + "px" };
    const area = item.cState + " " + item.cCity + " " + item.cCounty;
    const addr = area + " " + item.cAddress;
    
    table.push(
      <tr key={item.cId} level={item.level}>
        <td className="data-table__cell--non-numeric">
          <div className="groups-item" style={spacingStyle}>
            <HasChildren
              children={item.children && item.children.length ? true : false}
            />
            {item.cName}
          </div>
        </td>
        <td className="data-table__cell--non-numeric">{area}</td>
        <td className="data-table__cell--non-numeric">{addr}</td>
        <td className="data-table__cell--non-numeric">{item.cOwner}</td>
        <td>{item.cOwnerPhone}</td>
      </tr>
    );

    if (item.children && item.children.length) {
      let children = [];

      children.push(TableItem(item.children));
      table.push(children);
    }
  });

  return table;
};

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = { list: [] };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ list: groupProcess(getGroupList().data) });
    }, 500);
  }

  componentDidUpdate() {
    window.componentHandler.upgradeAllRegistered();
  }

  render() {
    return (
      <div className="layout__container">
        <Header title="组织管理" />

        <Route path={`${this.props.match.url}/:groupId`} component={Editor} />
        <Route
          exact
          path={this.props.match.url}
          render={() => (
            <main>
              <div className="grid">
                <div className="cell cell--12-col">
                  <div className="card shadow--2dp">
                    <div className="card__title">
                      <div className="card__title--spacer" />
                      <button className="button button--icon js-button">
                        <i className="fa fa-plus" aria-hidden="true" />
                      </button>
                      <button className="button button--icon js-button">
                        <i className="fa fa-pencil" aria-hidden="true" />
                      </button>
                      <button className="button button--icon js-button">
                        <i className="fa fa-trash-o" aria-hidden="true" />
                      </button>
                    </div>
                    <Table list={this.state.list} />
                  </div>
                </div>
              </div>
            </main>
          )}
        />
      </div>
    );
  }
}

export default List;
