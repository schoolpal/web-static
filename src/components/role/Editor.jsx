import React from 'react';
import { Link } from 'react-router';
import NavBar from '../public/NavBar'
import AsideBar from '../public/AsideBar'
import { SaveButton, BackButton } from '../public/Button';
import subTitle from '../../utils/subTitle';
import { orgDetails, funcDic, rankDic, roleAdd, roleDetails, roleMod } from '../../utils/api';
import DialogTips from '../../utils/DialogTips'

const FUNC_ADMIN_ID = '7';
const RANK_ADMIN_ID = '4';
const RANK_MANAGER_ID = '1';

function formatFuncData(data) {
    let temp = [];

    data.map((item => {
        if (item.cId === item.cRootId) {
            temp.push(item)
        }
    }))

    return temp;
}

export default class Editor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            org: null,

            rank: [],
            func: [],

            isAdmin: false,
            checkedFunc: [],
            checkedRank: null,
        }

        this.checkedFunc = this.checkedFunc.bind(this);
        this.checkedRank = this.checkedRank.bind(this);
        this.editorSubmit = this.editorSubmit.bind(this);
    }

    componentDidMount() {
        const dialogTips = DialogTips({ type: 'loading' })

        dialogTips.open()

        if (this.props.params.rid === 'create') {
            $.when(
                orgDetails(this.props.params.oid),
                funcDic(),
                rankDic()
            ).done((org, func, rank) => {
                this.setState({
                    org: {
                        id: org.cId,
                        name: org.cName
                    },
                    rank: rank,
                    func: formatFuncData(func)
                })
            }).always(() => {
                dialogTips.close()
            })
        } else {
            $.when(
                orgDetails(this.props.params.oid),
                funcDic(),
                rankDic(),
                roleDetails(this.props.params.rid)
            ).done((org, func, rank, role) => {
                let tempCheckedFunc = [];

                tempCheckedFunc = role.rootFuncs.map((item) => { return item.cId });

                this.setState({
                    editorId: role.cId,
                    org: {
                        id: org.cId,
                        name: org.cName
                    },
                    rank: rank,
                    func: formatFuncData(func),

                    checkedFunc: tempCheckedFunc,
                    checkedRank: role.cRankId.toString()
                })

                $(this.editorDom)
                    .find('[name=name]')
                    .val(role.cName)
                    .end()
                    .find('[name=desc]')
                    .val(role.cDesc)
            }).always(() => {
                dialogTips.close()
            })
        }
    }

    checkedFunc(event) {
        const isAdmin = event.target.value === FUNC_ADMIN_ID ? true : false;
        let tempFunc = [];
        let tempRank = this.state.checkedRank;

        if (event.target.checked === true) {
            tempFunc.push(event.target.value)

            if (isAdmin !== true) {
                tempFunc = tempFunc.concat(this.state.checkedFunc.filter((item) => { return item !== FUNC_ADMIN_ID }))
            }
        } else {
            tempFunc = this.state.checkedFunc.filter((item) => { return item !== event.target.value })
        }

        if (tempFunc.findIndex((id) => { return id === FUNC_ADMIN_ID }) >= 0) {
            tempRank = RANK_ADMIN_ID;
        } else {
            if (tempRank === RANK_ADMIN_ID) {
                tempRank = null
            }

            if (tempFunc.length === 1 && this.state.checkedRank === RANK_MANAGER_ID) {
                tempRank = null;
            }

            if (tempFunc.length > 1) {
                tempRank = RANK_MANAGER_ID;
            }
        }

        if (tempFunc.length) {
            $(this.editorDom)
                .find('input[type=checkbox]')
                .removeAttr('required')
        } else {
            $(this.editorDom)
                .find('input[type=checkbox]')
                .attr('required', 'required')
        }

        this.setState({
            isAdmin: (isAdmin === true && event.target.checked === true) ? true : false,
            checkedFunc: tempFunc,
            checkedRank: tempRank
        })
    }

    checkedRank(event) {
        let tempFunc = [];
        let tempRank = this.state.checkedRank;

        if (event.target.value === RANK_ADMIN_ID) {
            tempFunc.push(FUNC_ADMIN_ID)
        } else if (event.target.value !== RANK_MANAGER_ID && this.state.checkedFunc.length > 1) {
            tempFunc = this.state.checkedFunc.filter((id, index) => { return index === 0 })
        } else {
            tempFunc = this.state.checkedFunc.filter((id) => { return id !== FUNC_ADMIN_ID })
        }

        this.setState({
            checkedFunc: tempFunc,
            checkedRank: event.target.value
        })
    }

    editorSubmit(event) {
        if (this.editorDom.checkValidity() === true) {
            event.preventDefault()
        };

        const successPath = SCHOOLPAL_CONFIG.ROOTPATH + 'sys/role';
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })
        let param = {};

        param.orgId = this.state.org.id;
        param.strFuncIds = this.state.checkedFunc.join(',');
        param.rankId = this.state.checkedRank;
        param.name = $(this.editorDom).find('[name=name]').val()
        param.desc = $(this.editorDom).find('[name=desc]').val()

        loading.open()

        if (this.state.editorId) {
            param.id = this.state.editorId;
            roleMod(param)
                .done(() => {
                    loading.close()
                    success.open()
                    setTimeout(() => {
                        success.close()
                        this.props.router.push(successPath)
                    }, 2000)
                })
                .fail((data) => {
                    loading.close()
                    fail.open()
                })
        } else {
            roleAdd(param)
                .done(() => {
                    loading.close()
                    success.open()
                    setTimeout(() => {
                        success.close()
                        this.props.router.push(successPath)
                    }, 2000)
                })
                .fail((data) => {
                    loading.close()
                    fail.open()
                })
        }
    }

    render() {
        return (
            <div className="org">
                <form ref={(dom) => { this.editorDom = dom }} onSubmit={this.editorSubmit}>

                    <h5>
                        <i className='fa fa-glass'></i>&nbsp;角色管理&nbsp;|&nbsp;<p className="d-inline text-muted">{subTitle(this.props.router.params.id, '角色')}</p>
                        <div className="btn-group float-right" role="group">
                            <BackButton router={this.props.router} />
                            <SaveButton action={this.editorSubmit} text="保存" />
                        </div>
                    </h5>

                    <div className="main-container">
                        <div className="d-flex align-items-stretch flex-nowrap">
                            <div className={this.state.org === null ? 'hide' : 'w500'}>
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>所属组织：</label>
                                    <input type="text" className="form-control" value={this.state.org ? this.state.org.name : ''} disabled="disabled" />
                                </div>
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>角色职能</label>
                                    <div>
                                        {
                                            this.state.func.map((item) => {
                                                const adminClass = item.cId === FUNC_ADMIN_ID ? 'form-check form-check-inline b-l pl-3' : 'form-check form-check-inline';

                                                return (
                                                    <div key={item.cId} className={adminClass}>
                                                        <label className="form-check-label">
                                                            <input
                                                                onChange={this.checkedFunc}
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value={item.cId}
                                                                checked={this.state.checkedFunc && this.state.checkedFunc.findIndex((id) => { return id === item.cId }) < 0 ? false : true}
                                                                name="func"
                                                                required="required"
                                                            />
                                                            <span>{item.cNameShort}</span>
                                                        </label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>角色职级</label>
                                    <div>
                                        {
                                            this.state.rank.map((item) => {
                                                const adminClass = item.cId.toString() === RANK_ADMIN_ID ? 'form-check form-check-inline b-l pl-3' : 'form-check form-check-inline';
                                                let isDisabled = false;

                                                if (this.state.isAdmin === true && item.cId.toString() !== RANK_ADMIN_ID) {
                                                    isDisabled = true;
                                                }

                                                if (this.state.isAdmin === false && item.cId.toString() === RANK_ADMIN_ID) {
                                                    isDisabled = true;
                                                }

                                                if (this.state.checkedFunc.length === 1 && item.cId.toString() === RANK_MANAGER_ID) {
                                                    isDisabled = true;
                                                }

                                                return (
                                                    <div key={item.cId} className={adminClass}>
                                                        <label className="form-check-label">
                                                            <input
                                                                onChange={this.checkedRank}
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="rank"
                                                                checked={item.cId.toString() === this.state.checkedRank ? true : false}
                                                                value={item.cId}
                                                                disabled={isDisabled}
                                                                required="required"
                                                            />
                                                            <span>{item.cName}</span>
                                                        </label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>角色名称</label>
                                    <input type="text" className="form-control" name="name" required="required" />
                                </div>
                                <div className="form-group">
                                    <label for="name">角色描述</label>
                                    <textarea name="desc" className="form-control" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        )
    }

}