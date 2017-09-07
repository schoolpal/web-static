import React from 'react'
import NavBar from './public/NavBar'
import AsideBar from './public/AsideBar'
import OrgTree from './public/OrgTree'
import DialogTips from '../utils/DialogTips'
import { orgList } from '../utils/api'
import errorHandle from '../utils/errorHandle'

export default class Crm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            path: props.route.path,
            org: null,
            orgList: [],
            orgPanel: false
        }
        this.toggleOrgPanel = this.toggleOrgPanel.bind(this)
        this.selectOrg = this.selectOrg.bind(this)
    }

    componentWillMount() {
        const dialogTips = DialogTips({ type: 'loading' })

        dialogTips.open()

        orgList()
            .done((org) => {
                const oid = org.original[0].cId;
                const oname = org.original[0].cName;

                this.setState({
                    orgList: org.tree,
                    org: {
                        id: oid,
                        name: oname
                    }
                })
            })
            .fail((data) => { errorHandle({ data: data, router: this.props.router }) })
            .always(() => { dialogTips.close() })
    }

    toggleOrgPanel() {
        this.setState({
            orgPanel: !this.state.orgPanel
        })
    }

    selectOrg(org) {
        if (org) {
            this.setState({ org: org })
        }
    }

    render() {
        return (
            <div>
                <NavBar router={this.props.router} isSignin={true} />
                <AsideBar hasChangeTree={true} toggleOrgPanel={this.toggleOrgPanel} router={this.props.router} />
                <div className="main">
                    {
                        this.props.children && React.cloneElement(this.props.children, { org: this.state.org, path: this.state.path })
                    }
                </div>
                <div onClick={this.toggleOrgPanel} className={this.state.orgPanel === true ? 'org-panel' : 'hide'}>
                    <div onClick={(event) => { event.stopPropagation() }} className="org-oanel-content">
                        <OrgTree data={this.state.orgList} selected={this.selectOrg} defaults={this.state.org ? this.state.org.id : null} />
                    </div>
                </div>
            </div>
        )
    }
}