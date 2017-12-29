import React from "react";
import {NavLink} from "react-router-dom";
import {$} from "../../vendor";

import isPhone from "../../utils/isPhone";

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
        <div key={item.cId} data-children=".item">
          <div className="item">
            <a data-toggle="collapse" href={`#${item.cId}`} data-parent="#accordion" aria-expanded="true"
               aria-controls="accordion" className="d-block">
              <i
                className={`fa ${
                  SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
                  } fa-fw`}
                aria-hidden="true"
              />
              {item.cNameLong}
            </a>
            <div id={item.cId} className="collapse" role="tabpanel">
              {children}
            </div>
          </div>
        </div>
      );
    } else {
      menu.push(
        <NavLink
          key={item.cId}
          to={`/${SCHOOLPAL_CONFIG.AUTH[item.cId].PATH}`}
          className="d-block"
          activeClassName="active"
        >
          <i
            className={`fa ${
              SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
              } fa-fw`}
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
    this.drawer = $('#drawer');

    if (isPhone()) {
      $('#drawer').hide();
    } else {
      $('#drawer').show();
    }

    window.addEventListener('resize', () => {
      if (isPhone()) {
        $('#drawer').hide();
      } else {
        $('#drawer').show();
      }
    })
  }

  render() {
    return (
      <div id="drawer" className="aside-bar">
        <div id="accordion" role="tablist">
          {this.props.hasChangeGroupBtn ? <GroupDialogBBtn/> : ""}
          <Menu data={this.props.menu}/>
        </div>
      </div>
    );
  }
}

export default Drawer;
