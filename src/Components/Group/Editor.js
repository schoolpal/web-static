import React from "react";
import {Redirect} from 'react-router-dom'

import Form from "./Form";
import Header from "../Header/Header"
import Progress from "../Progress/Progress"

import historyBack from "../../utils/historyBack";
import mainSize from "../../utils/mainSize";
import getGroup from "../../api/getGroup";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAnimating: false,
      updated: false,

      data: null
    };

    this.updated = this.updated.bind(this);
  }

  componentDidMount() {
    const data = getGroup().data;

    setTimeout(() => {
      this.setState({
        data: data
      })
    }, 2000);

    mainSize();
  }

  updated() {
    const toast = document.getElementById("toast");
    let query = this.form.getFormValue();

    if (!query) {
      return;
    }

    query.id = this.props.match.params.groupId;

    console.log(query)
    // this.setState({isAnimating: true});
    // setTimeout(() => {
    //   toast["Snackbar"].showSnackbar({message: "更新成功，将跳转到列表页！"})
    //   this.setState({updated: true})
    // }, 2500)
  }

  render() {
    if (this.state.updated) {
      return <Redirect to="/groups"/>
    } else {
      return (
        <div>
          <h5 id="subNav">
            <i className="fa fa-sitemap" aria-hidden="true"/>
            &nbsp;组织管理&nbsp;&nbsp;|&nbsp;&nbsp;
            <p className="d-inline text-muted">组织编辑</p>
            <div className="btn-group float-right" role="group">
              <button onClick={() => {
                historyBack(this.props.history)
              }} type="button" className="btn btn-light">返回
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.updated}
                disabled={this.state.isAnimating}
              >
                保存
              </button>
            </div>
          </h5>

          <div id="main" className="main p-3">
            {/*<Progress isAnimating={this.state.isAnimating}/>*/}

            <Form
              isEditor={true}
              data={this.state.data}
              ref={(dom) => {
                this.form = dom
              }}
            />
          </div>
        </div>
      )
    }
  }
}

export default Editor;
