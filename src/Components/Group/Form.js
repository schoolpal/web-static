import React from 'react'
import ReactDOM from 'react-dom'

import DialogGroup from "../Dialog/DialogGroup"
import DialogArea from "../Dialog/DialogArea"

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      parentId: "",
      parentName: "",
      areaCodeArray: [],
      areaTextArray: []
    }

    this.createGroupsDialog = this.createGroupsDialog.bind(this);
    this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
    this.createAreaDialog = this.createAreaDialog.bind(this);
    this.acceptAreaDialog = this.acceptAreaDialog.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
  }

  componentDidMount() {
    const elems = this.form.querySelectorAll(".js-textfield");

    if (!this.props.isEditor && this.props.parentGroup) {
      this.setState({
        parentId: this.props.parentGroup.id,
        parentName: this.props.parentGroup.name
      });
    }

    if (elems.length) {
      window.componentHandler.upgradeElements(elems);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      const areaCodeArray = [];
      const areaTextArray = [];

      areaCodeArray.push(nextProps.data.cStateCode)
      areaCodeArray.push(nextProps.data.cCityCode)
      areaTextArray.push(nextProps.data.cState)
      areaTextArray.push(nextProps.data.cCity)

      this.setState({
        parentId: nextProps.data.cParentId,
        areaCodeArray: areaCodeArray,
        areaTextArray: areaTextArray
      }, () => {
        const elems = this.form.querySelectorAll(".js-textfield");

        window.componentHandler.upgradeElements(elems);
        document.getElementById("name").parentNode["Textfield"].change(nextProps.data.cName)
        document.getElementById("code").parentNode["Textfield"].change(nextProps.data.cCode)
        document.getElementById("address").parentNode["Textfield"].change(nextProps.data.cAddress)
        document.getElementById("owner").parentNode["Textfield"].change(nextProps.data.cOwner)
        document.getElementById("phone").parentNode["Textfield"].change(nextProps.data.cOwnerPhone)
      })
    }
  }

  componentWillUnmount() {
    if (this.groupContainer) {
      document.body.removeChild(this.groupContainer);
    }

    if (this.areaContainer) {
      document.body.removeChild(this.areaContainer);
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
      parentId: selected.getAttribute("gid"),
      parentName: selected.textContent
    })
  }

  createAreaDialog() {
    if (this.areaDialog === undefined) {
      this.areaContainer = document.createElement('div');
      ReactDOM.render(
        <DialogArea
          accept={this.acceptAreaDialog}
          ref={(dom) => {
            this.area = dom
          }}
        />,
        document.body.appendChild(this.areaContainer)
      );
    }

    this.area.dialog.show();
  }

  acceptAreaDialog(selected) {
    this.setState(selected)
  }

  getFormValue() {
    if (!this.form.checkValidity() || !this.state.parentId || !this.state.areaCodeArray.length) {
      return
    }

    let query = {};

    for (let i = 0; i < this.form.length; i++) {
      query[this.form[i].name] = this.form[i].value;
    }

    query.parentId = this.state.parentId;
    query.state = this.state.areaCodeArray[0];
    query.city = this.state.areaCodeArray[1];
    query.county = this.state.areaCodeArray[2] || "";

    return query;
  }

  render() {
    if (this.props.isEditor && !this.props.data) {
      return (
        <form ref={(dom) => {
          this.form = dom
        }}>
          <ul className="list list--two-line">
            <li className="list-item">
            <span className="list-item__text">
              数据加载中...
            </span>
            </li>
          </ul>
        </form>
      )
    } else {
      return (
        <form ref={(dom) => {
          this.form = dom
        }}>
          <ul className="list list--two-line">
            <li className="list-item">
              <span className="list-item__text">
              组织名称
              <span className="list-item__text__secondary">必填字段</span>
              </span>
              <div className="list-item__end-form">
                <div className="textfield js-textfield is-upgraded">
                  <input id="name" name="name" className="textfield__input" type="text" required={true}/>
                  <label className="textfield__label" htmlFor="name">组织名称...</label>
                </div>
              </div>
            </li>
            <li className="list-item">
              <span className="list-item__text">
              组织代码
              <span className="list-item__text__secondary">必填字段</span>
              </span>
              <div className="list-item__end-form">
                <div className="textfield js-textfield is-upgraded">
                  <input id="code" name="code" className="textfield__input" type="text" required={true}/>
                  <label className="textfield__label" htmlFor="code">组织代码...</label>
                </div>
              </div>
            </li>
            <li className="list-item">
              <span className="list-item__text">
              父级组织
              <span className="list-item__text__secondary">必填字段</span>
              </span>
              <div className="list-item__end-form">
                {this.state.parentName}
                <div onClick={this.createGroupsDialog} className="button button--icon js-button">
                  <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </div>
              </div>
            </li>
            <li className="list-item">
              <span className="list-item__text">
              所在地区
              <span className="list-item__text__secondary">必填字段</span>
              </span>
              <div className="list-item__end-form">
                {this.state.areaTextArray.join(" ")}
                <div onClick={this.createAreaDialog} className="button button--icon js-button">
                  <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </div>
              </div>
            </li>
            <li className="list-item">
              <span className="list-item__text">
              详细地址
              <span className="list-item__text__secondary">必填字段</span>
              </span>
              <div className="list-item__end-form">
                <div className="textfield js-textfield">
                  <input id="address" name="address" className="textfield__input" type="text"
                         required={true}/>
                  <label className="textfield__label" htmlFor="address">详细地址...</label>
                </div>
              </div>
            </li>
            <li className="list-item">
              <span className="list-item__text">
              负责人
              <span className="list-item__text__secondary">必填字段</span>
              </span>
              <div className="list-item__end-form">
                <div className="textfield js-textfield is-upgraded">
                  <input id="owner" name="owner" className="textfield__input" type="text" required={true}/>
                  <label className="textfield__label" htmlFor="owner">负责人...</label>
                </div>
              </div>
            </li>
            <li className="list-item">
              <span className="list-item__text">
              联系电话
              <span className="list-item__text__secondary">必填字段</span>
              </span>
              <div className="list-item__end-form">
                <div className="textfield js-textfield is-upgraded">
                  <input id="phone" name="phone" className="textfield__input" type="text" required={true}/>
                  <label className="textfield__label" htmlFor="phone">联系电话...</label>
                </div>
              </div>
            </li>
          </ul>
        </form>
      )
    }
  }
}

export default Form;