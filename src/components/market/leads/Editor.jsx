import React from 'react';
import ContactList from '../../contact/List'
import { SaveButton, BackButton } from '../../public/Button';
import DialogTips from '../../../utils/DialogTips';
import { leadsSources, leadsStages, leadsStatus, genderList, relationList, mktActList, leadsAdd, leadsQuery, leadsMod } from '../../../utils/api';
import changeText from '../../../utils/changeText'
import { GRADE, COURSE_CATEGORY, COURSE_PRODUCTS } from '../../../utils/static'

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

function renderNormalOption(data) {
    let option = [];

    if (data.length) {
        option = data.map((item) => {
            return <option key={item.id} value={item.id}>{item.name}</option>
        })
    }

    return option
}

function renderObjectOption(data) {
    let option = [];

    $.each(data, (i, item) => {
        option.push(<option key={i} value={item}>{item}</option>)
    })

    return option
}

export default class Editor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            orgList: [],
            selected: null,
        }
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
        $.when(
            mktActList(oid),
            leadsSources(1),
            leadsStages(1),
            leadsStatus(1),
            genderList(),
            relationList()
        ).done((act, sources, stages, status, gender, relation) => {
            this.setState({
                option: {
                    act,
                    sources,
                    stages,
                    status,
                    gender,
                    relation
                }
            })

            if (this.props.params.id !== 'create') {
                leadsQuery(this.props.params.id)
                    .done((data) => {
                        this.setState({
                            student: data.student
                        })

                        $(this.editorDom).find('[name=studentName]').val(data.student.name)
                        $(this.editorDom).find('[name=age]').val(data.student.age)
                        $(this.editorDom).find('[name=schoolName]').val(data.student.schoolName)
                        $(this.editorDom).find('[name=parentName]').val(data.parent.name)
                        $(this.editorDom).find('[name=cellphone]').val(data.parent.cellphone)
                        $(this.editorDom).find('[name=weichat]').val(data.parent.weichat)
                        $(this.editorDom).find('[name=address]').val(data.parent.address)

                        $(this.editorDom).find('textarea, select').each(function () {
                            const name = $(this).attr('name');

                            switch (name) {
                                case 'classGrade':
                                    $(this).val(data.student.classGrade)
                                    break;
                                case 'studentGender':
                                    $(this).val(data.student.genderText)
                                    break;
                                case 'relation':
                                    $(this).val(data.parent.relation)
                                    break;
                                default:
                                    $(this).val(data[name])
                            }

                            if (name === 'channelId') {
                                $(this).siblings('button').find('span').text(data.channelName)
                            }
                        })
                    })
                    .always(() => {
                        loading.close()
                    })
            } else {
                loading.close()
            }
        }).fail(() => {
            loading.close()
        })
    }

    editorSubmit(event) {
        if (this.editorDom.checkValidity() === true) {
            event.preventDefault()
        };

        const form = $(this.editorDom);
        let flug = 0;

        form.find('select[required]').each(function () {
            if ($(this).val() === 'null') {
                this.setCustomValidity('请选择 ！')
                flug++;

                return false;
            }
        })

        if (flug) {
            setTimeout(() => {
                form.find('[type=submit]').trigger('click')
            }, 100)

            return;
        }

        const successPath = SCHOOLPAL_CONFIG.ROOTPATH + 'crm/market/leads';
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })
        let param = {};

        param.orgnizationId = this.props.org.id;

        loading.open()

        $(this.editorDom).serializeArray().map((item) => {
            param[item.name] = item.value;
        })

        if (this.props.params.id !== 'create') {
            param.leadsId = this.props.params.id;
            leadsMod(param)
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
            leadsAdd(param)
                .done((data) => {
                    loading.close()
                    success.open()
                    setTimeout(() => {
                        success.close()
                        this.props.router.push(successPath + '/edit/' + data)
                    }, 2000)
                })
                .fail((data) => {
                    loading.close()
                    fail.open()
                })
        }
    }

    render() {
        const subTitle = this.props.router.params.id === 'create' ? '新建销售线索' : this.state.student ? this.state.student.name : '';

        return (
            <div className="market">
                <form ref={(dom) => { this.editorDom = dom }} onSubmit={this.editorSubmit}>

                    <h5>
                        <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;销售线索&nbsp;&nbsp;|&nbsp;&nbsp;<p className="d-inline text-muted">{subTitle}</p>
                        <div className="btn-group float-right mr-4" role="group">
                            <BackButton router={this.props.router} />
                            <SaveButton text="保存" />
                        </div>
                    </h5>

                    <div className="main-container">
                        <p className="ht pb-3 b-b">线索信息</p>
                        <div className="row">
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>学员姓名</label>
                                        <div className="flex-cell">
                                            <input type="text" className="form-control" name="studentName" required={true} />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">学员姓别</label>
                                        <div className="flex-cell">
                                            <select name="studentGender" className="form-control">
                                                <option value="null">请选择</option>
                                                {renderObjectOption(this.state.option ? this.state.option.gender : [])}
                                            </select>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>学员年龄</label>
                                        <div className="flex-cell">
                                            <input type="text" className="form-control" name="age" required={true} />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">在读年级</label>
                                        <div className="flex-cell">
                                            <select name="classGrade" className="form-control">
                                                <option value="null">请选择</option>
                                                {
                                                    GRADE.map((item) => {
                                                        return <option key={item} value={item}>{item}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">所在学校</label>
                                        <div className="flex-cell">
                                            <input type="text" className="form-control" name="schoolName" />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>家长姓名</label>
                                        <div className="flex-cell">
                                            <input type="text" className="form-control" name="parentName" required={true} />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>与孩子关系</label>
                                        <div className="flex-cell">
                                            <select name="relation" onChange={(event) => { event.target.setCustomValidity('') }} className="form-control" required={true}>
                                                <option key="null" value="null">请选择</option>
                                                {renderObjectOption(this.state.option ? this.state.option.relation : [])}
                                            </select>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>联系电话</label>
                                        <div className="flex-cell">
                                            <input type="text" className="form-control" name="cellphone" required={true} />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">微信号</label>
                                        <div className="flex-cell">
                                            <input type="text" className="form-control" name="weichat" />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">家庭住址</label>
                                        <div className="flex-cell">
                                            <input type="text" className="form-control" name="address" />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">课程类别</label>
                                        <div className="flex-cell">
                                            <select name="courseType" className="form-control">
                                                <option value="null">请选择</option>
                                                {
                                                    COURSE_CATEGORY.map((item) => {
                                                        return <option key={item} value={item}>{item}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">课程产品</label>
                                        <div className="flex-cell">
                                            <select name="courseName" className="form-control">
                                                <option value="null">请选择</option>
                                                {
                                                    COURSE_PRODUCTS.map((item) => {
                                                        return <option key={item} value={item}>{item}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">备注</label>
                                        <div className="flex-cell">
                                            <textarea name="note" className="form-control" rows='3'></textarea>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <p className="ht pt-3 pb-3 b-t b-b">线索进程</p>
                        <div className="row">
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>信息来源</label>
                                        <div className="flex-cell">
                                            <select name="sourceId" className="form-control" onChange={(event) => { event.target.setCustomValidity('') }} required={true}>
                                                <option key="null" value="null">请选择</option>
                                                {renderNormalOption(this.state.option ? this.state.option.sources : [])}
                                            </select>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>具体渠道</label>
                                        <div className="flex-cell">
                                            <div className="dropdown">
                                                <button className="btn btn-secondary dropdown-toggle d-flex" type="button">
                                                    <span className="flex-cell">请选择</span>
                                                </button>
                                                <select onChange={(event) => { event.target.setCustomValidity(''); changeText(event.target); }} className="form-control opacity" name="channelId" required={true}>
                                                    <option key="null" value="null">请选择</option>
                                                    {renderListOption(this.state.option ? this.state.option.act : [])}
                                                </select>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>线索阶段</label>
                                        <div className="flex-cell">
                                            <select name="stageId" className="form-control" onChange={(event) => { event.target.setCustomValidity('') }} required={true}>
                                                <option key="null" value="null">请选择</option>
                                                {renderNormalOption(this.state.option ? this.state.option.stages : [])}
                                            </select>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>线索状态</label>
                                        <div className="flex-cell">
                                            <select name="statusId" className="form-control" onChange={(event) => { event.target.setCustomValidity('') }} required={true}>
                                                <option key="null" value="null">请选择</option>
                                                {renderNormalOption(this.state.option ? this.state.option.status : [])}
                                            </select>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col"></div>
                            <div className="col"></div>
                            {
                                // <div className="col">
                                //     <ul>
                                //         <li className="d-flex">
                                //             <label for="name" className="col-form-label d-block w100">所属组织</label>
                                //             <div className="flex-cell">
                                //                 <select className="form-control">
                                //                     <option>请选择</option>
                                //                 </select>
                                //             </div>
                                //         </li>
                                //         <li className="d-flex">
                                //             <label for="name" className="col-form-label d-block w100">所属用户</label>
                                //             <div className="flex-cell">
                                //                 <select className="form-control">
                                //                     <option>请选择</option>
                                //                 </select>
                                //             </div>
                                //         </li>
                                //     </ul>
                                // </div>
                                // <div className="col">
                                //     <ul>
                                //         <li className="d-flex">
                                //             <label for="name" className="col-form-label d-block w100">创建人</label>
                                //             <div className="flex-cell">
                                //                 <select className="form-control">
                                //                     <option>请选择</option>
                                //                 </select>
                                //             </div>
                                //         </li>
                                //         <li className="d-flex">
                                //             <label for="name" className="col-form-label d-block w100">创建时间</label>
                                //             <div className="flex-cell">
                                //                 <select className="form-control">
                                //                     <option>请选择</option>
                                //                 </select>
                                //             </div>
                                //         </li>
                                //     </ul>
                                // </div>
                            }
                        </div>
                        <ContactList canEditd={true} leadsId={this.props.params.id} />
                    </div>

                </form>
            </div>
        )
    }
}