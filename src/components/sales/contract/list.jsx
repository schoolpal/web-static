import React from 'react'
import { Link } from 'react-router'
import { contractList } from '../../../utils/api'
import formatDate from '../../../utils/formatDate';
import DialogTips from '../../../utils/DialogTips';

export default class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: []
        }
        this.dataInit = this.dataInit.bind(this);
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
        contractList(oid)
            .done((data) => {
                this.setState({ list: data })
            }).always(() => {
                loading.close()
            })
    }

    render() {
        return (
            <div className="contract">
                <h5>
                    <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;我的合同
                </h5>

                <div className="main-container">
                    <table className='table table-bordered table-sm'>
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>创建人</th>
                                <th>创建时间</th>
                                <th>所属组织</th>
                                <th>所属用户</th>
                                <th>合同类型</th>
                                <th>合同编号</th>
                                <th>签约时间</th>
                                <th>到期时间</th>
                                <th>学员姓名</th>
                                <th>家长姓名</th>
                                <th>联系电话</th>
                                <th>课程类别</th>
                                <th>课程</th>
                                <th>合同金额</th>
                                <th>折扣金额</th>
                                <th>应付金额</th>
                                <th>已付金额</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.list.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td></td>
                                            <td>{formatDate(item.createTime)}</td>
                                            <td></td>
                                            <td></td>
                                            <td>{item.type}</td>
                                            <td><Link to={this.props.location.pathname + '/' + item.id}>{item.code}</Link></td>
                                            <td>{formatDate(item.startDate)}</td>
                                            <td>{formatDate(item.endDate)}</td>
                                            <td>{item.stuName}</td>
                                            <td>{item.parName}</td>
                                            <td>{item.parCellphone}</td>
                                            <td>{item.courseType}</td>
                                            <td></td>
                                            <td>{item.oriPrice}</td>
                                            <td>{item.discPrice}</td>
                                            <td>{item.finalPrice}</td>
                                            <td>{item.paid}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}