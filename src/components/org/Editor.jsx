import React from 'react';
import { Link } from 'react-router';
import NavBar from '../public/NavBar'
import AsideBar from '../public/AsideBar'
import OrgTree from '../public/OrgTree';
import subTitle from '../../utils/subTitle';
import { SaveButton, BackButton } from '../public/Button';
import { orgList, orgDetails, orgAdd, orgMod } from '../../utils/api';
import DialogTips from '../../utils/DialogTips';

//require('../../utils/city');

export default class Editor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orgList: [],
            selected: null,
        };
        this.selectOrg = this.selectOrg.bind(this);
        this.editorSubmit = this.editorSubmit.bind(this);
    }

    componentDidMount() {
        const dialogTips = DialogTips({ type: 'loading' })

        dialogTips.open()

        require.ensure(["../../utils/city"], (require) => {
            require('../../utils/city');

            if (this.props.params.id === 'create') {
                orgList()
                    .done((data) => {
                        if (this.props.router.location.state && this.props.router.location.state.selected) {
                            this.setState({
                                orgList: data.tree,
                                selected: {
                                    id: this.props.router.location.state.selected.id,
                                    name: this.props.router.location.state.selected.name
                                }
                            })
                        } else {
                            this.setState({
                                orgList: data.tree,
                                selected: {
                                    id: data.tree[0].cId,
                                    name: data.tree[0].cName
                                }
                            })
                        }
                    })
                    .always(() => {
                        dialogTips.close()
                    })

                $('#citys').citys();
            } else {
                $.when(
                    orgList(),
                    orgDetails(this.props.params.id)
                ).done((list, details) => {
                    const curOrg = list.original.find((item) => { return item.cId === details.cParentId });

                    this.setState({
                        editorId: details.cId,
                        orgList: list.tree,
                        selected: {
                            id: curOrg.cId,
                            name: curOrg.cName
                        }
                    })

                    $(this.editorDom)
                        .find('[name=name]')
                        .val(details.cName)
                        .end()
                        .find('[name=code]')
                        .val(details.cCode)
                        .end()
                        .find('[name=address]')
                        .val(details.cAddress)
                        .end()
                        .find('[name=owner]')
                        .val(details.cOwner)
                        .end()
                        .find('[name=phone]')
                        .val(details.cOwnerPhone)

                    $('#citys').citys({
                        province: details.cStateCode,
                        city: details.cCityCode,
                        area: details.cCountyCode || null
                    });
                }).always(() => {
                    dialogTips.close()
                })
            }
        }, 'city')
    }

    selectOrg(org) {
        if (org) {
            this.setState({
                selected: org
            })
        }
    }

    editorSubmit(event) {
        if (this.editorDom.checkValidity() === true) {
            event.preventDefault()
        };

        const successPath = SCHOOLPAL_CONFIG.ROOTPATH + 'sys/org';
        const loading = DialogTips({ type: 'loading' })
        const success = DialogTips({ type: 'success' })
        const fail = DialogTips({ type: 'fail', autoClose: true })
        let param = {};

        $(this.editorDom).serializeArray().map((item) => {
            param[item.name] = item.value;
        })

        param.parentId = this.state.selected.id;
        param.state = $('#citys').find('[name="stateCode"]').find("option:selected").text();
        param.city = $('#citys').find('[name="cityCode"]').find("option:selected").text();
        param.county = $('#citys').find('[name="countyCode"]').find("option:selected").text();

        loading.open()

        if (this.state.editorId) {
            param.id = this.state.editorId;

            orgMod(param)
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
            orgAdd(param)
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
            <div className="org">
                <form ref={(dom) => { this.editorDom = dom }} onSubmit={this.editorSubmit}>

                    <h5>
                        <i className="fa fa-sitemap" aria-hidden="true"></i>&nbsp;组织管理&nbsp;&nbsp;|&nbsp;&nbsp;<p className="d-inline text-muted">{subTitle(this.props.router.params.id, '组织')}</p>
                        <div className="btn-group float-right" role="group">
                            <BackButton router={this.props.router} />
                            <SaveButton text="保存" />
                        </div>
                    </h5>

                    <div className="main-container">
                        <div className="d-flex align-items-stretch flex-nowrap">
                            <div className="w400">
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>组织名称</label>
                                    <input type="text" className="form-control" name="name" required="required" />
                                </div>
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>组织代码</label>
                                    <input type="text" className="form-control" name="code" required="required" />
                                </div>
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>父级组织：</label>
                                    <div className="form-group">
                                        <div className="btn-group btn-block">
                                            <input type="text" className="form-control" data-toggle="dropdown" value={this.state.selected ? this.state.selected.name : ''} readOnly />
                                            <div className="dropdown-menu">
                                                <OrgTree data={this.state.orgList} selected={this.selectOrg} defaults={this.state.selected ? this.state.selected.id : null} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>所在地区</label>
                                    <div id="citys" className="row">
                                        <div className="col">
                                            <select name="stateCode" className="form-control"></select>
                                        </div>
                                        <div className="col">
                                            <select name="cityCode" className="form-control"></select>
                                        </div>
                                        <div className="col">
                                            <select name="countyCode" className="form-control"></select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>详细地址</label>
                                    <textarea name="address" className="form-control" rows="3" required="required"></textarea>
                                </div>
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>负责人</label>
                                    <input type="text" className="form-control" name="owner" required="required" />
                                </div>
                                <div className="form-group">
                                    <label for="name"><em className="text-danger">*</em>联系电话</label>
                                    <input type="text" className="form-control" name="phone" pattern="^1\d{10}$" required="required" />
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        )
    }
}