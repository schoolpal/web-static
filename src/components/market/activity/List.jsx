import React from 'react'
import { Link } from 'react-router';
import { CreateButton } from '../../public/Button'
import command from '../../../utils/command'
import formatDate from '../../../utils/formatDate'
import { actList } from '../../../utils/api';
import { conversionTree } from '../../../utils/conversion';
import DialogTips from '../../../utils/DialogTips';

export default class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = { list: [] }
        this.dataInit = this.dataInit.bind(this)
        this.renderCommand = this.renderCommand.bind(this)
        this.renderTable = this.renderTable.bind(this)
        this.renderItems = this.renderItems.bind(this)
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
        actList(oid)
            .done((data) => {
                this.setState({
                    list: conversionTree(data)
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

    renderTable(data) {
        let table = []

        if (data.length) {
            $.each(data, (i, item) => {
                table.push(this.renderItems(item));

                if (item.children && item.children.length) {
                    let children = [];

                    children.push(this.renderTable(item.children));
                    table.push(children);
                }
            })
        }

        return table;
    }

    renderItems(data) {
        const spacingStyle = { marginLeft: 40 * data.level + 'px' };
        const childrenClass = data.children ? '' : 'not-child';

        return (
            <tr key={data.id} data-id={data.cId} data-level={data.level}>
                <td>{data.id}</td>
                <td>{data.creatorName}</td>
                <td>{formatDate(data.createTime)}</td>
                <td>
                    <p onClick={this.handleNode} className={'tree-node ' + childrenClass} style={spacingStyle}>
                        <Link to={this.props.location.pathname + '/' + data.id}>{data.name}</Link>
                    </p>
                </td>
                <td>{formatDate(data.startDate)}</td>
                <td>{formatDate(data.endDate)}</td>
                <td>{data.budget}</td>
                <td>{data.cost}</td>
                <td>{data.leads}</td>
                <td>{data.opportunities}</td>
                <td>{data.contracts}</td>
                <td>{data.totalAmount}</td>
                <td>{data.roi}</td>
            </tr>
        )
    }

    handleNode(event) {
        if ($(event.target).hasClass('not-child')) {
            return;
        };

        const tr = $(event.target).parents('tr');
        const level = tr.data('level');

        tr.nextAll('tr').each((i, item) => {
            if ($(item).data('level') <= level) {
                return false;
            };

            if ($(event.target).hasClass('closed')) {
                if ($(item).data('level') === (level + 1)) {
                    $(item).show();
                }
            } else {
                $(item)
                    .hide()
                    .find('.tree-node')
                    .addClass('closed');
            }
        });

        $(event.target).toggleClass('closed');
    }

    render() {
        return (
            <div className="market">
                <h5>
                    <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;市场活动
                    <div className="btn-group float-right mr-4" role="group">
                        {this.renderCommand()}
                    </div>
                </h5>

                <div className="main-container">
                    <table className='table table-bordered table-sm'>
                        <thead>
                            <tr>
                                <th>序号(ID)</th>
                                <th>创建人</th>
                                <th>创建时间</th>
                                <th>活动名称</th>
                                <th>开始时间</th>
                                <th>结束时间</th>
                                <th>预计花费</th>
                                <th>实际花费</th>
                                <th>获取线索量</th>
                                <th>转化机会量</th>
                                <th>签约客户量</th>
                                <th>签约客户金额</th>
                                <th>ROI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTable(this.state.list)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}