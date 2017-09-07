import React from 'react'
import { Link } from 'react-router'
import { CreateButton } from '../../public/Button'
import command from '../../../utils/command'
import { leadsList } from '../../../utils/api';
import DialogTips from '../../../utils/DialogTips';
import formatDate from '../../../utils/formatDate'

export default class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = { list: [] }
        this.renderCommand = this.renderCommand.bind(this)
        this.renderItem = this.renderItem.bind(this)
    }

    componentDidMount() {
        if (this.props.org) {
            this.dataInit(this.props.org.id)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.org) {
            if (!this.props.org || this.props.org.id !== nextProps.org.id) {
                this.dataInit(nextProps.org.id)
            }
        }
    }

    dataInit(oid) {
        const loading = DialogTips({ type: 'loading' })

        loading.open()
        leadsList(oid)
            .done((data) => {
                this.setState({
                    list: data
                })
            })
            .always(() => {
                loading.close()
            })
    }

    renderCommand() {
        const path = this.props.location.pathname.replace(SCHOOLPAL_CONFIG.ROOTPATH, '');
        const commands = command(path);
        let temp = [];

        commands.map((item, index) => {
            if (item === 'Add') {
                temp.push(<CreateButton key={index} link={this.props.location.pathname + '/edit/create'} />)
            };
        })

        return temp;
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
                            <Link to={this.props.location.pathname + '/' + item.id}>{item.student.name}</Link>
                        </td>
                        <td>{item.student.genderText !== 'null' ? item.student.genderText : '--'}</td>
                        <td>{item.student.age !== 'null' ? item.student.age : '--'}</td>
                        <td>{item.student.classGrade !== 'null' ? item.student.classGrade : '--'}</td>
                        <td>{item.student.schoolName ? item.student.schoolName : '--'}</td>
                        <td>
                            <Link to={this.props.location.pathname + '/' + item.id}>{item.parent.name}</Link>
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
            <div className="market">
                <h5>
                    <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;销售线索
                    <div className="btn-group float-right mr-4" role="group">
                        {
                            //<button type="button" className="btn btn-success"><i className="fa fa-file-excel-o" aria-hidden="true"></i> 导入</button>
                        }

                        {this.renderCommand()}
                    </div>
                </h5>

                <div className="main-container">
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
                            {this.renderItem(this.state.list)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}