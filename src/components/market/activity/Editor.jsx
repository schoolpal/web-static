import React from 'react';
import subTitle from '../../../utils/subTitle';
import { SaveButton, BackButton } from '../../public/Button';
import { actAdd, actMod, actQuery, mktActList } from '../../../utils/api';
import DialogTips from '../../../utils/DialogTips';
import formatDate from '../../../utils/formatDate'
import changeText from '../../../utils/changeText'

require('../../../utils/datepicker');

function renderListOption(data) {
    let group = [];

    if ($.isEmptyObject(data) === false) {
        const tempOrg = data.orgList.filter((org) => {
            if (data.actListMap[org.cId].length) {
                return org
            }
        })

        group = tempOrg.map((org) => {
            const tempList = data.actListMap[org.cId].filter((act) => {
                if (act.level < 3) {
                    return act
                }
            })

            return (
                <optgroup key={org.cId} label={org.cName}>
                    {
                        tempList.map((act) => {
                            const content = space(act.level) + act.name;

                            return <option key={act.id} value={act.id} dangerouslySetInnerHTML={{ __html: content }}></option>
                        })
                    }
                </optgroup>
            )
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

export default class Editor extends React.Component {
    constructor(props) {
        super(props)

        this.state = { option: [] }
        this.dataInit = this.dataInit.bind(this)
        this.editorSubmit = this.editorSubmit.bind(this)
    }

    componentDidMount() {
        if (this.props.org) {
            this.dataInit(this.props.org.id)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.org) {
            if (!this.props.org || this.props.org.id !== nextProps.org.id) {
                this.dataInit(nextProps.org.id)
            }
        }
    }

    dataInit(oid) {
        const loading = DialogTips({ type: 'loading' })

        loading.open()
        mktActList(oid)
            .done((data) => {
                this.setState({
                    option: data
                })

                if (this.props.params.id !== 'create') {
                    actQuery(this.props.params.id)
                        .done((act) => {
                            $(this.editorDom).find('[name=name]').val(act.name)
                            $(this.editorDom).find('[name=startDate]').val(formatDate(act.startDate))
                            $(this.editorDom).find('[name=endDate]').val(formatDate(act.endDate))
                            $(this.editorDom).find('[name=budget]').val(act.budget)
                            $(this.editorDom).find('[name=cost]').val(act.cost)
                        })
                        .always(() => { loading.close() })
                } else {
                    loading.close()
                }
            })
            .fail(() => {
                loading.close()
            })
    }

    editorSubmit(event) {
        if (this.editorDom.checkValidity() === true) {
            event.preventDefault()
        };

        const successPath = SCHOOLPAL_CONFIG.ROOTPATH + 'crm/market/activity';
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })
        let param = {};

        param.orgnizationId = this.props.org.id;

        if ($(this.editorDom).find('[name=parentId]').val() !== 'root') {
            param.parentId = $(this.editorDom).find('[name=parentId]').val()
        }

        param.name = $(this.editorDom).find('[name=name]').val()
        param.startDate = new Date($(this.editorDom).find('[name=startDate]').val())
        param.endDate = new Date($(this.editorDom).find('[name=endDate]').val())
        param.budget = $(this.editorDom).find('[name=budget]').val() ? $(this.editorDom).find('[name=budget]').val() : 0;
        param.cost = $(this.editorDom).find('[name=cost]').val() ? $(this.editorDom).find('[name=cost]').val() : 0;

        loading.open()

        if (this.props.params.id !== 'create') {
            param.id = this.props.params.id;
            actMod(param)
                .done(() => {
                    loading.close()
                    success.open()
                    setTimeout(() => {
                        success.close()
                        this.props.router.push(successPath + '/' + this.props.params.id)
                    }, 2000)
                })
                .fail((data) => {
                    loading.close()
                    fail.open()
                })
        } else {
            actAdd(param)
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
            <div className="market">
                <form ref={(dom) => { this.editorDom = dom }} onSubmit={this.editorSubmit}>

                    <h5>
                        <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;市场活动&nbsp;&nbsp;|&nbsp;&nbsp;<p className="d-inline text-muted">{subTitle(this.props.router.params.id, '市场活动')}</p>
                        <div className="btn-group float-right mr-4" role="group">
                            <BackButton router={this.props.router} />
                            <SaveButton text="保存" />
                        </div>
                    </h5>

                    <div className="main-container">
                        <div className="w500">

                            <div className="form-group">
                                <label for="name"><em className="text-danger">*</em>活动名称</label>
                                <input type="text" className="form-control" name="name" required={true} />
                            </div>

                            <div className="form-group">
                                <label for="name"><em className="text-danger">*</em>父级市场活动</label>
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle d-flex" type="button">
                                        <span className="flex-cell">作为一级活动</span>
                                    </button>
                                    <select onChange={(event) => { changeText(event.target) }} className="form-control opacity" name="parentId" required={true}>
                                        <option value="root">作为一级活动</option>
                                        {renderListOption(this.state.option)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label for="name">时间范围</label>
                                <div data-toggle="datepicker" className="form-inline input-daterange">
                                    <input type="text" className="form-control input-date w200" name="startDate" />
                                    <span className="form-control-static">&nbsp;-&nbsp;</span>
                                    <input type="text" className="form-control input-date w200" name="endDate" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label for="name">预算费用</label>
                                <input type="text" className="form-control" name="budget" />
                            </div>

                            <div className="form-group">
                                <label for="name">实际费用</label>
                                <input type="text" className="form-control" name="cost" />
                            </div>

                        </div>
                    </div>

                </form>
            </div>
        )
    }
}