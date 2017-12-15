import React from 'react'

import getSimpleGroup from "../../api/getSimoleGroups";
import groupProcess from "../../utils/groupProcess";

const Group = ({list}) => {
  if (list.length) {
    return (
      <section className="dialog__body dialog__body--scrollable">
        <ul id="group" className="list groups js-groups">
          {GroupItem(list)}
        </ul>
      </section>
    );
  } else {
    return (
      <section className="dialog__body">数据加载中...</section>
    );
  }
};

const GroupItem = data => {
  let table = [];

  data.map(item => {
    const spacingStyle = {paddingLeft: 56 * item.level + "px"};

    table.push(
      <li key={item.cId} gid={item.cId} level={item.level} style={spacingStyle} className="groups-item">
        <HasChildren
          children={item.children && item.children.length ? true : false}
        />
        {item.cName}
      </li>
    );

    if (item.children && item.children.length) {
      let children = [];

      children.push(GroupItem(item.children));
      table.push(children);
    }
  });

  return table;
};

const HasChildren = ({children}) => {
  if (children) {
    return (
      <i className="groups-item__start-detail fa fa-angle-down fa-fw groups-arrow" aria-hidden="true"></i>
    );
  } else {
    return <span className="groups-item__start-detail"></span>;
  }
};

class DialogGroup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {list: []}
    this.group = null;
    this.selected = this.selected.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  componentDidMount() {
    const dialogElem = document.getElementById("dialogGroup");

    window.componentHandler.upgradeElement(dialogElem);
    this.dialog = dialogElem["Dialog"];

    setTimeout(() => {
      this.setState({list: groupProcess(getSimpleGroup().data)});

      const groupElem = document.getElementById("group");
      window.componentHandler.upgradeElement(groupElem);
      this.group = groupElem["Groups"];
    }, 2000)
  }

  selected() {
    if (this.group === null || this.group.selected() === null) {
      return;
    }

    this.props.accept(this.group.selected()[0]);
    this.dialog.hide()
  }

  cancel(){
    this.dialog.hide()
  }

  render() {
    return (
      <aside id="dialogGroup" className="dialog js-dialog" role="alertdialog">
        <div className="dialog__surface">
          <header className="dialog__header">
            <h2 className="dialog__header__title">清选择一个组织</h2>
          </header>
          <Group list={this.state.list}/>
          <footer className="dialog__footer">
            <button onClick={this.cancel} type="button"
                    className="button button--cancel dialog__footer__button--cancel">Decline
            </button>
            <button onClick={this.selected} type="button"
                    className="button button--primary dialog__footer__button--accept">Accept
            </button>
          </footer>
        </div>
        <div className="dialog__backdrop"></div>
      </aside>
    )
  }
}

export default DialogGroup;