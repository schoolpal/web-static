import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './public/NavBar';
import { LoginButton } from './public/Button';
import Dialog from './public/Dialog';
import { salt, login, profile } from '../utils/api';
import { setProfile } from '../utils/userProfile'
import mixedMD5 from '../utils/mixedMD5'

export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
        this.signin = this.signin.bind(this);
        this.signinErrorDialog = this.signinErrorDialog.bind(this);
    }

    signinErrorDialog(text) {
        const div = document.createElement('div');

        ReactDOM.render(
            <Dialog
                container={div}
                text={text}
            />,
            document.body.appendChild(div)
        )
    }

    signin(event) {
        if (this.from.checkValidity() === true) {
            event.preventDefault()
        };

        const $from = $(this.from);
        const username = $from.find('[name=username]').val();
        const mixedPWD = $from.find('[name=mixedPWD]').val();

        this.setState({
            loading: true
        });

        salt().done((salt) => {
            login({
                loginname: username,
                mixedPWD: mixedMD5(mixedMD5(mixedMD5(mixedPWD)) + salt)
            }).done(() => {
                profile().done((data) => {
                    let user = {}
                    let func = []

                    user.name = data.cRealname
                    user.org = data.org.cName
                    user.roles = []
                    user.access = []

                    data.roles.map((item) => {
                        func = func.concat(item.functions)
                    })

                    func.map((item) => {
                        if (item.WidgetType === 'MenuItem') {
                            const temp = $.extend({}, { id: item.cId, command: [] }, SCHOOLPAL_CONFIG.AUTH_DIC[item.cId]);

                            user.roles.push(temp)
                        }

                        if (item.WidgetType === 'Command') {
                            const index = user.roles.findIndex((value) => { return value.id === item.cParentId });

                            if (index >= 0) {
                                user.roles[index].command.push(item.CommandCode);
                            }
                        }

                        if (SCHOOLPAL_CONFIG.AUTH_DIC[item.cId]) {
                            user.access.push(item.cId)
                        }
                    })

                    setProfile(user)

                    if (this.props.router.location.state && this.props.router.location.state.nextPathname) {
                        this.props.router.replace(this.props.router.location.state.nextPathname);
                    } else {
                        this.props.router.replace(SCHOOLPAL_CONFIG.ROOTPATH);
                    }
                })
            }).fail((data) => {
                this.setState({
                    loading: false
                });
                this.signinErrorDialog('[' + data.data.code + '] - ' + data.data.detail);
            });
        });
    }

    render() {
        return (
            <div className="view">
                <NavBar />
                <div className="login bg-faded">
                    <div className="login-form">
                        <h5 className="text-primary">LOGIN</h5>
                        <form ref={(dom) => { this.from = dom }} onSubmit={this.signin}>
                            <ul>
                                <li><input name="username" type="text" placeholder="输入用户名 ..." required="required" /></li>
                                <li><input name="mixedPWD" type="password" placeholder="输入密码 ..." required="required" /></li>
                            </ul>
                            <LoginButton loading={this.state.loading} />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}