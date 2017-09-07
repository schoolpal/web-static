import React from 'react';
import ContactList from '../contact/List'
import { SaveButton, BackButton } from '../public/Button';
import DialogTips from '../../utils/DialogTips';
import { GRADE, COURSE_CATEGORY, COURSE_PRODUCTS, TYPE_ID } from '../../utils/static'
import changeText from '../../utils/changeText'

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

export default class LeadsFrom extends React.Component {
    constructor(props) {
        super(props)

        this.editorSubmit = this.editorSubmit.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.linkedId !== 'create' && nextProps.data) {
            $(this.editorDom).find('[name=studentName]').val(nextProps.data.student.name)
            $(this.editorDom).find('[name=age]').val(nextProps.data.student.age)
            $(this.editorDom).find('[name=schoolName]').val(nextProps.data.student.schoolName)
            $(this.editorDom).find('[name=parentName]').val(nextProps.data.parent.name)
            $(this.editorDom).find('[name=cellphone]').val(nextProps.data.parent.cellphone)
            $(this.editorDom).find('[name=weichat]').val(nextProps.data.parent.weichat)
            $(this.editorDom).find('[name=address]').val(nextProps.data.parent.address)

            $(this.editorDom).find('textarea, select').each(function () {
                const name = $(this).attr('name');

                switch (name) {
                    case 'classGrade':
                        $(this).val(nextProps.data.student.classGrade)
                        break;
                    case 'studentGender':
                        $(this).val(nextProps.data.student.genderText)
                        break;
                    case 'relation':
                        $(this).val(nextProps.data.parent.relation)
                        break;
                    default:
                        $(this).val(nextProps.data[name])
                }

                if (name === 'channelId') {
                    $(this).siblings('button').find('span').text(nextProps.data.channelName)
                }
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

        let param = {};

        $(this.editorDom).serializeArray().map((item) => {
            param[item.name] = item.value;
        })

        this.props.submit(param)
    }

    renderType(props) {
        if (props.type === 'oppor') {
            return (
                <li className="d-flex">
                    <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>类型</label>
                    <div className="flex-cell">
                        <select name="typeId" className="form-control" readOnly={true}>
                            <option value={props.typeId}>{TYPE_ID[props.typeId]}</option>
                        </select>
                    </div>
                </li>
            )
        } else {
            return null
        }
    }

    render() {
        return (
            <form ref={(dom) => { this.editorDom = dom }} onSubmit={this.editorSubmit}>

                <h5>
                    <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;{this.props.title}&nbsp;&nbsp;|&nbsp;&nbsp;<p className="d-inline text-muted">{this.props.subTitle}</p>
                    <div className="btn-group float-right mr-4" role="group">
                        <BackButton router={this.props.router} />
                        <SaveButton text="保存" />
                    </div>
                </h5>

                <div className="main-container">
                    <p className="ht pb-3 b-b">{this.props.type.desc}信息</p>
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
                                            {renderObjectOption(this.props.option ? this.props.option.gender : [])}
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
                                            {renderObjectOption(this.props.option ? this.props.option.relation : [])}
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
                    <p className="ht pt-3 pb-3 b-t b-b">{this.props.type.desc}进程</p>
                    <div className="row">
                        <div className="col">
                            <ul>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>信息来源</label>
                                    <div className="flex-cell">
                                        <select name="sourceId" className="form-control" onChange={(event) => { event.target.setCustomValidity('') }} required={true}>
                                            <option key="null" value="null">请选择</option>
                                            {renderNormalOption(this.props.option ? this.props.option.sources : [])}
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
                                                {renderListOption(this.props.option ? this.props.option.act : [])}
                                            </select>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col">
                            <ul>
                                {
                                    this.renderType(this.props.type)
                                }
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>阶段</label>
                                    <div className="flex-cell">
                                        <select name="stageId" className="form-control" onChange={(event) => { event.target.setCustomValidity('') }} required={true}>
                                            <option key="null" value="null">请选择</option>
                                            {renderNormalOption(this.props.option ? this.props.option.stages : [])}
                                        </select>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <label for="name" className="col-form-label d-block w100"><em className="text-danger">*</em>状态</label>
                                    <div className="flex-cell">
                                        <select name="statusId" className="form-control" onChange={(event) => { event.target.setCustomValidity('') }} required={true}>
                                            <option key="null" value="null">请选择</option>
                                            {renderNormalOption(this.props.option ? this.props.option.status : [])}
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
                    <ContactList canEditd={true} leadsId={this.props.linkedId} />
                </div>

            </form>
        )
    }
}