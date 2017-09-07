import React from 'react';
import ReactDOM from 'react-dom';
import { userList } from '../../utils/api';
import DialogTips from '../../utils/DialogTips';

export default class SelectUserPanel extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            orgList: this.props.orgList,
            userList: [],

            defaults: {
                oid: this.props.option.org.id,
                oname: this.props.option.org.name,
                uid: this.props.option.user.id,
                uname: this.props.option.user.name,
                studentName: this.props.option.student.name
            },
            selectedOrg: {
                id: this.props.option.org.id,
                name: this.props.option.org.name
            },
            selecteduser: {
                id: 'defaults',
                name: 'defaults'
            }
        }

        this.closed = this.closed.bind(this)
        this.renderListOption = this.renderListOption.bind(this)
        this.renderNormalOption = this.renderNormalOption.bind(this)
        this.selectOrg = this.selectOrg.bind(this)
        this.selectUser = this.selectUser.bind(this)
        this.action = this.action.bind(this)
    }

    componentDidMount() {
        userList(this.state.defaults.oid)
            .done((data) => {
                this.setState({
                    userList: data
                })
            })
        $(this.panel)
            .modal('show')
            .one('hidden.bs.modal', () => {
                this.closed();
            });
    }

    componentWillUnmount() {
        document.body.removeChild(this.props.container);
    }

    closed() {
        ReactDOM.unmountComponentAtNode(this.props.container);
    }

    renderListOption(data) {
        let group = [];

        if (data.length) {
            group = data.map((item) => {
                const content = space(item.level) + item.cName;

                return <option key={item.cId} value={item.cId} dangerouslySetInnerHTML={{ __html: content }}></option>
            })
        }

        return group

        function space(level) {
            const base = '&nbsp;&nbsp;&nbsp;&nbsp;';
            let s = '';

            if (level) {
                for (let i = 0; i < level; i++) {
                    s += base;
                }
            }

            return s
        }
    }

    renderNormalOption(data) {
        let option = [];

        if (data.length) {
            option = data.map((item) => {
                return <option key={item.cId} value={item.cId}>{item.cRealname}</option>
            })
        }

        return option
    }

    selectOrg(event) {
        const oid = $(event.target).val();
        const oname = $(event.target).find('option:selected').html().replace(/&nbsp;/gi, '');

        this.setState({
            selectedOrg: {
                id: oid,
                name: oname
            }
        })

        userList(oid)
            .done((user) => {
                this.setState({
                    userList: user,
                    selecteduser: {
                        id: 'defaults',
                        name: 'defaults'
                    },
                })
            })
    }

    selectUser(event) {
        const uid = event.target.value;
        const uname = $(event.target).find('option:selected').html();

        this.setState({
            selecteduser: {
                id: uid,
                name: uname
            }
        })
    }

    action() {
        this.props.action({
            user: this.state.selecteduser
        }, $(this.panel))
    }

    render() {
        return (
            <div className="modal fade" ref={(dom) => { this.panel = dom }} tabindex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="h5 modal-title">{this.state.defaults.studentName}</p>
                            <button type="button" className="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body market">
                            <ul>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">所属组织</label>
                                    <div className="flex-cell">
                                        <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle d-flex" type="button">
                                                <span className="flex-cell">{this.state.selectedOrg.name}</span>
                                            </button>
                                            <select value={this.state.selectedOrg.id} onChange={this.selectOrg} className="form-control opacity" name="org">
                                                {this.renderListOption(this.state.orgList)}
                                            </select>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100">所属用户</label>
                                    <div className="flex-cell">
                                        <select value={this.state.selecteduser.id} onChange={this.selectUser} name="assigneeId" className="form-control">
                                            <option value="defaults">请选择</option>
                                            {this.renderNormalOption(this.state.userList)}
                                        </select>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">取消</button>
                            <button onClick={this.action} type="button" className="btn btn-primary" disabled={this.state.selecteduser === 'defaults' ? true : false}>确定</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}