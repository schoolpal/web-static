import React from 'react'
import { Link } from 'react-router'
import NavBar from '../public/NavBar'
import AsideBar from '../public/AsideBar'
import { SaveButton, BackButton } from '../public/Button'
import Alerts from '../public/Alerts'
import subTitle from '../../utils/subTitle'
import { orgDetails, roleList, userAdd, userDetails, userMod, checkName } from '../../utils/api'
import mixedMD5 from '../../utils/mixedMD5'
import DialogTips from '../../utils/DialogTips'

const RANK_ADMIN_ID = '4';

export default class Editor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            org: null,
            roleList: [],
            checkedRole: [],
        }

        this.checkedRole = this.checkedRole.bind(this)
        this.editorSubmit = this.editorSubmit.bind(this)
    }

    componentDidMount() {
        const dialogTips = DialogTips({ type: 'loading' })

        dialogTips.open()

        $.when(
            orgDetails(this.props.params.oid),
            roleList(this.props.params.oid)
        ).done((org, role) => {
            this.setState({
                org: {
                    id: org.cId,
                    name: org.cName,
                },
                roleList: role
            })

            if (this.props.params.uid === 'create') {
                dialogTips.close()
            } else {
                userDetails(this.props.params.uid)
                    .done((user) => {
                        let checkedRole = [];

                        user.roles.map((item) => {
                            checkedRole.push(item.cId)
                        })

                        this.setState({
                            checkedRole: checkedRole
                        })

                        $(this.editorDom)
                            .find('[name=loginName]')
                            .val(user.cLoginname)
                            .end()
                            .find('[name=realName]')
                            .val(user.cRealname)
                            .end()
                            .find('[name=nickName]')
                            .val(user.cNickname)
                            .end()
                            .find('[name=phone]')
                            .val(user.cPhone)
                            .end()
                            .find('[name=email]')
                            .val(user.cEmail)
                            .end()
                            .find('[name=im]')
                            .val(user.cQq)
                    })
                    .always(() => {
                        dialogTips.close()
                    })
            }
        }).fail(() => {
            dialogTips.close()
        })
    }

    checkedRole(event) {
        let tempRole = [];

        if (event.target.checked === true) {
            const isAdmin = $(event.target).data('rank').toString() === RANK_ADMIN_ID;
            const adminId = $('[data-rank=' + RANK_ADMIN_ID + ']').val();

            tempRole.push(event.target.value)

            if (isAdmin === false) {
                tempRole = tempRole.concat(this.state.checkedRole.filter((id) => { return id !== adminId }))
            }
        } else {
            tempRole = this.state.checkedRole.filter((id) => { return id !== event.target.value })
        }

        this.setState({
            checkedRole: tempRole
        })

        if (tempRole.length) {
            $(this.editorDom)
                .find('input[type=checkbox]')
                .removeAttr('required')
        } else {
            $(this.editorDom)
                .find('input[type=checkbox]')
                .attr('required', 'required')
        }
    }

    editorSubmit(event) {
        if (this.editorDom.checkValidity() === true) {
            event.preventDefault()
        };

        const successPath = SCHOOLPAL_CONFIG.ROOTPATH + 'sys/user';
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })

        loading.open()

        checkName($(this.editorDom).find('[name=loginName]').val())
            .done((data) => {
                if (data === true) {
                    loading.close()
                    $(this.editorDom).find('[name=loginName]')[0].setCustomValidity('登陆名已存在 ！')
                    $(this.editorDom).find('[type=submit]').trigger('click')

                    return;
                }

                let param = {};
                let temp = $(this.editorDom).serializeArray();

                if (this.props.params.uid !== 'create') {
                    param.userId = this.props.params.uid;
                }

                param.orgId = this.state.org.id
                param.roles = this.state.checkedRole.join(',')

                temp.map((item) => {
                    if (item.name === 'loginPass') {
                        if (this.props.params.uid === 'create' || item.value) {
                            param[item.name] = mixedMD5(mixedMD5(item.value))
                        }
                    } else {
                        param[item.name] = item.value;
                    }
                })

                delete temp['org']

                if (this.props.params.uid === 'create') {
                    userAdd(param)
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
                    userMod(param)
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
            })
    }

    render() {
        return (
            <div className="user" >
                <form ref={(dom) => { this.editorDom = dom }} onSubmit={this.editorSubmit}>

                    <h5>
                        <i className="fa fa-user" aria-hidden="true"></i>&nbsp;用户管理&nbsp;&nbsp;|&nbsp;&nbsp;<p className="d-inline text-muted">{subTitle(this.props.router.params.uid, '用户')}</p>
                        <div className="btn-group float-right mr-4" role="group">
                            <BackButton router={this.props.router} />
                            <SaveButton text="保存" />
                        </div>
                    </h5>

                    <div className="main-container">
                        <div className={this.state.roleList.length ? 'd-flex align-items-stretch flex-nowrap' : 'hide'}>

                            <div className="w500 pr-3">
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>所属组织</label>
                                    <input type="text" className="form-control" name="org" value={this.state.org ? this.state.org.name : ''} readOnly="readOnly" />
                                </div>

                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>用户名</label>
                                    <input type="text" className="form-control" name="loginName" onChange={(event) => { event.target.setCustomValidity('') }} readOnly={this.props.params.uid === 'create' ? false : true} required="required" />
                                </div>

                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>登陆密码</label>
                                    <input type="password" className="form-control" name="loginPass" required={this.props.params.uid === 'create' ? true : false} />
                                </div>

                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>姓名</label>
                                    <input type="text" className="form-control" name="realName" required="required" />
                                </div>

                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>电话号码</label>
                                    <input type="text" className="form-control" name="phone" pattern="^1\d{10}$" required="required" />
                                </div>

                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>电子邮箱</label>
                                    <input type="text" className="form-control" name="email" required="required" />
                                </div>

                                <div className="form-group">
                                    <label for="name">昵称</label>
                                    <input type="text" className="form-control" name="nickName" />
                                </div>

                                <div className="form-group">
                                    <label for="name">IM(QQ...)</label>
                                    <input type="text" className="form-control" name="im" />
                                </div>
                            </div>

                            <div className="flex-cell pl-3 b-l">
                                <p className="ht pb-3 b-b">用户角色</p>
                                {
                                    this.state.roleList.map((item) => {
                                        return (
                                            <div key={item.cId} className="form-check">
                                                <label className="form-check-label">
                                                    <input
                                                        onChange={this.checkedRole}
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={item.cId}
                                                        data-rank={item.cRankId}
                                                        checked={this.state.checkedRole.findIndex((id) => { return id === item.cId }) < 0 ? false : true}
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
                    </div>

                </form>
            </div>
        )
    }
}