import React from 'react'
import update from 'react-addons-update';
import { contactList, approachList, contactAdd, contactMod } from '../../utils/api'
import { getProfile } from '../../utils/userProfile'
import formatDate from '../../utils/formatDate'
import DialogTips from '../../utils/DialogTips';

function tableTitle(canEditd) {
    const base = [
        { key: 'index', name: '序号' },
        { key: 'approachName', name: '沟通方式' },
        { key: 'datetime', name: '咨询时间' },
        { key: 'orgName', name: '所属组织' },
        { key: 'executiveName', name: '所属用户' },
        { key: 'summary', name: '备注' }
    ]

    if (canEditd === true) {
        base.push({
            key: 'action',
            name: '操作'
        })
    }

    return base
}

function showEdit(target) {
    $(target)
        .parents('tr')
        .find('div')
        .children('span')
        .addClass('hide')
        .siblings('.form-control')
        .removeClass('hide')
}

function hideEdit(target) {
    $(target)
        .parents('tr')
        .find('div')
        .children('span')
        .removeClass('hide')
        .siblings('.form-control')
        .addClass('hide')
}

export default class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            operator: {
                name: getProfile().name,
                org: getProfile().org
            },

            list: [],
            approach: [],

            add: {
                approachId: '',
                summary: ''
            },

            edit: {
                id: '',
                approachId: '',
                summary: ''
            }
        }

        this.renderItem = this.renderItem.bind(this)
        this.renderAddContact = this.renderAddContact.bind(this)
        this.addContact = this.addContact.bind(this)
        this.editContact = this.editContact.bind(this)
        this.changeApproach = this.changeApproach.bind(this)
        this.changeSummary = this.changeSummary.bind(this)
    }

    componentDidMount() {
        approachList()
            .done((approach) => {
                this.setState({
                    approach: approach,
                })

                if (this.props.leadsId !== 'create') {
                    contactList(this.props.leadsId)
                        .done((list) => {
                            this.setState({
                                list: list,
                            })
                        })
                }
            })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.leadsId !== 'create' && nextProps.leadsId !== this.props.leadsId) {
            contactList(nextProps.leadsId)
                .done((list) => {
                    this.setState({
                        list: list,
                    })
                })
        }
    }

    changeApproach(event, type) {
        let data;

        if (type === 'add') {
            data = update(this.state.add, { approachId: { $set: event.target.value } })

            this.setState({
                add: data
            })
        } else {
            data = update(this.state.edit, { approachId: { $set: event.target.value } })

            this.setState({
                edit: data
            })
        }
    }

    changeSummary(event, type) {
        let data;

        if (type === 'add') {
            data = update(this.state.add, { summary: { $set: event.target.value } })

            this.setState({
                add: data
            })
        } else {
            data = update(this.state.edit, { summary: { $set: event.target.value } })

            this.setState({
                edit: data
            })
        }
    }

    addContact() {
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success', autoClose: true })
        const fail = DialogTips({ type: 'fail', autoClose: true })

        loading.open()
        contactAdd({
            leadsId: this.props.leadsId,
            approachId: this.state.add.approachId,
            summary: this.state.add.summary
        }).done(() => {
            this.setState({
                add: {
                    approachId: '',
                    summary: ''
                }
            })

            contactList(this.props.leadsId).done((list) => {
                this.setState({ list: list })
                loading.close()
                success.open()
            })
        }).fail(() => {
            loading.close()
            fail.open()
        })
    }

    editContact(event, item) {
        const target = event.target;

        if (this.state.edit.id) {
            const loading = DialogTips({ type: 'loading' })
            const success = DialogTips({ type: 'success', autoClose: true })
            const fail = DialogTips({ type: 'fail', autoClose: true })

            loading.open()
            contactMod(this.state.edit)
                .done(() => {
                    this.setState({
                        edit: {
                            id: '',
                            approachId: '',
                            summary: ''
                        }
                    })

                    hideEdit(target)

                    contactList(this.props.leadsId).done((list) => {
                        this.setState({ list: list })
                        loading.close()
                        success.open()
                    })
                })
                .fail(() => {
                    loading.close()
                    fail.open()
                })
        } else {
            showEdit(target)
            this.setState({
                edit: item
            })
        }
    }

    renderAddContact() {
        if (this.props.canEditd === true) {
            return (
                <tr>
                    <td>--</td>
                    <td>
                        <select value={this.state.add.approachId} onChange={(event) => { this.changeApproach(event, 'add') }} className="form-control">
                            <option value="">请选择</option>
                            {
                                this.state.approach.map((item) => {
                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                })
                            }
                        </select>
                    </td>
                    <td>--</td>
                    <td>{this.state.operator.org}</td>
                    <td>{this.state.operator.name}</td>
                    <td>
                        <input onChange={(event) => { this.changeSummary(event, 'add') }} type="text" className="form-control" value={this.state.add.summary} />
                    </td>
                    <td>
                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={this.state.add.approachId && this.state.add.summary ? false : true}
                            onClick={this.addContact}
                        >保存</button>
                    </td>
                </tr>
            )
        } else {
            return null
        }
    }

    renderItem() {
        let list = [];

        if (this.state.list.length) {
            list = this.state.list.map((item, i) => {
                return (
                    <tr key={item.id}>
                        {
                            tableTitle(this.props.canEditd).map((attr, j) => {
                                let content;

                                switch (attr.key) {
                                    case 'index':
                                        content = i + 1;
                                        break;
                                    case 'approachName':
                                        if (this.props.canEditd === true) {
                                            content = (
                                                <div>
                                                    <span>{item[attr.key]}</span>
                                                    <select value={this.state.edit.approachId} onChange={(event) => { this.changeApproach(event, 'edit') }} className="form-control hide">
                                                        <option value="">请选择</option>
                                                        {
                                                            this.state.approach.map((approach) => {
                                                                return <option key={approach.id} value={approach.id}>{approach.name}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            )
                                        } else {
                                            content = item[attr.key]
                                        }
                                        break;
                                    case 'datetime':
                                        content = formatDate(item[attr.key])
                                        break;
                                    case 'summary':
                                        if (this.props.canEditd === true) {
                                            content = (
                                                <div>
                                                    <span>{item[attr.key]}</span>
                                                    <input type="text" onChange={(event) => { this.changeSummary(event, 'edit') }} className="form-control hide" value={this.state.edit.summary} />
                                                </div>
                                            )
                                        } else {
                                            content = item[attr.key]
                                        }
                                        break;
                                    case 'action':
                                        content = (
                                            <button
                                                onClick={(event) => { this.editContact(event, { id: item.id, approachId: item.approachId, summary: item.summary }) }}
                                                type="button"
                                                className="btn btn-primary"
                                            >编辑</button>
                                        )
                                        break;
                                    default:
                                        content = item[attr.key]
                                }

                                return (
                                    <td key={j}>{content}</td>
                                )
                            })
                        }
                    </tr>
                )
            })
        }

        return list
    }

    render() {
        if (this.props.leadsId === 'create') {
            return null;
        } else {
            return (
                <div>
                    <p className="ht pt-3 pb-3 b-t b-b">沟通记录</p>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {
                                    tableTitle(this.props.canEditd).map((item, index) => {
                                        return <th key={index}>{item.name}</th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderAddContact()}
                            {this.renderItem()}
                        </tbody>
                    </table>
                </div>
            )
        }
    }
}