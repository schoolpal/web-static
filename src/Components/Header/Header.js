import React from "react";

const Header = ({ title }) => (
  <header className="toolbar">
    <div className="toolbar__row">
      <button
        id="drawer-button"
        className="button button--icon toolbar__icon js-button"
      >
        <i className="fa fa-bars" aria-hidden="true" />
      </button>
      <span className="toolbar__title">{title}</span>
      <div className="toolbar__spacer" />
      <button
        id="menu-button"
        className="button button--icon toolbar__icon js-button"
      >
        <i className="fa fa-ellipsis-v" aria-hidden="true" />
      </button>
      <div className="menu menu--bottom-right js-menu" htmlFor="menu-button">
        <div className="list list--two-line list--avatar-list">
          <div className="list-item">
            <span className="list-item__start-detail">
              <img src="http://www.risecenter.com/images/index/rise_logo.png" />
            </span>
            <span className="list-item__text">
              Bryan Cranston
              <span className="list-item__text__secondary">62 Episodes</span>
            </span>
          </div>
        </div>
        <div className="menu__item">Some Action</div>
        <div className="menu__item">Another Action</div>
        <div className="menu__item">Yet Another Action</div>
      </div>
    </div>
  </header>
);

export default Header;
