import React from 'react'
import {Redirect} from 'react-router-dom'

import Form from "./Form";
import Header from "../Header/Header"
import Progress from "../Progress/Progress"

import historyBack from "../../utils/historyBack";
import getRole from "../../api/getRole";

class Editor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAnimating: false,
      isCreated: false,

      data: null
    }
    this.updateRole = this.updateRole.bind(this);
  }

  componentDidMount() {
    const data = getRole().data;

    setTimeout(() => {
      this.setState({
        data: data
      })
    }, 2000)
  }

  updateRole() {
    const toast = document.getElementById("toast");
    let query = this.form.getFormValue();

    if (!query) {
      return;
    }

    query.orgId = this.props.location.state.groupId;

    console.log(query)
    this.setState({isAnimating: true});
    setTimeout(() => {
      toast["Snackbar"].showSnackbar({message: "编辑成功，将跳转到列表页！"})
      this.setState({isCreated: true})
    }, 2500)
  }

  render() {
    if (this.state.isCreated) {
      return <Redirect to="/roles"/>
    } else {
      return (
        <div className="layout__container">
          <Header title="角色编辑" profile={this.props.profile}/>
          <main>
            <div className="grid grid--no-spacing">
              <div className="cell--3-offset cell--1-offset-tablet"></div>
              <div className="cell--6-col">
                <div className="card shadow--2dp">
                  <Progress isAnimating={this.state.isAnimating}/>

                  <div className="card__title">
                    <div className="card__title-text">
                      <h2 className="card__title-text--large">角色信息</h2>
                    </div>
                  </div>

                  <Form
                    isEditor={true}
                    data={this.state.data}
                    ref={(dom) => {
                      this.form = dom
                    }}
                  />

                  <div className="card__actions card--border">
                    <div className="layout-spacer"></div>
                    <button onClick={() => {
                      historyBack(this.props.history)
                    }} className="button js-button">
                      返回
                    </button>
                    <button
                      onClick={this.updateRole}
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