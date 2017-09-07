import React from 'react';
import subTitle from '../../../utils/subTitle';
import { EditorButton, DelButton, BackButton } from '../../public/Button';
import command from '../../../utils/command'
import { contractQuery } from '../../../utils/api';
import formatDate from '../../../utils/formatDate';
import Dialog from '../../public/Dialog'
import DialogTips from '../../../utils/DialogTips';

function calculateAge(birthday) {
    const now = new Date();
    const start = new Date(birthday);

    return (now.getFullYear() - start.getFullYear());
}

export default class Editor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: {
                stuId: '',
                stuCode: '',
                stuName: '',
                stuBirthday: '',
                stuAge: '',
                stuGrade: '',

                parName: '',
                relation: '',
                parCellphone: '',
                parWechat: '',
                parEmail: '',
                parAddress: '',

                courseType: '',
                courseHours: '',
                courseTimes: '',

                oriPrice: '',
                discPrice: '',
                finalPrice: '',
                paid: '',

                code: '',
                type: '',
                startDate: '',
                endDate: '',

                createTime: ''
            }
        }
        this.handleEditor = this.handleEditor.bind(this);
        this.confirmDel = this.confirmDel.bind(this);
    }

    componentDidMount() {
        const dialogTips = DialogTips({ type: 'loading' })

        dialogTips.open()

        contractQuery(this.props.params.id)
            .done((data) => {
                let temp = {};

                $.each(this.state.data, (key, value) => {
                    if (key === 'stuBirthday' || key === 'startDate' || key === 'endDate' || key === 'createTime') {
                        temp[key] = formatDate(data[key]);
                    } else if (key === 'stuAge') {
                        temp[key] = calculateAge(formatDate(data.stuBirthday));
                    } else {
                        temp[key] = data[key];
                    };
                })

                this.setState({
                    data: temp
                })
            }).always(() => {
                dialogTips.close()
            })
    }

    renderCommand() {
        const path = this.props.location.pathname.replace(SCHOOLPAL_CONFIG.ROOTPATH, '');
        const commands = command(path);
        let temp = [];

        commands.map((item, index) => {
            if (item === 'Mod') {
                temp.push(<EditorButton key={index} action={this.handleEditor} />)
            }

            if (item === 'Del') {
                temp.push(<DelButton key={index} action={this.confirmDel} />)
            }
        })

        return temp;
    }

    handleEditor() {
        const editorPath = SCHOOLPAL_CONFIG.ROOTPATH + 'crm/sales/contract/edit/' + this.props.params.id

        this.props.router.push(editorPath)
    }

    confirmDel() { }

    render() {
        return (
            <div className="market">

                <h5>
                    <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;我的合同&nbsp;&nbsp;|&nbsp;&nbsp;<p className="d-inline text-muted">查看合同</p>
                    <div className="btn-group float-right mr-4" role="group">
                        <BackButton router={this.props.router} />
                    </div>
                    <div className="btn-group float-right mr-4" role="group">
                        {this.renderCommand()}
                    </div>
                </h5>

                <div className="main-container">
                    <p className="ht pb-3 b-b">基本信息</p>
                    <div className="row">
                        <div className="col">
                            <ul>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">学员ID</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.stuId}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">学员编号</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.stuCode}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">学员姓名</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.stuName}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">姓别</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static"></p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">出生年月</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.stuBirthday}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">年龄</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.stuAge}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col">
                            <ul>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">证件类型</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static"></p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">证件号码</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static"></p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">在读年级</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.stuGrade}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">所在学校</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static"></p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col">
                            <ul>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">家长姓名</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.parName}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">与孩子关系</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.relation}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">联系电话</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.parCellphone}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">微信号</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.parWechat}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">电子邮箱</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.parEmail}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">家庭住址</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.parAddress}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col"></div>
                    </div>

                    <p className="ht pt-3 pb-3 b-t b-b">合同信息</p>
                    <div className="row">
                        <div className="col">
                            <ul>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">课程类别</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.courseType}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">课程产品</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static"></p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">课时</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.courseHours}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">课次</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.courseTimes}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col">
                            <ul>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">合同金额</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.oriPrice}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">折扣金额</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.discPrice}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">应付金额</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.finalPrice}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">已付金额</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.paid}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col">
                            <ul>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">合同编号</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.code}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">合同类型</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.type}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">签约日期</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.startDate}</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">到期日期</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.endDate}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col">
                            <ul>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">所属组织</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static"></p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">所属用户</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static"></p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">创建人</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static"></p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">创建时间</label>
                                    <div className="flex-cell">
                                        <p className="form-control-static">{this.state.data.createTime}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}