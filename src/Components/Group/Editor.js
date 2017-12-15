import React from "react";
import ReactDOM from 'react-dom'
import {Redirect} from 'react-router-dom'

import Header from "../Header/Header"
import DialogGroup from "../Dialog/DialogGroup";
import DialogArea from "../Dialog/DialogArea";
import Progress from "../Progress/Progress"

import historyBack from "../../utils/historyBack";
import getGroup from "../../api/getGroup";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAnimating: false,
      isCreated: false,

      parentId: "",
      parentName: "",
      areaCodeArray: [],
      areaTextArray: []
    }
    this.createGroupsDialog = this.createGroupsDialog.bind(this);
    this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
    this.createAreaDialog = this.createAreaDialog.bind(this);
    this.acceptAreaDialog = this.acceptAreaDialog.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
  }

  componentDidMount() {
    const data = getGroup().data;
    const areaCodeArray = [];
    const areaTextArray = [];

    areaCodeArray.push(data.cStateCode)
    areaCodeArray.push(data.cCityCode)
    areaTextArray.push(data.cState)
    areaTextArray.push(data.cCity)

    this.setState({
      parentId: data.cParentId,
      areaCodeArray: areaCodeArray,
      areaTextArray: areaTextArray
    })

    window.componentHandler.upgradeAllRegistered();
    document.getElementById("name").parentNode["Textfield"].change(data.cName)
    document.getElementById("code").parentNode["Textfield"].change(data.cCode)
    document.getElementById("address").parentNode["Textfield"].change(data.cAddress)
    document.getElementById("owner").parentNode["Textfield"].change(data.cOwner)
    document.getElementById("phone").parentNode["Textfield"].change(data.cOwnerPhone)
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
    if (this.groupDialog === undefined) {
      this.groupContainer = document.createElement('div');
      ReactDOM.render(
        <DialogGroup accept={this.acceptGroupDialog}/>,
        document.body.appendChild(this.groupContainer)
      );

      const dialogElem = document.getElementById("dialogGroup");
      this.groupDialog = dialogElem["Dialog"];
    }

    this.groupDialog.show();
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
          defaults={this.state.areaCodeArray}
          accept={this.acceptAreaDialog}
        />,
        document.body.appendChild(this.areaContainer)
      );

      const dialogElem = document.getElementById("dialogArea");
      this.areaDialog = dialogElem["Dialog"];
    }

    this.areaDialog.show();
  }

  acceptAreaDialog(selected) {
    this.setState(selected)
  }

  updateGroup() {
    if (!this.form.checkValidity() || !this.state.parentId || !this.state.areaCodeArray.length) {
      return
    }

    const toast = document.getElementById("toast");
    let query = {};

    for (let i = 0; i < this.form.length; i++) {
      query[this.form[i].name] = this.form[i].value;
    }

    query.id = this.props.match.params.groupId;
    query.parentId = this.state.parentId;
    query.state = this.state.areaCodeArray[0];
    query.city = this.state.areaCodeArray[1];
    query.county = this.state.areaCodeArray[2] || "";

    console.log(query)
    this.setState({isAnimating: true});
    setTimeout(() => {
      toast["Snackbar"].showSnackbar({message: "更新成功，将跳转到列表页！"})
      this.setState({isCreated: true})
    }, 2500)
  }

  render() {
    if (this.state.isCreated) {
      return <Redirect to="/groups"/>
    } else {
      return (
        <div className="layout__container">
          <Header title="组织编辑" profile={this.props.profile}/>
          <main>
            <div className="grid grid--no-spacing">
              <div className="cell--3-offset cell--1-offset-tablet"></div>
              <div className="cell--6-col">
                <div className="card shadow--2dp">
                  <Progress isAnimating={this.state.isAnimating}/>

                  <div className="card__title">
                    <div className="card__title-text">
                      <h2 className="card__title-text--large">组织信息</h2>
                    </div>
                  </div>
                  <form ref={(dom) => {
                    this.form = dom
                  }} onSubmit={this.createGroup}>
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
                  <div className="card__actions card--border">
                    <div className="layout-spacer"></div>
                    <button onClick={() => {
                      historyBack(this.props.history)
                    }} className="button js-button">
                      返回
                    </button>
                    <button
                      onClick={this.updateGroup}
                      className="button button--primary js-button"
                      disabled={this.state.isAnimating}
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
              <div className="cell--3-offset cell--1-offset-tablet"></div>
            </div>
          </main>
        </div>
      )
    }
  }
}

export default Editor;
