import React from 'react';
import ReactDOM from 'react-dom';
import { EditorButton, DelButton, BackButton } from '../../public/Button';
import subTitle from '../../../utils/subTitle';
import command from '../../../utils/command'
import Dialog from '../../public/Dialog'
import DialogTips from '../../../utils/DialogTips';
import formatDate from '../../../utils/formatDate'
import { actDel, actQuery } from '../../../utils/api';

require('../../../utils/datepicker');

function chartInit(data) {
    let config = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
        series: [
            {
                type: 'funnel',
                left: '10%',
                width: '80%',
                maxSize: '80%',
                label: {
                    normal: {
                        position: 'inside',
                        formatter: '{c}',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    emphasis: {
                        position: 'inside',
                        formatter: '{c}'
                    }
                },
                itemStyle: {
                    normal: {
                        opacity: 0.5,
                        borderColor: '#fff',
                        borderWidth: 2
                    }
                },
                data: [
                    // { value: data.contracts, name: '签约客户量' },
                    // { value: data.leads, name: '转化机会量' },
                    // { value: data.opportunities, name: '获取线索量' }
                    { value: 10, name: '签约客户量' },
                    { value: 50, name: '转化机会量' },
                    { value: 200, name: '获取线索量' }
                ]
            }
        ]
    }

    require.ensure(["echarts"], (require) => {
        const echarts = require('echarts');
        const myChart = echarts.init(document.getElementById('chart'));

        myChart.setOption(config);
    }, 'echarts')
}

export default class View extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
        this.renderCommand = this.renderCommand.bind(this)
        this.handleEditor = this.handleEditor.bind(this)
        this.confirmDel = this.confirmDel.bind(this)
        this.handleDel = this.handleDel.bind(this)
    }

    componentDidMount() {
        const loading = DialogTips({ type: 'loading' })

        loading.open()
        actQuery(this.props.params.id)
            .done((data) => {
                this.setState({
                    name: data.name,
                    parentName: data.id === data.parentId ? '一级活动' : data.parentName,
                    dateScope: formatDate(data.startDate) + ' - ' + formatDate(data.endDate),
                    budget: data.budget,
                    cost: data.cost,
                    creatorName: data.creatorName,
                    createTime: formatDate(data.createTime),
                    totalAmount: data.totalAmount,
                    roi: data.roi
                })
                chartInit({
                    contracts: data.contracts,
                    leads: data.leads,
                    opportunities: data.opportunities
                })
            })
            .always(() => { loading.close() })
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
        const editorPath = SCHOOLPAL_CONFIG.ROOTPATH + 'crm/market/activity/edit/' + this.props.params.id

        this.props.router.push(editorPath)
    }

    confirmDel() {
        const div = document.createElement('div');

        ReactDOM.render(
            <Dialog
                container={div}
                text={'是否确认删除此活动 ？'}
                action={this.handleDel}
            />,
            document.body.appendChild(div)
        )
    }

    handleDel() {
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })

        loading.open()

        actDel(this.props.params.id).done(() => {
            loading.close()
            success.open()

            setTimeout(() => {
                success.close()
                this.props.router.replace(SCHOOLPAL_CONFIG.ROOTPATH + 'crm/market/activity')
            }, 2000)

        }).fail((data) => {
            loading.close()
            fail.open()
        })
    }

    render() {
        return (
            <div className="market">

                <h5>
                    <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;市场活动&nbsp;&nbsp;|&nbsp;&nbsp;<p className="d-inline text-muted">活动名称</p>

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
                    <div className="d-flex align-items-stretch flex-nowrap">
                        <div className="w300 pr-3 b-r">
                            <dl>
                                <dt>活动名称</dt>
                                <dd className="b-l">{this.state.name ? this.state.name : '--'}</dd>

                                <dt>父级市场活动</dt>
                                <dd className="b-l">{this.state.parentName ? this.state.parentName : '--'}</dd>

                                <dt>时间周期</dt>
                                <dd className="b-l">{this.state.dateScope ? this.state.dateScope : '--'}</dd>

                                <dt>预算费用</dt>
                                <dd className="b-l">{this.state.budget ? this.state.budget : '--'}</dd>

                                <dt>实际费用</dt>
                                <dd className="b-l">{this.state.cost ? this.state.cost : '--'}</dd>

                                <dt>创建人</dt>
                                <dd className="b-l">{this.state.creatorName ? this.state.creatorName : '--'}</dd>

                                <dt>创建时间</dt>
                                <dd className="b-l">{this.state.createTime ? this.state.createTime : '--'}</dd>
                            </dl>
                        </div>
                        <div id="chart" className="chart"></div>
                        <div className="flex-cell">
                            <p className="mb-0">签约客户金额</p>
                            <p className="mb-3">{this.state.totalAmount ? this.state.totalAmount : 0}</p>
                            <p className="mb-0">投资回报率（ROI）</p>
                            <p>{this.state.roi ? this.state.roi : 0}</p>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}