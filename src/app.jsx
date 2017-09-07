window.SCHOOLPAL_CONFIG = {
    ROOTPATH: '/web/html/',
    AJAXPATH: '/web/ajax/',

    SESSION_STORAGE_KYENAME: 'user',

    XHR_DONE: 'XHR_DONE',
    XHR_BUSINESS_ERROR: 'XHR_BUSINESS_ERROR',
    XHR_ERROR: 'XHR_ERROR',

    AUTH_DIC: {
        '1-1': { PATH: 'crm/market/activity', PATH_RULE: /^crm\/market\/activity(\/\w+)?(\/)?$/, ICON: 'fa-pie-chart' },
        '1-1-1': { PATH_RULE: /^crm\/market\/activity\/edit\/create(\/)?$/ },
        '1-1-2': { PATH_RULE: /^crm\/market\/activity\/edit\/\w+(\/)?$/ },

        '1-2': { PATH: 'crm/market/leads', PATH_RULE: /^crm\/market\/leads(\/\w+)?(\/)?$/, ICON: 'fa-bar-chart' },
        '1-2-1': { PATH_RULE: /^crm\/market\/leads\/edit\/create(\/)?$/ },
        '1-2-2': { PATH_RULE: /^crm\/market\/leads\/edit\/\w+(\/)?$/ },

        '2-1': { PATH: 'crm/sales/oppor', PATH_RULE: /^crm\/sales\/oppor(\/\w+)?(\/)?$/, ICON: 'fa-filter' },
        '2-1-1': { PATH_RULE: /^crm\/sales\/oppor\/edit\/create(\/)?$/ },
        '2-1-2': { PATH_RULE: /^crm\/sales\/oppor\/edit\/\w+(\/)?$/ },

        '2-2': { PATH: 'crm/sales/contract', PATH_RULE: /^crm\/sales\/contract(\/\w+)?(\/)?$/, ICON: 'fa-filter' },
        '2-1-1': { PATH_RULE: /^crm\/sales\/contract\/edit\/create\/\w+(\/)?$/ },
        '2-1-2': { PATH_RULE: /^crm\/sales\/contract\/edit\/\w+(\/)?$/ },

        '7-1': { PATH: 'sys/org', PATH_RULE: /^sys\/org(\/)?$/, ICON: 'fa-sitemap' },
        '7-1-1': { PATH_RULE: /^sys\/org\/create(\/)?$/ },
        '7-1-2': { PATH_RULE: /^sys\/org\/\w+(\/)?$/ },

        '7-2': { PATH: 'sys/role', PATH_RULE: /^sys\/role(\/)?$/, ICON: 'fa-users' },
        '7-2-1': { PATH_RULE: /^sys\/role\/\w+\/create(\/)?$/ },
        '7-2-2': { PATH_RULE: /^sys\/role\/\w+\/\w+(\/)?$/ },

        '7-3': { PATH: 'sys/auth', PATH_RULE: /^sys\/auth(\/)?$/, ICON: 'fa-shield' },

        '7-4': { PATH: 'sys/user', PATH_RULE: /^sys\/user(\/)?$/, ICON: 'fa-user' },
        '7-4-1': { PATH_RULE: /^sys\/user\/\w+\/create(\/)?$/ },
        '7-4-2': { PATH_RULE: /^sys\/user\/\w+\/\w+(\/)?$/ },
    }
};

import { $ } from './utils/vendor';

require('bootstrap/dist/css/bootstrap.min.css');
require('./font/css/font-awesome.css');
require('./less/bundle.less');
require('bootstrap/dist/js/bootstrap');

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import Dashboard from './components/Dashboard'

import App from './components/App'
import Sys from './components/Sys'
import Crm from './components/Crm'

import MarketActivityList from './components/market/activity/List'
import MarketActivityEditor from './components/market/activity/Editor'
import MarketActivityView from './components/market/activity/View'
import MarketLeadstList from './components/market/leads/List'
import MarketLeadsEditor from './components/market/leads/Editor'
import MarketLeadsView from './components/market/leads/View'

import SalesOpporList from './components/sales/oppor/List'
import SalesOpporEditor from './components/sales/oppor/Editor'
import SalesOpporView from './components/sales/oppor/View'
import SalesContractList from './components/sales/contract/List'
import SalesContractEditor from './components/sales/contract/Editor'
import SalesContractView from './components/sales/contract/View'
import SalesStudentList from './components/sales/student/List'
import SalesStudentView from './components/sales/student/View'

import OrgList from './components/org/List';
import OrgEditor from './components/org/Editor';
import RoleList from './components/role/List';
import RoleEditor from './components/role/Editor';
import AuthList from './components/auth/List';
import UserList from './components/user/List';
import UserEditor from './components/user/Editor';

import Login from './components/Login';
import Error from './components/Error';

import checkAuth from './utils/checkAuth';

class WxSpread extends React.Component {
    componentDidMount() {
        const url = '//mp.weixin.qq.com/s?__biz=MzU1NjA0MDU3MA==&tempkey=%2FVColhIPW3bS1mNK8dgX2jhgO3QlL5crR5XlH29MpibwHGxYI0PFtopu5pDrq6JYjxt9kCJelORcvfSWM8iW5nd8YN3C1foKAM1Bjd32b%2B9ECHH46i9NCpakFkzYIV6PY4YPsiX5r5lu0nWx4koGxg%3D%3D&chksm=7bca69164cbde00092484585196ad931590f2c7a7bedea5cc3e22ef023c8ae88153387442167##'

        window.location.replace(url)
    }

    render() {
        return <p>{this.props.params.id}</p>
    }
}

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path={SCHOOLPAL_CONFIG.ROOTPATH + 'login'} component={Login} />
        <Route path={SCHOOLPAL_CONFIG.ROOTPATH + 'wx/:id'} component={WxSpread} />

        <Route path={SCHOOLPAL_CONFIG.ROOTPATH} component={App}>

            <Route path="sys" component={Sys} onEnter={checkAuth} onChange={checkAuth}>
                <Route path="org" component={OrgList} />
                <Route path="org/:id" component={OrgEditor} />
                <Route path="role" component={RoleList} />
                <Route path="role/:oid/:rid" component={RoleEditor} />
                <Route path="auth" component={AuthList} />
                <Route path="user" component={UserList} />
                <Route path="user/:oid/:uid" component={UserEditor} />
            </Route>

            <Route path={'crm'} component={Crm}>
                <Route path="market/activity" component={MarketActivityList} />
                <Route path="market/activity/:id" component={MarketActivityView} />
                <Route path="market/activity/edit/:id" component={MarketActivityEditor} />

                <Route path="market/leads" component={MarketLeadstList} />
                <Route path="market/leads/:id" component={MarketLeadsView} />
                <Route path="market/leads/edit/:id" component={MarketLeadsEditor} />

                <Route path="sales/oppor" component={SalesOpporList} />
                <Route path="sales/oppor/:id" component={SalesOpporView} />
                <Route path="sales/oppor/edit/:id" component={SalesOpporEditor} />

                <Route path="sales/contract" component={SalesContractList} />
                <Route path="sales/contract/:id" component={SalesContractView} />
                <Route path="sales/contract/edit/:id(/:opporid)" component={SalesContractEditor} />

                <Route path="sales/student" component={SalesStudentList} />
                <Route path="sales/student/:id" component={SalesStudentView} />
            </Route>

            <Route path='*' component={Error} />
        </Route>
    </Router>
), document.querySelector('#app'));
