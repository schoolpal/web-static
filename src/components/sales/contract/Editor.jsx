import React from 'react';
import update from 'react-addons-update';
import subTitle from '../../../utils/subTitle';
import { SaveButton, BackButton } from '../../public/Button';
import RenderOption from '../../public/renderOption';
import { genderList, relationList, opporQuery, contractAdd, contractQuery } from '../../../utils/api'
import DialogTips from '../../../utils/DialogTips';
import formatDate from '../../../utils/formatDate';
import { GRADE, COURSE_CATEGORY, COURSE_PRODUCTS, TYPE_ID } from '../../../utils/static'

require('../../../utils/datepicker');

function calculateAge(birthday) {
    const now = new Date();
    const start = new Date(birthday);

    return (now.getFullYear() - start.getFullYear());
}

export default class Editor extends React.Component {
    constructor(props) {
        super(props)

        this.state = { option: null, form: null }
        this.dataInit = this.dataInit.bind(this);
        this.renderFormItem = this.renderFormItem.bind(this);
        this.formItemsChange = this.formItemsChange.bind(this);
        this.editorSubmit = this.editorSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.org) {
            this.dataInit(this.props.org.id)
        }

        $('[name="stuBirthday"]').on('changeDate', (event) => {
            const date = formatDate(event.date);

            $(this.editorDom).find('[name=stuAge]').val(calculateAge(date));
        })
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
            genderList(),
            relationList(),
        ).done((gender, relation) => {
            this.setState({
                option: {
                    gender,
                    relation
                },
            })

            if (this.props.params.opporid) {
                opporQuery(this.props.params.opporid)
                    .done((data) => {
                        this.renderFormItem({
                            stuName: data.student.name,
                            stuGender: data.student.genderText || 'null',
                            stuBirthday: formatDate(data.student.birthday),
                            stuAge: calculateAge(formatDate(data.student.birthday)),
                            stuGrade: data.student.classGrade,
                            stuSchool_name: data.student.schoolName || '',
                            parName: data.parent.name,
                            relation: data.parent.relation,
                            parCellphone: data.parent.cellphone,
                            parWechat: data.parent.parWechat || '',
                            parEmail: data.parent.parEmail || '',
                            parAddress: data.parAddress ? data.parAddress : '',
                            courseType: data.courseType || 'null',
                            courseName: data.courseName || 'null',
                            type: TYPE_ID[data.typeId],
                        })
                    })
                    .always(() => {
                        loading.close()
                    })
            } else {
                contractQuery(this.props.params.id)
                    .done((data) => {
                        this.renderFormItem({
                            stuName: data.stuName,
                            stuGender: data.stuGender || 'null',
                            stuBirthday: formatDate(data.stuBirthday),
                            stuAge: calculateAge(formatDate(data.stuBirthday)),
                            stuGrade: data.stuGrade,
                            stuSchool_name: '',
                            stuIdType: data.stuIdType || 'null',
                            stuIdCode: data.stuIdCode || '',
                            parName: data.parName,
                            relation: data.relation,
                            parCellphone: data.parCellphone,
                            parWechat: data.parWechat || '',
                            parEmail: data.parEmail || '',
                            parAddress: data.parAddress || '',
                            courseType: data.courseType,
                            courseName: data.courseName || 'null',
                            courseHours: data.courseHours,
                            courseTimes: data.courseTimes,
                            oriPrice: data.oriPrice,
                            discPrice: data.discPrice,
                            finalPrice: data.finalPrice,
                            paid: data.paid,
                            code: data.code,
                            type: data.type,
                            startDate: formatDate(data.startDate),
                            endDate: formatDate(data.endDate),
                        })
                    })
                    .always(() => {
                        loading.close()
                    })
            }
        }).fail(() => {
            loading.close()
        });
    }

    renderFormItem(data) {
        $.each(data, (key, value) => {
            $(this.editorDom).find(`[name=${key}]`).val(value);
        });
    }

    formItemsChange(event) {
        if (this.state.form) {
            const key = event.target.getAttribute('name');
            const value = event.target.value;
            const temp = {};
            let data;

            temp[key] = value;
            data = update(this.state.form, { $merge: temp });

            this.setState({
                form: data
            })
        }
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

        let query = {};

        $(this.editorDom).serializeArray().map((item) => {
            if (item.name === 'stuBirthday' || item.name === 'startDate' || item.name === 'endDate') {
                query[item.name] = new Date(item.value)
            } else {
                query[item.name] = item.value !== 'null' ? item.value : '';
            }

            if (item.name === 'code') {
                query.stuCode = item.value;
            }
        })

        query.orgId = this.props.org.id;
        query.courseOriId = 1;
        query.courseSesId = 2;

        const successPath = SCHOOLPAL_CONFIG.ROOTPATH + 'crm/sales/contract';
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })

        loading.open()
        contractAdd(query)
            .done((data) => {
                loading.close()
                success.open()
                setTimeout(() => {
                    success.close()
                    this.props.router.push(successPath + '/' + data)
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
                <form ref={(dom) => { this.editorDom = dom }} onSubmit={this.editorSubmit}>

                    <h5>
                        <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;我的合同&nbsp;&nbsp;|&nbsp;&nbsp;<p className="d-inline text-muted">{subTitle(this.props.router.params.id, '合同')}</p>
                        <div className="btn-group float-right mr-4" role="group">
                            <BackButton router={this.props.router} />
                            <SaveButton text="保存" />
                        </div>
                    </h5>

                    <div className="main-container">
                        <p className="ht pb-3 b-b">基本信息</p>
                        <div className="row">
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>学员姓名</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="stuName"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">学员姓别</label>
                                        <div className="flex-cell">
                                            <select
                                                name="stuGender"
                                                className="form-control"
                                            >
                                                <option value="null">请选择</option>
                                                {RenderOption(this.state.option ? this.state.option.gender : [])}
                                            </select>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>出生年月</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                data-toggle="datepicker"
                                                className="form-control"
                                                name="stuBirthday"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>学员年龄</label>
                                        <div className="flex-cell">
                                            <input
                                                name="stuAge"
                                                type="text"
                                                className="form-control"
                                                disabled={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>在读年级</label>
                                        <div className="flex-cell">
                                            <select
                                                name="stuGrade"
                                                className="form-control"
                                            >
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
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>所在学校</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="stuSchool_name"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">证件类型</label>
                                        <div className="flex-cell">
                                            <select
                                                className="form-control"
                                                name="stuIdType"
                                            >
                                                <option key="null" value="null">请选择</option>
                                                <option value="身份证">身份证</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">证件号码</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="stuIdCode"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>家长姓名</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="parName"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>与孩子关系</label>
                                        <div className="flex-cell">
                                            <select
                                                name="relation"
                                                onChange={(event) => { event.target.setCustomValidity(''); }}
                                                className="form-control"
                                                required={true}
                                            >
                                                <option key="null" value="null">请选择</option>
                                                {RenderOption(this.state.option ? this.state.option.relation : [])}
                                            </select>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>联系电话</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="parCellphone"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">微信号</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="parWechat"
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">电子邮箱</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="parEmail"
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100">家庭住址</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="parAddress"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col"></div>
                        </div>
                        <p className="ht pt-3 pb-3 b-t b-b">合同信息</p>
                        <div className="row">
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>课程类别</label>
                                        <div className="flex-cell">
                                            <select
                                                name="courseType"
                                                className="form-control"
                                                onChange={(event) => { event.target.setCustomValidity(''); }}
                                                required={true}
                                            >
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
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>课程产品</label>
                                        <div className="flex-cell">
                                            <select
                                                name="courseName"
                                                className="form-control"
                                                onChange={(event) => { event.target.setCustomValidity(''); }}
                                                required={true}
                                            >
                                                <option value="null">请选择</option>
                                                {
                                                    COURSE_PRODUCTS.map((item) => {
                                                        return <option key={item} value={item}>{item}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>课时</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="courseHours"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>课次</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="courseTimes"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>合同金额</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="oriPrice"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>折扣金额</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="discPrice"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>应付金额</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="finalPrice"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>已付金额</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="paid"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>合同编号</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="code"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>合同类型</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="type"
                                                readOnly={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>签约日期</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                data-toggle="datepicker"
                                                className="form-control"
                                                name="startDate"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>到期日期</label>
                                        <div className="flex-cell">
                                            <input
                                                type="text"
                                                data-toggle="datepicker"
                                                className="form-control"
                                                name="endDate"
                                                required={true}
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col"></div>
                        </div>
                    </div>

                </form>
            </div >
        )
    }
}