import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import { EditorButton, DelButton, BackButton, AssignButton, SignButton } from '../../public/Button';
import LeadsView from '../../public/LeadsView'
import SelectUserPanel from '../../public/SelectUserPanel';
import command from '../../../utils/command'
import { orgList, opporQuery, opporDel, opporAssign } from '../../../utils/api';
import Dialog from '../../public/Dialog'
import DialogTips from '../../../utils/DialogTips';

export default class Editor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            orgList: [],
            data: null,
            modalStatus: 'closed',
        }
        this.renderCommand = this.renderCommand.bind(this)
        this.handleEditor = this.handleEditor.bind(this)
        this.handleModal = this.handleModal.bind(this)
        this.handleAssign = this.handleAssign.bind(this)
        this.confirmDel = this.confirmDel.bind(this)
        this.handleDel = this.handleDel.bind(this)
        this.getModalOption = this.getModalOption.bind(this)
    }

    componentDidMount() {
        const dialogTips = DialogTips({ type: 'loading' })

        dialogTips.open()
        $.when(
            orgList(),
            opporQuery(this.props.params.id)
        ).done((org, data) => {
            this.setState({
                orgList: org.original,
                data: data
            })
        }).always(() => {
            dialogTips.close()
        })
    }


    renderCommand() {
        const path = this.props.location.pathname.replace(SCHOOLPAL_CONFIG.ROOTPATH, '');
        const commands = command(path);
        let temp = [];

        commands.map((item, index) => {
            if (item === 'Mod') {
                temp.push(<EditorButton key={index} action={this.handleEditor} />)
            }

            if (item === 'Del') {
                temp.push(<DelButton key={index} action={this.confirmDel} />)
            }

            if (item === 'Assign') {
                temp.push(<AssignButton key={index} action={this.handleAssign} />)
            }

            if (item === 'Sign') {
                temp.push(<SignButton key={index} link={SCHOOLPAL_CONFIG.ROOTPATH + 'crm/sales/contract/edit/create/' + this.props.params.id} />)
            }
        })

        return temp;
    }

    handleEditor() {
        const editorPath = SCHOOLPAL_CONFIG.ROOTPATH + 'crm/sales/oppor/edit/' + this.props.params.id

        this.props.router.push(editorPath)
    }

    handleModal(selected, modal) {
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })
        const data = update(this.state.data, {
            executiveId: { $set: selected.user.id },
            executiveName: { $set: selected.user.name },
        })

        loading.open()
        opporAssign({ id: this.props.params.id, assigneeId: selected.user.id })
            .done(() => {
                loading.close()
                success.open()

                this.setState({
                    data: data
                })

                setTimeout(() => {
                    success.close()
                    modal.modal('hide');
                }, 2000)
            })
            .fail(() => {
                loading.close()
                fail.open()
            })

    }

    getModalOption() {
        return {
            org: {
                id: this.state.data.orgnizationId,
                name: this.state.data.orgnizationName
            },
            user: {
                id: this.state.data.executiveId,
                name: this.state.data.executiveName
            },
            student: this.state.data.student
        }
    }

    handleAssign() {
        const div = document.createElement('div');
        const option = this.getModalOption()

        ReactDOM.render(
            <SelectUserPanel
                container={div}
                orgList={this.state.orgList}
                option={option}
                action={this.handleModal}
            />,
            document.body.appendChild(div)
        )
    }

    confirmDel() {
        const div = document.createElement('div');

        ReactDOM.render(
            <Dialog
                container={div}
                text={'是否确认删除此线索 ？'}
                action={this.handleDel}
            />,
            document.body.appendChild(div)
        )
    }

    handleDel() {
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })

        loading.open()
        opporDel(this.props.params.id)
            .done(() => {
                loading.close()
                success.open()

                setTimeout(() => {
                    success.close()
                    this.props.router.replace(SCHOOLPAL_CONFIG.ROOTPATH + 'crm/sales/oppor')
                }, 2000)
            })
            .fail(() => {
                loading.close()
                fail.open()
            })
    }

    render() {
        return (
            <div className="market">

                <h5>
                    <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;销售机会&nbsp;&nbsp;|&nbsp;&nbsp;<p className="d-inline text-muted">{this.state.data ? this.state.data.student.name : '--'}</p>
                    {
                        // <div className="btn-group float-right mr-4" role="group">
                        //     <button type="button" className="btn btn-secondary">上一条</button>
                        //     <button type="button" className="btn btn-secondary">下一条</button>
                        // </div>
                    }
                    <div className="btn-group float-right mr-4" role="group">
                        <BackButton router={this.props.router} />
                    </div>
                    <div className="btn-group float-right mr-4" role="group">
                        {this.renderCommand()}
                    </div>
                </h5>

                <LeadsView
                    type='oppor'
                    linkedId={this.props.params.id}
                    data={this.state.data}
                />
            </div>
        )
    }
}