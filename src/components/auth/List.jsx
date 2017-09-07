import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import NavBar from '../public/NavBar'
import AsideBar from '../public/AsideBar'
import OrgTree from '../public/OrgTree'
import { AuthButton } from '../public/Button'
import Alerts from '../public/Alerts'
import { orgList, roleList, funcByIds, roleDetails, roleAuth } from '../../utils/api'
import DialogTips from '../../utils/DialogTips'
import command from '../../utils/command'

export default class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orgList: [],
            selected: null,

            roleList: [],
            checkedRole: null,

            funcList: [],
            checkedFunc: {},
        };

        this.renderCommand = this.renderCommand.bind(this)
        this.renderTable = this.renderTable.bind(this)
        this.tableLine = this.tableLine.bind(this)
        this.handleNode = this.handleNode.bind(this)
        this.selectOrg = this.selectOrg.bind(this)
        this.checkedRole = this.checkedRole.bind(this)
        this.checkedFunc = this.checkedFunc.bind(this)
        this.handleAuth = this.handleAuth.bind(this)
    }

    componentDidMount() {
        const dialogTips = DialogTips({ type: 'loading' })

        dialogTips.open()

        orgList().done((org) => {
            const selected = {
                id: org.tree[0].cId,
                name: org.tree[0].cName
            }

            roleList(selected.id).done((role) => {
                const checkedRole = {
                    id: role[0].cId,
                    name: role[0].cName
                }

                roleDetails(checkedRole.id).done((roleFunc) => {
                    const fids = roleFunc.rootFuncs.map((item) => { return item.cId });

                    funcByIds(fids.join(',')).done((func) => {
                        let checked = {};

                        func.data.map((item) => {
                            if (roleFunc.functions.findIndex((elem) => { return elem.cId === item.cId }) < 0) {
                                checked[item.cId] = false;
                            } else {
                                checked[item.cId] = true;
                            }
                        })

                        dialogTips.close()

                        this.setState({
                            orgList: org.tree,
                            selected: selected,

                            roleList: role,
                            checkedRole: checkedRole,

                            funcList: func.tree,
                            checkedFunc: checked
                        })
                    }).fail(() => { dialogTips.close() })
                }).fail(() => { dialogTips.close() })
            }).fail(() => { dialogTips.close() })
        }).fail(() => { dialogTips.close() })
    }

    renderCommand() {
        const path = this.props.location.pathname.replace(SCHOOLPAL_CONFIG.ROOTPATH, '');
        const commands = command(path);
        const isDisabled = $.isEmptyObject(this.state.checkedFunc);

        let temp = [];

        commands.map((item, index) => {
            if (item === 'Auth') {
                temp.push(
                    <AuthButton
                        key={index}
                        action={this.handleAuth}
                        disabled={isDisabled}
                    />
                )
            };
        })

        return temp;
    }

    selectOrg(org) {
        if (org) {
            this.setState({
                selected: org,

                roleList: [],
                checkedRole: null,

                funcList: [],
                checkedFunc: {},
            })

            const dialogTips = DialogTips({ type: 'loading' })

            dialogTips.open()

            roleList(org.id).done((role) => {
                const checkedRole = {
                    id: role[0].cId,
                    name: role[0].cName
                }

                roleDetails(checkedRole.id).done((roleFunc) => {
                    const fids = roleFunc.rootFuncs.map((item) => { return item.cId });

                    funcByIds(fids.join(',')).done((func) => {
                        let checked = {};

                        func.data.map((item) => {
                            if (roleFunc.functions.findIndex((elem) => { return elem.cId === item.cId }) < 0) {
                                checked[item.cId] = false;
                            } else {
                                checked[item.cId] = true;
                            }
                        })

                        dialogTips.close()

                        this.setState({
                            roleList: role,
                            checkedRole: checkedRole,

                            funcList: func.tree,
                            checkedFunc: checked
                        })
                    }).fail(() => { dialogTips.close() })
                }).fail(() => { dialogTips.close() })
            }).fail(() => { dialogTips.close() })
        }
    }

    checkedRole(event) {
        if (event.target.value === this.state.checkedRole.id) {
            return;
        }

        this.setState({
            checkedRole: {
                id: event.target.value,
                name: $(event.target).parent().text()
            }
        })

        const dialogTips = DialogTips({ type: 'loading' })

        dialogTips.open()

        roleDetails(event.target.value).done((roleFunc) => {
            const fids = roleFunc.rootFuncs.map((item) => { return item.cId });

            funcByIds(fids.join(',')).done((func) => {
                let checked = {};

                func.data.map((item) => {
                    if (roleFunc.functions.findIndex((elem) => { return elem.cId === item.cId }) < 0) {
                        checked[item.cId] = false;
                    } else {
                        checked[item.cId] = true;
                    }
                })

                dialogTips.close()

                this.setState({
                    funcList: func.tree,
                    checkedFunc: checked
                })
            }).fail(() => { dialogTips.close() })
        }).fail(() => { dialogTips.close() })
    }

    checkedFunc(event) {
        const temp = $.extend({}, this.state.checkedFunc);

        temp[event.target.value] = !temp[event.target.value];

        if (temp[event.target.value] === false) {
            if ($('[data-parent=' + event.target.value + ']').length) {
                $('[data-parent=' + event.target.value + ']').each((i, elem) => {
                    temp[$(elem).val()] = false;
                })
            };
        }

        this.setState({
            checkedFunc: temp
        })
    }

    handleAuth(event) {
        if (this.editorDom.checkValidity() === true) {
            event.preventDefault()
        };

        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success', autoClose: true })
        const fail = DialogTips({ type: 'fail', autoClose: true })

        let funcIdArr = [];

        for (const key in this.state.checkedFunc) {
            if (this.state.checkedFunc[key] === true) {
                funcIdArr.push(key)
            }
        }

        const param = {
            id: this.state.checkedRole.id,
            funcIds: funcIdArr.join(',')
        }

        loading.open()

        roleAuth(param).done(() => {
            loading.close()
            success.open()
        }).fail((data) => {
            loading.close()
            fail.open()
        })
    }

    renderTable(data) {
        let table = [];

        if (data.length) {
            data.map((item) => {
                table.push(this.tableLine(item));

                if (item.children && item.children.length) {
                    let children = [];

                    children.push(this.renderTable(item.children));
                    table.push(children);
                }
            })
        }

        return table;
    }

    tableLine(data) {
        const level = data.cId.split('-').length;
        const spacingStyle = { marginLeft: 40 * level + 'px' };
        const childrenClass = data.children ? '' : 'not-child';
        let action = [];

        if (data.action) {
            action = data.action.map((item) => {
                return (
                    <div key={item.cId} className="form-check form-check-inline">
                        <label className="form-check-label">
                            <input
                                onChange={this.checkedFunc}
                                className="form-check-input"
                                type="checkbox"
                                data-parent={item.cParentId}
                                value={item.cId}
                                checked={this.state.checkedFunc[item.cId]}
                            />
                            <span>{item.cNameLong}</span>
                        </label>
                    </div>
                )
            })
        };

        return (
            <tr key={data.cId} data-id={data.cId} data-level={level}>
                <td>
                    <p onClick={this.handleNode} className={'tree-node ' + childrenClass} style={spacingStyle}>{data.cNameLong}</p>
                </td>
                <td>
                    <div className="form-check">
                        <label className="form-check-label">
                            <input
                                onChange={this.checkedFunc}
                                className="form-check-input"
                                type="checkbox"
                                value={data.cId}
                                checked={this.state.checkedFunc[data.cId]}
                            />
                        </label>
                    </div>
                </td>
                <td>{action}</td>
            </tr>
        );
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
            <div className="auth">
                <form ref={(dom) => { this.editorDom = dom }} onSubmit={this.handleAuth}>
                    <h5>
                        <i className='fa fa-shield' aria-hidden="true"></i>&nbsp;权限管理
                        <div className="btn-group float-right" role="group">
                            {this.renderCommand()}
                        </div>
                    </h5>

                    <Alerts type="danger" title="重要提示 !" text="权限修改成功后，需要重新登陆才能生效。"></Alerts>

                    <div className="main-container">
                        <div className="d-flex align-items-stretch flex-nowrap">
                            <div className={this.state.orgList === null ? 'hide' : 'w300'}>
                                <OrgTree data={this.state.orgList} selected={this.selectOrg} defaults={this.state.selected ? this.state.selected.id : null} />
                            </div>

                            <div className={this.state.selected === null ? 'hide' : 'w200 pl-3 b-l'}>
                                {
                                    this.state.roleList.map((item) => {
                                        return (
                                            <div key={item.cId} className="form-check">
                                                <label className="form-check-label">
                                                    <input
                                                        onChange={this.checkedRole}
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="role"
                                                        value={item.cId}
                                                        checked={this.state.checkedRole.id === item.cId ? true : false}
                                                    />
                                                    <span>{item.cName}</span>
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className={this.state.checkedRole === null ? 'hide' : 'flex-cell pl-3 b-l'}>
                                <p className="h6 pb-3 b-b">{this.state.checkedRole ? this.state.checkedRole.name : ''}</p>
                                <table className={this.state.funcLoading === true ? 'hide' : 'table table-bordered table-sm'}>
                                    <thead>
                                        <tr>
                                            <th>系统菜单</th>
                                            <th>选取</th>
                                            <th>功能权限</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTable(this.state.funcList)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        )
    }
}