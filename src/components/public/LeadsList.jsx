import React from 'react';
import { Link } from 'react-router'
import formatDate from '../../utils/formatDate'

export default class LeadsList extends React.Component {
    constructor(props) {
        super(props)

        this.renderItem = this.renderItem.bind(this)
    }

    renderItem(data) {
        let list = [];

        if (data.length) {
            list = data.map((item) => {
                return (
                    <tr key={item.id}>
                        <td>{item.creatorName}</td>
                        <td>{formatDate(item.createTime)}</td>
                        <td>{item.orgnizationName}</td>
                        <td>{item.executiveName}</td>
                        <td>{item.sourceName}</td>
                        <td>{item.channelName}</td>
                        <td>{item.stageName}</td>
                        <td>{item.statusName}</td>
                        <td>
                            <Link to={this.props.path + '/' + item.id}>{item.student.name}</Link>
                        </td>
                        <td>{item.student.genderText !== 'null' ? item.student.genderText : '--'}</td>
                        <td>{item.student.age !== 'null' ? item.student.age : '--'}</td>
                        <td>{item.student.classGrade !== 'null' ? item.student.classGrade : '--'}</td>
                        <td>{item.student.schoolName ? item.student.schoolName : '--'}</td>
                        <td>
                            <Link to={this.props.path + '/' + item.id}>{item.parent.name}</Link>
                        </td>
                        <td>{item.parent.relation ? item.parent.relation : '--'}</td>
                        <td>{item.parent.cellphone ? item.parent.cellphone : '--'}</td>
                        <td>{item.parent.weichat ? item.parent.weichat : '--'}</td>
                        <td>{item.parent.address ? item.parent.address : '--'}</td>
                        <td>{item.courseType !== 'null' ? item.courseType : '--'}</td>
                        <td>{item.courseName !== 'null' ? item.courseName : '--'}</td>
                        <td>{item.note ? item.note : '--'}</td>
                        <td>--</td>
                    </tr>
                )
            })
        }

        return list;
    }

    render() {
        return (
            <table className='table table-bordered table-sm'>
                <thead>
                    <tr>
                        <th>创建人</th>
                        <th>创建时间</th>
                        <th>所属组织</th>
                        <th>所属用户</th>
                        <th>来源</th>
                        <th>渠道</th>
                        <th>阶段</th>
                        <th>状态</th>
                        <th>学员姓名</th>
                        <th>性别</th>
                        <th>年龄</th>
                        <th>在读年级</th>
                        <th>所在学校</th>
                        <th>家长姓名</th>
                        <th>与学员关系</th>
                        <th>电话号码</th>
                        <th>微信号</th>
                        <th>家庭住址</th>
                        <th>课程类别</th>
                        <th>课程产品</th>
                        <th>备注</th>
                        <th>沟通记录</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderItem(this.props.list)}
                </tbody>
            </table>
        )
    }
}