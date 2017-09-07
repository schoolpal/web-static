import React from 'react'
import ReactDOM from 'react-dom'
import NavBar from '../public/NavBar'
import AsideBar from '../public/AsideBar'
import { CreateButton, EditorButton, DelButton } from '../public/Button'
import Dialog from '../public/Dialog'
import { sysOrgList, orgDel } from '../../utils/api'
import DialogTips from '../../utils/DialogTips'
import { conversionOrg } from '../../utils/conversion'
import command from '../../utils/command'

export default class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            treeList: [],
            rootLevel: null,

            selected: null,
        }

        this.renderCommand = this.renderCommand.bind(this)
        this.renderTable = this.renderTable.bind(this)
        this.tableLine = this.tableLine.bind(this)
        this.checkedOrg = this.checkedOrg.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
        this.handleEditor = this.handleEditor.bind(this)
        this.handleDel = this.handleDel.bind(this)
        this.handleNode = this.handleNode.bind(this)
        this.confirmDel = this.confirmDel.bind(this)
    }

    componentDidMount() {
        const dialogTips = DialogTips({ type: 'loading' })

        dialogTips.open()

        sysOrgList()
            .done((data) => {
                this.setState({
                    list: data.original,
                    treeList: data.tree,
                    rootLevel: data.rootLevel
                })
            })
            .always(() => {
                dialogTips.close()
            })
    }

    renderCommand() {
        const path = this.props.location.pathname.replace(SCHOOLPAL_CONFIG.ROOTPATH, '');
        const commands = command(path);

        let temp = [];
        let isDisabled;

        if (this.state.selected && this.state.selected.level) {
            isDisabled = false;
        } else {
            isDisabled = true;
        };

        commands.map((item, index) => {
            if (item === 'Add') {
                temp.push(<CreateButton key={index} action={this.handleCreate} />)
            };

            if (item === 'Mod') {
                temp.push(<EditorButton key={index} action={this.handleEditor} disabled={isDisabled} />)
            }

            if (item === 'Del') {
                temp.push(<DelButton key={index} action={this.confirmDel} disabled={isDisabled} />)
            }
        })

        return temp;
    }

    renderTable(data) {
        let table = []

        if (data.length) {
            $.each(data, (i, item) => {
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
        const selectedClass = 'select' + ((this.state.selected && this.state.selected.toString() === data.cId) ? ' selected' : '');
        const spacingStyle = { marginLeft: 40 * data.level + 'px' };
        const childrenClass = data.children ? '' : 'not-child';
        const area = data.cState + ' ' + data.cCity + ' ' + data.cCounty;
        const addr = area + ' ' + data.cAddress;

        return (
            <tr key={data.cId} data-id={data.cId} data-level={data.level}>
                <th scope="row">
                    <div className="form-check">
                        <label className="form-check-label">
                            <input
                                onChange={this.checkedOrg}
                                className="form-check-input"
                                type="radio"
                                name="org"
                                checked={(this.state.selected && data.cId.toString() === this.state.selected.id) ? true : false}
                                value={data.cId}
                            />
                        </label>
                    </div>
                </th>
                <td>
                    <p onClick={this.handleNode} className={'tree-node ' + childrenClass} style={spacingStyle}>{data.cName}</p>
                </td>
                <td>{area}</td>
                <td>{addr}</td>
                <td>{data.cOwner}</td>
                <td>{data.cOwnerPhone}</td>
            </tr>
        );
    }

    checkedOrg(event) {
        if (event.target.checked === true) {
            this.setState({
                selected: {
                    id: event.target.value,
                    name: $(event.target).parents('tr').find('p').text(),
                    level: $(event.target).parents('tr').data('level')
                }
            })
        }
    }

    handleCreate() {
        this.props.router.push({
            pathname: SCHOOLPAL_CONFIG.ROOTPATH + 'sys/org/create',
            state: { selected: this.state.selected }
        })
    }

    handleEditor() {
        const editorPath = SCHOOLPAL_CONFIG.ROOTPATH + 'sys/org/' + this.state.selected.id;

        this.props.router.push(editorPath)
    }

    confirmDel() {
        const div = document.createElement('div');

        ReactDOM.render(
            <Dialog
                container={div}
                text={'是否确认删除 ' + this.state.selected.name + ' 组织 ？'}
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

        orgDel(this.state.selected.id)
            .done(() => {
                const tempList = this.state.list.filter((item) => { return item.cId !== this.state.selected.id });
                const temp = conversionOrg(tempList);

                loading.close()
                success.open()

                this.setState({
                    list: temp.original,
                    treeList: temp.tree,
                    rootLevel: temp.rootLevel,

                    selected: null,
                })
            })
            .fail(() => {
                loading.close()
                fail.open()
            })
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
            <div className="org">
                <h5>
                    <i className="fa fa-sitemap" aria-hidden="true"></i>&nbsp;组织管理
                    <div className="btn-group float-right" role="group">
                        {this.renderCommand()}
                    </div>
                </h5>
                <div className="main-container">
                    <table className="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>&nbsp;</th>
                                <th>组织名称</th>
                                <th>所在地区</th>
                                <th>详细地址</th>
                                <th>负责人</th>
                                <th>联系电话</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTable(this.state.treeList)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}