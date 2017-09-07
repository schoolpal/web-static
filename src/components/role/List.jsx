import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import NavBar from '../public/NavBar'
import AsideBar from '../public/AsideBar'
import OrgTree from '../public/OrgTree'
import Dialog from '../public/Dialog'
import { CreateButton, EditorButton, DelButton } from '../public/Button'
import { orgList, sysRoleList, roleDel } from '../../utils/api'
import DialogTips from '../../utils/DialogTips'
import command from '../../utils/command'

function getFuncStr(data) {
    let funcArr = [];

    data.map((item) => {
        funcArr.push(item.cNameShort);
    })

    return funcArr.join(',');
}

export default class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orgList: [],
            org: null,

            roleList: [],
            selected: null,
        };

        this.renderCommand = this.renderCommand.bind(this)
        this.selectOrg = this.selectOrg.bind(this)
        this.checkedRole = this.checkedRole.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
        this.handleEditor = this.handleEditor.bind(this)
        this.handleDel = this.handleDel.bind(this)
        this.confirmDel = this.confirmDel.bind(this)
    }

    componentDidMount() {
        const dialogTips = DialogTips({ type: 'loading' })

        dialogTips.open()

        orgList()
            .done((org) => {
                sysRoleList(org.original[0].cId)
                    .done((role) => {
                        this.setState({
                            orgList: org.tree,
                            org: {
                                id: org.original[0].cId,
                                name: org.original[0].cName
                            },

                            roleList: role
                        })
                    })
                    .always(() => {
                        dialogTips.close()
                    })
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

            if (item === 'Mod') {
                temp.push(<EditorButton key={index} action={this.handleEditor} disabled={this.state.selected === null ? true : false} />)
            }

            if (item === 'Del') {
                temp.push(<DelButton key={index} action={this.confirmDel} disabled={this.state.selected === null ? true : false} />)
            }
        })

        return temp;
    }

    selectOrg(org) {
        const dialogTips = DialogTips({ type: 'loading' })

        if (org) {
            this.setState({ org: org })

            dialogTips.open()

            sysRoleList(org.id)
                .done((data) => {
                    this.setState({ roleList: data })
                })
                .always(() => {
                    dialogTips.close()
                })
        }
    }

    checkedRole(event) {
        if (event.target.checked === true) {
            this.setState({
                selected: {
                    id: event.target.value,
                    name: $(event.target).parents('tr').find('[data-name]').text()
                }
            })
        }
    }

    handleCreate() {
        const editorPath = SCHOOLPAL_CONFIG.ROOTPATH + 'sys/role/' + this.state.org.id + '/create';

        this.props.router.push(editorPath)
    }

    handleEditor() {
        const editorPath = SCHOOLPAL_CONFIG.ROOTPATH + 'sys/role/' + this.state.org.id + '/' + this.state.selected.id;

        this.props.router.push(editorPath)
    }

    handleDel() {
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success', autoClose: true })
        const fail = DialogTips({ type: 'fail', autoClose: true })

        loading.open()

        roleDel(this.state.selected.id)
            .done(() => {
                const tempList = this.state.roleList.filter((item) => { return item.cId !== this.state.selected.id });

                loading.close()
                success.open()

                this.setState({
                    roleList: tempList,
                    selected: null
                })
            }).fail(() => {
                loading.close()
                fail.open()
            })
    }

    confirmDel() {
        const div = document.createElement('div');

        ReactDOM.render(
            <Dialog
                container={div}
                text={'是否确认删除 ' + this.state.selected.name + ' 角色 ？'}
                action={this.handleDel}
            />,
            document.body.appendChild(div)
        )
    }


    render() {
        return (
            <div className="role">
                <h5>
                    <i className='fa fa-glass'></i>&nbsp;角色管理
                            <div className="btn-group float-right" role="group">
                        {this.renderCommand()}
                    </div>
                </h5>

                <div className="main-container">
                    <div className="d-flex align-items-stretch flex-nowrap">
                        <div className={this.state.org === null ? 'hide' : 'w300'}>
                            <OrgTree data={this.state.orgList} selected={this.selectOrg} defaults={this.state.org ? this.state.org.id : null} />
                        </div>
                        <div className={this.state.org === null ? 'hide' : 'flex-cell pl-3 b-l'}>
                            <table className={this.state.roleList === null ? 'hide' : 'table table-bordered table-sm'}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>角色职能</th>
                                        <th>角色职级</th>
                                        <th>角色名称</th>
                                        <th>角色描述</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.roleList.map((item) => {
                                            return (
                                                <tr key={item.cId}>
                                                    <td>
                                                        <div className="form-check">
                                                            <label className="form-check-label">
                                                                <input
                                                                    onChange={this.checkedRole}
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="org"
                                                                    checked={(this.state.selected && item.cId === this.state.selected.id) ? true : false}
                                                                    value={item.cId}
                                                                />
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td>{getFuncStr(item.rootFuncs)}</td>
                                                    <td>{item.cRankName}</td>
                                                    <td data-name>{item.cName}</td>
                                                    <td>{item.cDesc}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}