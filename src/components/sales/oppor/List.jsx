import React from 'react'
import { Link } from 'react-router'
import LeadsList from '../../public/LeadsList'
import command from '../../../utils/command'
import { CreateButton } from '../../public/Button'
import { opporList } from '../../../utils/api'
import DialogTips from '../../../utils/DialogTips';

export default class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = { typeId: 2, new: [], keep: [] }
        this.dataInit = this.dataInit.bind(this)
        this.renderCommand = this.renderCommand.bind(this)
        this.tabChange = this.tabChange.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
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
        opporList({
            orgId: oid,
            typeId: this.state.typeId
        }).done((data) => {
            if (this.state.typeId === 2) {
                this.setState({ new: data })
            } else {
                this.setState({ keep: data })
            }
        }).always(() => {
            loading.close()
        })
    }

    renderCommand() {
        const path = this.props.location.pathname.replace(SCHOOLPAL_CONFIG.ROOTPATH, '');
        const commands = command(path);
        let temp = [];

        commands.map((item, index) => {
            if (item === 'Add') {
                temp.push(<CreateButton key={index} action={this.handleCreate} />)
            };
        })

        return temp;
    }

    handleCreate() {
        this.props.router.push({
            pathname: this.props.location.pathname + '/edit/create',
            state: { typeId: this.state.typeId }
        })
    }

    tabChange(typeId) {
        const loading = DialogTips({ type: 'loading' })

        this.setState({ typeId: typeId })
        loading.open()
        opporList({
            orgId: this.props.org.id,
            typeId: typeId
        }).done((data) => {
            if (this.state.typeId === 2) {
                this.setState({ new: data })
            } else {
                this.setState({ keep: data })
            }
        }).always(() => {
            loading.close()
        })
    }

    render() {
        return (
            <div className="market">
                <h5>
                    <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;销售线索
                    <div className="btn-group float-right mr-4" role="group">
                        {this.renderCommand()}
                    </div>
                </h5>

                <div className="main-container">
                    <ul className="nav nav-tabs mb-3">
                        <li className="nav-item" onClick={() => { this.tabChange(2) }}>
                            <a className="nav-link active" data-toggle="tab" href="#new" role="tab">新招</a>
                        </li>
                        <li className="nav-item" onClick={() => { this.tabChange(3) }}>
                            <a className="nav-link" data-toggle="tab" href="#keep" role="tab">续报</a>
                        </li>
                    </ul>

                    <div className="tab-content">
                        <div className="tab-pane active" id="new" role="tabpanel">
                            <LeadsList
                                path={this.props.location.pathname}
                                list={this.state.new}
                            />
                        </div>
                        <div className="tab-pane" id="keep" role="tabpanel">
                            <LeadsList
                                path={this.props.location.pathname}
                                list={this.state.keep}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}