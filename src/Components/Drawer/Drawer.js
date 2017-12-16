import React from "react";
import {NavLink} from "react-router-dom";

import SCHOOLPAL_CONFIG from "../../utils/config";

const GroupDialogBBtn = () => (
  <div id="dialog-button" className="list-item">
    <i
      className="fa fa-home fa-fw list-item__start-detail"
      aria-hidden="true"
    />
    Group
    <span className="list-item__end-detail">
      <i className="fa fa-angle-right" aria-hidden="true"/>
    </span>
  </div>
);

const Menu = data => {
  const menuData = data.data || data;
  let menu = [];

  menuData.map(item => {
    if (item.children && item.children.length) {
      let children = [];

      children.push(Menu(item.children));
      menu.push(
        <div key={item.cId} className="collapse">
          <div className="collapse-header list-item js-collapse">
            <i
              className={`fa ${
                SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
                } fa-fw list-item__start-detail`}
              aria-hidden="true"
            />
            {item.cNameLong}
            <span className="list-item__end-detail">
              <i
                className="fa fa-angle-down collapse-arrow"
                aria-hidden="true"
              />
            </span>
          </div>
          <div className="collapse-body list list--dense">{children}</div>
        </div>
      );
    } else {
      menu.push(
        <NavLink
          key={item.cId}
          to={`/${SCHOOLPAL_CONFIG.AUTH[item.cId].PATH}`}
          className="list-item"
          activeClassName="drawer--selected"
        >
          <i
            className={`fa ${
              SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
              } fa-fw list-item__start-detail`}
            aria-hidden="true"
          />
          {item.cNameLong}
        </NavLink>
      );
    }
  });

  return menu;
};

class Drawer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const collapses = document.getElementById("drawer").querySelectorAll(".js-collapse");

    window.componentHandler.upgradeElements(collapses);
  }

  render() {
    return (
      <aside id="drawer" className="drawer js-drawer drawer--open" htmlFor="drawer-button">
        <div className="drawer__drawer">
          <div className="drawer__toolbar-spacer">
            <img src="http://www.risecenter.com/images/index/rise_logo.png"/>
          </div>
          <div className="list">
            {this.props.hasChangeGroupBtn ? <GroupDialogBBtn/> : ""}
            <Menu data={this.props.menu}/>
          </div>
        </div>
      </aside>
    );
  }
}

export default Drawer;
