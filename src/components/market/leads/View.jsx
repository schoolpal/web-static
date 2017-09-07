import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import ContactList from '../../contact/List'
import subTitle from '../../../utils/subTitle';
import SelectUserPanel from '../../public/SelectUserPanel';
import { EditorButton, DelButton, BackButton, AssignButton, ConvertButton } from '../../public/Button';
import command from '../../../utils/command'
import { orgList, leadsQuery, leadsAssign, leadsConvert, leadsDel } from '../../../utils/api';
import Dialog from '../../public/Dialog'
import DialogTips from '../../../utils/DialogTips';
import formatDate from '../../../utils/formatDate'

export default class Editor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            orgList: [],
            modalStatus: 'closed',
        }
        this.renderCommand = this.renderCommand.bind(this)
        this.handleEditor = this.handleEditor.bind(this)
        this.handleModal = this.handleModal.bind(this)
        this.handleAssign = this.handleAssign.bind(this)
        this.handleConvert = this.handleConvert.bind(this)
        this.handleDel = this.handleDel.bind(this)
        this.confirmDel = this.confirmDel.bind(this)
        this.getModalOption = this.getModalOption.bind(this)
    }

    componentDidMount() {
        const dialogTips = DialogTips({ type: 'loading' })

        dialogTips.open()
        $.when(
            orgList(),
            leadsQuery(this.props.params.id)
        ).done((org, data) => {
            this.setState({
                orgList: org.original,
                data: data,
                modalType: null,
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

            if (item === 'Assign') {
                temp.push(<AssignButton key={index} action={this.handleAssign} />)
            }

            if (item === 'Convert') {
                temp.push(<ConvertButton key={index} action={this.handleConvert} />)
            }
        })

        return temp;
    }

    handleEditor() {
        const editorPath = SCHOOLPAL_CONFIG.ROOTPATH + 'crm/market/leads/edit/' + this.props.params.id

        this.props.router.push(editorPath)
    }

    handleModal(selected, modal) {
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })
        const data = update(this.state.data, {
            executiveId: { $set: selected.user.id },
            executiveName: { $set: selected.user.name },
        })

        loading.open()

        if (this.state.modalType === 'assign') {
            leadsAssign({ id: this.props.params.id, assigneeId: selected.user.id })
                .done(() => {
                    loading.close()
                    success.open()

                    this.setState({
                        data: data
                    })

                    setTimeout(() => {
                        success.close()
                        modal.modal('hide');
                    }, 2000)
                })
                .fail(() => {
                    loading.close()
                    fail.open()
                })
        }

        if (this.state.modalType === 'convert') {
            leadsConvert({ id: this.props.params.id, assigneeId: selected.user.id })
                .done(() => {
                    loading.close()
                    success.open()

                    this.setState({
                        data: data
                    })

                    setTimeout(() => {
                        success.close()
                        modal.modal('hide');
                    }, 2000)
                })
                .fail(() => {
                    loading.close()
                    fail.open()
                })
        }
    }

    getModalOption() {
        return {
            org: {
                id: this.state.data.orgnizationId,
                name: this.state.data.orgnizationName
            },
            user: {
                id: this.state.data.executiveId,
                name: this.state.data.executiveName
            },
            student: this.state.data.student
        }
    }

    handleAssign() {
        this.setState({
            modalType: 'assign'
        })

        const div = document.createElement('div');
        const option = this.getModalOption()

        ReactDOM.render(
            <SelectUserPanel
                container={div}
                orgList={this.state.orgList}
                option={option}
                action={this.handleModal}
            />,
            document.body.appendChild(div)
        )
    }

    handleConvert() {
        this.setState({
            modalType: 'convert'
        })

        const div = document.createElement('div');
        const option = this.getModalOption()

        ReactDOM.render(
            <SelectUserPanel
                container={div}
                orgList={this.state.orgList}
                option={option}
                action={this.handleModal}
            />,
            document.body.appendChild(div)
        )
    }

    handleDel() {
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })

        loading.open()
        leadsDel(this.props.params.id)
            .done(() => {
                loading.close()
                success.open()

                setTimeout(() => {
                    success.close()
                    this.props.router.replace(SCHOOLPAL_CONFIG.ROOTPATH + 'crm/market/leads')
                }, 2000)
            })
            .fail(() => {
                loading.close()
                fail.open()
            })
    }

    confirmDel() {
        const div = document.createElement('div');

        ReactDOM.render(
            <Dialog
                container={div}
                text={'是否确认删除此线索 ？'}
                action={this.handleDel}
            />,
            document.body.appendChild(div)
        )
    }

    render() {
        return (
            <div className="market">
                <form ref={(dom) => { this.editorDom = dom }}>

                    <h5>
                        <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;销售线索&nbsp;&nbsp;|&nbsp;&nbsp;<p className="d-inline text-muted">{this.state.data ? this.state.data.student.name : '--'}</p>
                        <div className="btn-group float-right mr-4" role="group">
                            <button type="button" className="btn btn-secondary">上一条</button>
                            <button type="button" className="btn btn-secondary">下一条</button>
                        </div>
                        <div className="btn-group float-right mr-4" role="group">
                            <BackButton router={this.props.router} />
                        </div>
                        <div className="btn-group float-right mr-4" role="group">
                            {this.renderCommand()}
                        </div>
                    </h5>

                    <div className="main-container">
                        <p className="ht pb-3 b-b">线索信息</p>
                        <div className="row">
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">学员姓名</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.student.name : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">学员姓别</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.student.genderText : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">学员年龄</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.student.age : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">在读年级</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.student.classGrade !== 'null' ? this.state.data.student.classGrade : '' : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">所在学校</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.student.schoolName : ''}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">家长姓名</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.parent.name : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">与孩子关系</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.parent.relation : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">联系电话</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.parent.cellphone : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">微信号</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.parent.weichat : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">家庭住址</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.parent.address : ''}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">课程类别</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.courseType !== 'null' ? this.state.data.courseType : '' : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">课程产品</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.courseName !== 'null' ? this.state.data.courseName : '' : ''}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">备注</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.note : ''}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <p className="ht pt-3 pb-3 b-t b-b">线索信息</p>
                        <div className="row">
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">信息来源</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.sourceName : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">具体渠道</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static"></p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">线索阶段</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.stageName : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">线索状态</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.statusName : ''}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">所属组织</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.orgnizationName : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">所属用户</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.executiveName : ''}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">创建人</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? this.state.data.creatorName : ''}</p>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">创建时间</label>
                                        <div className="flex-cell">
                                            <p className="form-control-static">{this.state.data ? formatDate(this.state.data.createTime) : ''}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <ContactList ccanEditd={true} leadsId={this.props.params.id} />
                    </div>
                </form>
            </div>
        )
    }
}