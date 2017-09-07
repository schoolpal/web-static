import React from 'react';
import ContactList from '../contact/List'
import formatDate from '../../utils/formatDate'
import { TYPE_ID } from '../../utils/static'


export default class LeadsView extends React.Component {
    constructor(props) {
        super(props)
    }

    renderType(props) {
        if (props.type === 'oppor') {
            return (
                <li className="d-flex">
                    <label for="name" className="col-form-label d-block w100">类型</label>
                    <div className="flex-cell">
                        <p className="form-control-static">{props.data ? TYPE_ID[props.data.typeId] : ''}</p>
                    </div>
                </li>
            )
        } else {
            return null
        }
    }

    render() {
        return (
            <div className="main-container">
                <p className="ht pb-3 b-b">线索信息</p>
                <div className="row">
                    <div className="col">
                        <ul>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">学员姓名</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.student.name : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">学员姓别</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.student.genderText : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">学员年龄</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.student.age : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">在读年级</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.student.classGrade !== 'null' ? this.props.data.student.classGrade : '' : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">所在学校</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.student.schoolName : ''}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col">
                        <ul>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">家长姓名</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.parent.name : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">与孩子关系</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.parent.relation : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">联系电话</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.parent.cellphone : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">微信号</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.parent.weichat : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">家庭住址</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.parent.address : ''}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col">
                        <ul>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">课程类别</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.courseType !== 'null' ? this.props.data.courseType : '' : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">课程产品</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.courseName !== 'null' ? this.props.data.courseName : '' : ''}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col">
                        <ul>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">备注</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.note : ''}</p>
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
                                    <p className="form-control-static">{this.props.data ? this.props.data.sourceName : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">具体渠道</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.channelName : ''}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col">
                        <ul>
                            {
                                this.renderType(this.props)
                            }
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">阶段</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.stageName : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">状态</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.statusName : ''}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col">
                        <ul>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">所属组织</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.orgnizationName : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">所属用户</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.executiveName : ''}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col">
                        <ul>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">创建人</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? this.props.data.creatorName : ''}</p>
                                </div>
                            </li>
                            <li className="d-flex">
                                <label for="name" className="col-form-label d-block w100">创建时间</label>
                                <div className="flex-cell">
                                    <p className="form-control-static">{this.props.data ? formatDate(this.props.data.createTime) : ''}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <ContactList canEditd={false} leadsId={this.props.linkedId} />
            </div>
        )
    }
}