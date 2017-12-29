import React from "react";
import {Redirect} from 'react-router-dom'

import Form from "./Form";
import Progress from "../Progress/Progress"

import historyBack from "../../utils/historyBack";
import mainSize from "../../utils/mainSize";
import ajax from "../../utils/ajax";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: false,
      isAnimating: false,
      isUpdated: false,
      id: this.props.match.params.groupId,
      data: null
    };
    this.updated = this.updated.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let data = await ajax('/org/query.do', {id: this.state.id});

        this.setState({data: data})
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

    request();
    mainSize();
  }

  updated() {
    let query = this.form.getFormValue();

    if (!query) {
      return;
    }

    this.setState({isAnimating: true});
    query.id = this.state.id;

    const request = async () => {
      try {
        let rs = await ajax('/sys/org/mod.do', query);

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
      return <Redirect to="/groups"/>
    }

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
          <Progress isAnimating={this.state.isAnimating}/>

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

export default Editor;
