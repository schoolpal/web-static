import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import NavBar from '../public/NavBar'
import AsideBar from '../public/AsideBar'
import OrgTree from '../public/OrgTree';
import Dialog from '../public/Dialog'
import { CreateButton, EditorButton, DelButton, ToggleButton } from '../public/Button';
import { orgList, userList, userEnable, userDel } from '../../utils/api';
import DialogTips from '../../utils/DialogTips'
import command from '../../utils/command'

export default class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orgList: [],
            selected: null,

            userList: [],

            enable: false,

            checkedUser: null,
        }

        this.selectOrg = this.selectOrg.bind(this)
        this.checkedUser = this.checkedUser.bind(this)
        this.renderCommand = this.renderCommand.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
        this.handleEditor = this.handleEditor.bind(this)
        this.confirmDel = this.confirmDel.bind(this)
        this.handleDel = this.handleDel.bind(this)
        this.handleToggle = this.handleToggle.bind(this)
        this.toggleAvailable = this.toggleAvailable.bind(this)
    }

    componentDidMount() {
        const path = this.props.location.pathname.replace(SCHOOLPAL_CONFIG.ROOTPATH, '');
        const commands = command(path);
        const dialogTips = DialogTips({ type: 'loading' })

        let enable = false;

        commands.map((item, index) => {
            if (item === 'Enable') {
                enable = true;
            }
        })

        this.setState({
            enable: enable,
        })

        dialogTips.open()

        orgList().done((org) => {
            const oid = org.tree[0].cId;
            const oname = org.tree[0].cName;

            userList(oid).done((user) => {
                this.setState({
                    orgList: org.tree,
                    selected: {
                        id: oid,
                        name: oname
                    },
                    userList: user
                })

                dialogTips.close()
            }).fail((data) => {
                dialogTips.close()
            })
        }).fail((data) => {
            dialogTips.close()
        })
    }

    renderCommand() {
        const path = this.props.location.pathname.replace(SCHOOLPAL_CONFIG.ROOTPATH, '');
        const commands = command(path);

        let temp = [];

        commands.map((item, index) => {
            if (item === 'Add') {
                temp.push(<CreateButton key={index} action={this.handleCreate} disabled={this.state.selected === null ? true : false} />)
            };

            if (item === 'Mod') {
                temp.push(<EditorButton key={index} action={this.handleEditor} disabled={this.state.checkedUser === null ? true : false} />)
            }

            if (item === 'Del') {
                temp.push(<DelButton key={index} action={this.confirmDel} disabled={this.state.checkedUser === null ? true : false} />)
            }
        })

        return temp;
    }

    selectOrg(org) {
        if (org) {
            const dialogTips = DialogTips({ type: 'loading' })

            this.setState({
                selected: org,
                userList: [],
                checkedUser: null,
            })

            dialogTips.open()

            userList(org.id)
                .done((data) => {
                    this.setState({
                        userList: data
                    })
                })
                .always(() => {
                    dialogTips.close()
                })
        }
    }

    checkedUser(event) {
        if (event.target.checked === true) {
            this.setState({
                checkedUser: {
                    id: event.target.value,
                    name: $(event.target).parents('tr').find('[data-name]').text()
                }
            })
        }
    }

    handleCreate() {
        const editorPath = SCHOOLPAL_CONFIG.ROOTPATH + 'sys/user/' + this.state.selected.id + '/create';

        this.props.router.push(editorPath)
    }

    handleEditor() {
        const editorPath = SCHOOLPAL_CONFIG.ROOTPATH + 'sys/user/' + this.state.selected.id + '/' + this.state.checkedUser.id;

        this.props.router.push(editorPath)
    }

    confirmDel() {
        const div = document.createElement('div');

        ReactDOM.render(
            <Dialog
                container={div}
                text={'是否确认删除 ' + this.state.checkedUser.name + ' ？'}
                action={this.handleDel}
            />,
            document.body.appendChild(div)
        )
    }

    handleDel() {
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success', autoClose: true })
        const fail = DialogTips({ type: 'fail', autoClose: true })

        loading.open()

        userDel(this.state.checkedUser.id).done(() => {
            const tempList = this.state.userList.filter((item) => { return item.cId !== this.state.checkedUser.id })

            loading.close()
            success.open()

            this.setState({
                userList: tempList,
                checkedUser: null
            })
        }).fail((data) => {
            loading.close()
            fail.open()
        })
    }

    handleToggle(param) {
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success', autoClose: true })
        const fail = DialogTips({ type: 'fail', autoClose: true })
        const nextAvailable = !param.available;

        loading.open()

        this.toggleAvailable(param.uid, nextAvailable)

        userEnable(param.uid, !param.available).done(() => {
            loading.close()
            success.open()
        }).fail(() => {
            this.toggleAvailable(param.uid, param.available)
            loading.close()
            fail.open()
        })
    }

    toggleAvailable(uid, nextAvailable) {
        let tempList;

        tempList = this.state.userList.filter((item) => {
            if (item.cId === uid) {
                item.cAvailable = nextAvailable;
            }

            return item;
        })

        this.setState({
            userList: tempList
        })
    }

    render() {
        return (
            <div className="user">
                <h5>
                    <i className="fa fa-user" aria-hidden="true"></i>&nbsp;用户管理
                    <div className="btn-group float-right mr-4" role="group">
                        {this.renderCommand()}
                    </div>
                </h5>

                <div className="main-container">
                    <div className="d-flex align-items-stretch flex-nowrap">
                        <div className={this.state.orgList === null ? 'hide' : 'w300'}>
                            <OrgTree data={this.state.orgList} selected={this.selectOrg} defaults={this.state.selected ? this.state.selected.id : null} />
                        </div>

                        <div className={this.state.selected === null ? 'hide' : 'flex-cell pl-3 b-l'}>
                            <p className={this.state.selected === null ? 'hide' : 'h6 pb-3 b-b'}>{this.state.selected ? this.state.selected.name : ''}</p>

                            <table className={this.state.userList === null ? 'hide' : 'table table-bordered table-sm'}>
                                <thead>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>状态</th>
                                        <th>用户名</th>
                                        <th>姓名</th>
                                        <th>昵称</th>
                                        <th>电话号码</th>
                                        <th>电子邮件</th>
                                        <th>IM(QQ)</th>
                                        <th>用户角色</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.userList.map((item) => {
                                            return (
                                                <tr key={item.cId} data-uid={item.cId}>
                                                    <td>
                                                        <div className="form-check form-check">
                                                            <label className="form-check-label">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="user"
                                                                    value={item.cId}
                                                                    onChange={this.checkedUser}
                                                                    checked={(this.state.checkedUser && this.state.checkedUser.id === item.cId) ? true : false}
                                                                />
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <ToggleButton
                                                            uid={item.cId}
                                                            enable={this.state.enable}
                                                            available={item.cAvailable}
                                                            action={this.handleToggle}
                                                        />
                                                    </td>
                                                    <td>{item.cLoginname}</td>
                                                    <td data-name>{item.cRealname}</td>
                                                    <td>{item.cNickname}</td>
                                                    <td>{item.cPhone}</td>
                                                    <td>{item.cEmail}</td>
                                                    <td>{item.cQq}</td>
                                                    <td>{item.roles.map((role) => { return role.cName }).join(',')}</td>
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