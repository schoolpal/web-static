import React from 'react'
import { browserHistory } from 'react-router';
import { getProfile } from '../../utils/userProfile'
import mixedMD5 from '../../utils/mixedMD5'
import { changePwd, logout } from '../../utils/api'
import DialogTips from '../../utils/DialogTips'
import { clearProfile } from '../../utils/userProfile'

export default class ChangePwd extends React.Component {
    constructor(props) {
        super(props)

        this.editorSubmit = this.editorSubmit.bind(this)
    }

    editorSubmit(event) {
        if (this.editorPwd.checkValidity() === true) {
            event.preventDefault()
        };

        const oriPass = mixedMD5(mixedMD5($(this.editorPwd).find('[name=oriPass]').val()))
        const newPass = mixedMD5(mixedMD5($(this.editorPwd).find('[name=newPass]').val()))
        const newPassRepeat = mixedMD5(mixedMD5($(this.editorPwd).find('[name=newPassRepeat]').val()))
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })

        let query = {};

        setTimeout(() => {
            if (newPass !== newPassRepeat) {
                $(this.editorPwd).find('[name=newPassRepeat]')[0].setCustomValidity('两次输入不一致 ！')
                $(this.editorPwd).find('[type=submit]').trigger('click')

                return;
            }

            query.oriPass = oriPass;
            query.newPass = newPass;

            loading.open()

            changePwd(query)
                .done(() => {
                    loading.close()
                    success.open()
                    clearProfile()
                    logout()

                    setTimeout(() => {
                        success.close()
                        browserHistory.replace(SCHOOLPAL_CONFIG.ROOTPATH + 'login')
                    }, 2000)
                })
                .fail((data) => {

                })
                .always(() => { loading.close() })
        }, 100)
    }

    render() {
        return (
            <div>
                <p>修改密码</p>
                <form ref={(dom) => { this.editorPwd = dom }} onSubmit={this.editorSubmit} className="w400">
                    <div className="form-group">
                        <label>当前密码</label>
                        <input name="oriPass" type="password" className="form-control" onChange={(event) => { event.target.setCustomValidity('') }} required={true} />
                    </div>
                    <div className="form-group">
                        <label>新密码</label>
                        <input name="newPass" type="password" className="form-control" required={true} />
                    </div>
                    <div className="form-group">
                        <label>重复新密码</label>
                        <input name="newPassRepeat" type="password" className="form-control" onChange={(event) => { event.target.setCustomValidity('') }} required={true} />
                    </div>
                    <button type="submit" className="btn btn-danger">修改密码</button>
                </form>
            </div>
        )
    }
}