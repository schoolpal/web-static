import React from 'react'

import areaChanged from "../../utils/areaChanged";

async function getArea() {
  return await import("../../utils/area");
}

class DialogArea extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasCounty: false,
      state: [],
      city: [],
      county: [],

      selectedState: "",
      selectedCity: "",
      selectedCounty: ""
    }
    this.initArea = this.initArea.bind(this);
    this.changed = this.changed.bind(this);
    this.selected = this.selected.bind(this);
    this.cancel = this.cancel.bind(this)
  }

  componentDidMount() {
    const dialogElem = document.getElementById("dialogArea");
    const selectElems = document.querySelectorAll("#dialogArea .js-textfield");

    window.componentHandler.upgradeElement(dialogElem);
    window.componentHandler.upgradeElements(selectElems);

    this.dialog = dialogElem["Dialog"];
    this.stateElem = document.getElementById("state");
    this.cityElem = document.getElementById("city");
    this.countyElem = document.getElementById("county");

    getArea().then(({AREA}) => {
        this.AREA = AREA;
        this.initArea();
      }
    )
  }

  initArea() {
    let data;

    if (this.props.defaults) {
      data = areaChanged(this.AREA, this.props.defaults[0], this.props.defaults[1], 0);
    } else {
      data = areaChanged(this.AREA, 0, 0, 0);
    }

    this.setState({
      selectedState: data.selectedState,
      selectedCity: data.selectedCity,
      selectedCounty: data.selectedCounty,
      state: data.stateArray,
      city: data.cityArray,
      county: data.countyArray,
      hasCounty: data.hasCounty
    }, () => {
      this.stateElem.parentNode["Textfield"].isChanged();
      this.cityElem.parentNode["Textfield"].isChanged();
      this.countyElem.parentNode["Textfield"].isChanged();
    })
  }

  changed(evt) {
    const targetValue = evt.target.value ? evt.target.value : 0;

    if (evt.target.id === "state") {
      const data = areaChanged(this.AREA, targetValue, 0, 0);

      this.setState({
        selectedState: data.selectedState,
        selectedCity: data.selectedCity,
        selectedCounty: data.selectedCounty,
        city: data.cityArray,
        county: data.countyArray,
        hasCounty: data.hasCounty
      }, () => {
        this.stateElem.parentNode["Textfield"].isChanged();
        this.cityElem.parentNode["Textfield"].isChanged();
        this.countyElem.parentNode["Textfield"].isChanged();
      })
    }

    if (evt.target.id === "city") {
      const data = areaChanged(this.AREA, this.state.selectedState, targetValue, 0);

      this.setState({
        selectedCity: data.selectedCity,
        selectedCounty: data.selectedCounty,
        city: data.cityArray,
        county: data.countyArray,
        hasCounty: data.hasCounty
      }, () => {
        this.cityElem.parentNode["Textfield"].isChanged();
        this.countyElem.parentNode["Textfield"].isChanged();
      })
    }

    if (evt.target.id === "county") {
      this.setState({selectedCounty: evt.target.value})
    }
  }

  selected() {
    let areaCodeArray = [];
    let areaTextArray = [];

    areaCodeArray.push(this.state.selectedState)
    areaCodeArray.push(this.state.selectedCity)
    areaTextArray.push(this.stateElem.options[this.stateElem.selectedIndex].text)
    areaTextArray.push(this.cityElem.options[this.cityElem.selectedIndex].text)

    if (this.state.hasCounty) {
      areaCodeArray.push(this.state.selectedCounty)
      areaTextArray.push(this.countyElem.options[this.countyElem.selectedIndex].text)
    }

    this.props.accept({areaCodeArray, areaTextArray})
    this.dialog.hide()
  }

  cancel() {
    this.dialog.hide()
  }

  render() {
    const countyClass = {display: `${this.state.hasCounty ? "flex" : "none"}`};

    return (
      <aside id="dialogArea" className="dialog js-dialog" role="alertdialog">
        <div className="dialog__surface">
          <header className="dialog__header">
            <h2 className="dialog__header__title">请选择地区</h2>
          </header>
          <section className="dialog__body">
            <ul className="list list--two-line">
              <li className="list-item">
                <span className="list-item__text">
                  选择省
                </span>
                <div className="list-item__end-form">
                  <div className="textfield js-textfield">
                    <select
                      className="textfield__input textfield__input-select"
                      id="state"
                      onChange={this.changed}
                      value={this.state.selectedState}
                    >
                      <option value=""></option>
                      {
                        this.state.state.map((item) => (
                          <option key={item.code} value={item.code}>{item.name}</option>
                        ))
                      }
                    </select>
                    <div className="textfield__icon">
                      <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                    <label className="textfield__label" htmlFor="state">请选择...</label>
                  </div>
                </div>
              </li>
              <li className="list-item">
                <span className="list-item__text">
                  选择市/区
                </span>
                <div className="list-item__end-form">
                  <div className="textfield js-textfield">
                    <select
                      className="textfield__input textfield__input-select"
                      id="city"
                      onChange={this.changed}
                      value={this.state.selectedCity}
                    >
                      <option value=""></option>
                      {
                        this.state.city.map((item) => (
                          <option key={item.code} value={item.code}>{item.name}</option>
                        ))
                      }
                    </select>
                    <div className="textfield__icon">
                      <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                    <label className="textfield__label" htmlFor="city">请选择...</label>
                  </div>
                </div>
              </li>
              <li style={countyClass} className="list-item">
                <span className="list-item__text">
                  选择区
                </span>
                <div className="list-item__end-form">
                  <div className="textfield js-textfield">
                    <select
                      className="textfield__input textfield__input-select"
                      id="county"
                      onChange={this.changed}
                      value={this.state.selectedCounty}
                    >
                      <option value=""></option>
                      {
                        this.state.county.map((item) => (
                          <option key={item.code} value={item.code}>{item.name}</option>
                        ))
                      }
                    </select>
                    <div className="textfield__icon">
                      <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                    <label className="textfield__label" htmlFor="county">请选择...</label>
                  </div>
                </div>
              </li>
            </ul>
          </section>
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

export default DialogArea;