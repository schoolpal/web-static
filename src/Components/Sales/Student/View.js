import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import DialogUser from '../../Dialog/DialogUser';
import Progress from "../../Progress/Progress";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import fmtDate from "../../../utils/fmtDate";
import CONFIG from "../../../utils/config";
import calculateAge from "../../../utils/calculateAge";

const NextBtn = ({id, ids}) => {
  const curIndex = ids.indexOf(id);

  if ((curIndex + 1) === ids.length) {
    return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
  }

  return (
    <Link
      className="btn btn-light"
      to={{
        pathname: `/sales/oppor/${ids[curIndex + 1]}`,
        state: {ids: ids}
      }}
    >
      下一条
    </Link>
  )
};

const PrevBtn = ({id, ids}) => {
  const curIndex = ids.indexOf(id);

  if (curIndex === 0) {
    return <button type="button" className="btn btn-light" disabled={true}>上一条</button>
  }

  return (
    <Link
      className="btn btn-light"
      to={{
        pathname: `/sales/oppor/${ids[curIndex - 1]}`,
        state: {ids: ids}
      }}
    >
      上一条
    </Link>
  )
};

class View extends React.Component {
  constructor(props) {
    super(props);

    this.commands = this.props.commands.filter((command) => (command === 'Mod'));
    this.title = fmtTitle(this.props.location.pathname);
    this.state = {
      group: this.props.changedCrmGroup,
      redirectToReferrer: false,
      redirectToList: false,
      isAnimating: false,
      id: this.props.match.params.studentId,
      ids: [],
      data: null
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.modAction = this.modAction.bind(this);
    this.delAction = this.delAction.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let list = await ajax('/sales/customer/student/list.do', {organizationId: this.state.group.id});
        let data = await ajax('/sales/customer/student/query.do', {id: this.state.id});
        const ids = list.map((student) => (student.id));

        this.setState({data, ids});
      } catch (err) {
        if (err.errCode === 401) {
          this.setState({redirectToReferrer: true})
        } else {
          this.createDialogTips(`${err.errCode}: ${err.errText}`);
        }
      }
    };

    request();
    mainSize();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.changedCrmGroup !== nextProps.changedCrmGroup) {
      this.setState({redirectToList: true})
    }
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

  modAction() {
    this.props.history.push(`${this.props.match.url}/edit`);
  }

  delAction() {
    const request = async () => {
      try {
        let rs = await ajax('/mkt/activity/del.do', {id: this.state.id});
        this.setState({redirectToList: true});
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

    if (this.state.redirectToList) {
      return (
        <Redirect to="/sales/student"/>
      )
    }

    if (!this.state.data) {
      return (
        <div>
          <h5 id="subNav">
            <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
            &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;

            <div className="btn-group float-right ml-4" role="group">
              <button onClick={() => {
                this.props.history.push('/sales/contract');
              }} type="button" className="btn btn-light">返回
              </button>
            </div>
          </h5>

          <div id="main" className="main p-3">
            <div className="row justify-content-md-center">
              <div className="col col-12">
                <div className="card">
                  <div className="card-body">数据加载中...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <h5 id="subNav">
          <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
          &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
          <p className="d-inline text-muted">{this.state.data.name}</p>

          <div className="btn-group float-right ml-4" role="group">
            <PrevBtn id={this.state.id} ids={this.state.ids}/>
            <NextBtn id={this.state.id} ids={this.state.ids}/>
          </div>
          <div className="btn-group float-right ml-4" role="group">
            <button onClick={() => {
              this.props.history.push('/sales/student');
            }} type="button" className="btn btn-light">返回
            </button>
          </div>
          <Commands
            commands={this.commands}
            modAction={this.modAction}
          />
        </h5>

        <div id="main" className="main p-3">
          <nav>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              <a className="nav-item nav-link active" id="nav-student-tab" data-toggle="tab" href="#nav-student"
                 role="tab" aria-controls="nav-student" aria-selected="true">学员信息</a>
              <a className="nav-item nav-link" id="nav-parent-tab" data-toggle="tab" href="#nav-parent" role="tab"
                 aria-controls="nav-parent" aria-selected="false">家长信息</a>
              <a className="nav-item nav-link" id="nav-contract-tab" data-toggle="tab" href="#nav-contract" role="tab"
                 aria-controls="nav-contract" aria-selected="false">合同信息</a>
            </div>
          </nav>
          <div className="tab-content" id="nav-tabContent">
            <div className="tab-pane fade show active" id="nav-student" role="tabpanel"
                 aria-labelledby="nav-student-tab">
              <div className="row justify-content-md-center">
                <div className="col col-12">
                  <div className="card border-top-0">
                    <div className="card-body">
                      <div className="row">
                        <div className="col">
                          <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">学员姓名</label>
                            <div className="col-7">
                              <input
                                type="text"
                                readOnly={true}
                                className="form-control-plaintext"
                                value={this.state.data.name}
                              />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">学员姓别</label>
                            <div className="col-7">
                              <input
                                type="text"
                                readOnly={true}
                                className="form-control-plaintext"
                                value={''}
                              />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">出生年月</label>
                            <div className="col-7">
                              <input
                                type="text"
                                readOnly={true}
                                className="form-control-plaintext"
                                value={fmtDate(this.state.data.birthday)}
                              />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">学员年龄</label>
                            <div className="col-7">
                              <input
                                type="text"
                                readOnly={true}
                                className="form-control-plaintext"
                                value={calculateAge(new Date(this.state.data.birthday))}
                              />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">在读年级</label>
                            <div className="col-7">
                              <input
                                type="text"
                                readOnly={true}
                                className="form-control-plaintext"
                                value={this.state.data.classGrade}
                              />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">所在学校</label>
                            <div className="col-7">
                              <input
                                type="text"
                                readOnly={true}
                                className="form-control-plaintext"
                                value={''}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">证件类型</label>
                            <div className="col-7">
                              <input
                                type="text"
                                readOnly={true}
                                className="form-control-plaintext"
                                value={CONFIG.DOCUMENT[this.state.data.idType]}
                              />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">证件号码</label>
                            <div className="col-7">
                              <input
                                type="text"
                                readOnly={true}
                                className="form-control-plaintext"
                                value={this.state.data.idCode}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col"/>
                        <div className="col"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="nav-parent" role="tabpanel" aria-labelledby="nav-parent-tab">...</div>
            <div className="tab-pane fade" id="nav-contract" role="tabpanel" aria-labelledby="nav-contract-tab">...
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default View;