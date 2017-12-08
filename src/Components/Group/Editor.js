import React from "react";

class Editor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main>
        <div className="grid grid--no-spacing">
          <div className="cell cell--8-col">
            <div className="grid grid--gutter-1 bg-grid shadow--2dp">
              <div className="cell cell--4-col cell--3-col-tablet bg">
                <div className="card">
                  <div className="card__title">
                    <div className="card__title-text">
                      <h1 className="card__title-text--large">选择组织</h1>
                    </div>
                  </div>
                  <div className="card__supporting-text">
                    <ul className="list groups js-groups">
                      <li className="groups-item" level="1">
                        <i
                          className="groups-item__start-detail fa fa-angle-down fa-fw groups-arrow"
                          aria-hidden="true"
                        />
                        Applications
                      </li>
                      <li
                        style={{ paddingLeft: "56px" }}
                        className="groups-item"
                        level="2"
                      >
                        <i
                          className="groups-item__start-detail fa fa-angle-down fa-fw groups-arrow"
                          aria-hidden="true"
                        />
                        Applications
                      </li>
                      <li
                        style={{ paddingLeft: "112px" }}
                        className="groups-item"
                        level="3"
                      >
                        <span className="groups-item__start-detail" />
                        Applications
                      </li>
                      <li
                        style={{ paddingLeft: "56px" }}
                        className="groups-item"
                        level="2"
                      >
                        <span className="groups-item__start-detail" />
                        Applications
                      </li>
                      <li className="groups-item" level="1">
                        <i
                          className="groups-item__start-detail fa fa-angle-down fa-fw groups-arrow"
                          aria-hidden="true"
                        />
                        Applications
                      </li>
                      <li
                        style={{ paddingLeft: "56px" }}
                        className="groups-item"
                        level="2"
                      >
                        <span className="groups-item__start-detail" />
                        Applications
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="cell cell--8-col cell--5-col-tablet bg">
                <div className="card">
                  <div className="card__title">
                    <div className="card__title-text">
                      <h1 className="card__title-text--large">详细信息</h1>
                    </div>
                  </div>
                  <ul className="list list--two-line">
                    <li className="list-item">
                      <span className="list-item__text">
                        输入类
                        <span className="list-item__text__secondary">
                          输入描述
                        </span>
                      </span>
                      <div className="list-item__end-form">
                        <div className="textfield js-textfield">
                          <input className="textfield__input" type="text" />
                          <label className="textfield__label" htmlFor="sample1">
                            Text...
                          </label>
                        </div>
                      </div>
                    </li>
                    <li className="list-item">
                      <span className="list-item__text">时间类</span>
                      <div className="list-item__end-form">
                        <div id="dateInput" className="textfield js-textfield">
                          <input
                            className="textfield__input"
                            type="text"
                            readOnly
                          />
                          <label className="textfield__label" htmlFor="sample1">
                            Text...
                          </label>
                        </div>
                      </div>
                    </li>
                    <li className="list-item">
                      <span className="list-item__text">
                        选择类
                        <span className="list-item__text__secondary">
                          选择描述
                        </span>
                      </span>
                      <div className="list-item__end-form">
                        <div className="textfield js-textfield">
                          <select
                            className="textfield__input textfield__input-select"
                            id="sample2"
                          >
                            <option value="" />
                            <option value="1">
                              selectfield-highlight-color
                            </option>
                            <option value="2">
                              selectfield-disabled-color
                            </option>
                            <option value="3">selectfield-error-color</option>
                          </select>
                          <div className="textfield__icon">
                            <i
                              className="fa fa-angle-down"
                              aria-hidden="true"
                            />
                          </div>
                          <label className="textfield__label" htmlFor="sample2">
                            Select...
                          </label>
                        </div>
                      </div>
                    </li>
                    <li className="list-item">
                      <span className="list-item__text">
                        真假类
                        <span className="list-item__text__secondary">描述</span>
                      </span>
                      <div className="list-item__end-form">
                        <label className="switch js-switch" htmlFor="switch-1">
                          <input
                            type="checkbox"
                            id="switch-1"
                            className="switch__input"
                          />
                          <span className="switch__label" />
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Editor;
