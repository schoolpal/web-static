import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import Form from "./Form";
import DialogTips from "../Dialog/DialogTips";
import Progress from "../Progress/Progress"

import mainSize from "../../utils/mainSize";
import historyBack from "../../utils/historyBack";
import ajax from "../../utils/ajax";

class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: false,
      isAnimating: false,
      isUpdated: false,
      id: this.props.match.params.userId,

      data: null
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    mainSize()
  }

  componentWillUnmount() {
    if (this.tipsContainer) {
      document.body.removeChild(this.tipsContainer);
    }
  }

  createDialogTips(text) {
    if (this.tips === undefined) {
      this.tipsContainer = document.createElement('div');

      ReactDOM.render(
        <DialogTips
          accept={this.logout}
          title="提示"
          text={text}
          ref={(dom) => {
            this.tips = dom
          }}
        />,
        document.body.appendChild(this.tipsContainer)
      );
    } else {
      this.tips.setText(text);
    }

    this.tips.dialog.modal('show');
  }

  update() {
    const toast = document.getElementById("toast");
    let query = this.form.getFormValue();

    if (!query) {
      return;
    }

    query.userId = this.props.match.params.userId;
    query.orgId = this.props.location.state.groupId;

    this.setState({isAnimating: true});

    const request = async () => {
      try {
        let rs = await ajax('/sys/user/mod.do', query);

        this.setState({isUpdated: true})
      } catch (err) {
        if (err.errCode === 401) {
          this.setState({redirectToReferrer: true})
        } else {
          this.createDialogTips(`${err.errCode}: ${err.errText}`);
        }
      } finally {
        this.setState({isAnimating: false});
      }
    };

    request()
  }

  render() {
    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={{
          pathname: '/login',
          state: {from: this.props.location}
        }}/>
      )
    }

    if (this.state.isUpdated) {
      return (
        <Redirect to={{
          pathname: '/users',
          state: {groupId: this.props.location.state.groupId}
        }}/>
      )
    }

    return (
      <div>
        <h5 id="subNav">
          <i className="fa fa-users" aria-hidden="true"/>
          &nbsp;用户管理&nbsp;&nbsp;|&nbsp;&nbsp;
          <p className="d-inline text-muted">编辑用户</p>
          <div className="btn-group float-right" role="group">
            <button onClick={() => {
              this.props.history.push('/users', {groupId: this.props.location.state.groupId});
            }} type="button" className="btn btn-light">取消
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.update}
              disabled={this.state.isAnimating}
            >
              保存
            </button>
          </div>
        </h5>

        <div id="main" className="main p-3">
          <Progress isAnimating={this.state.isAnimating}/>

          <Form
            isEditor={true}
            editorId={this.state.id}
            groupId={this.props.location.state.groupId}
            groupName={this.props.location.state.groupName}
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

export default Create;