import React from "react";
import ReactDOM from "react-dom";
import {Route, Switch, Redirect} from 'react-router-dom'

import PrivateRoute from '../PrivateRoute/PrivateRoute'
import Drawer from "../Drawer/Drawer";
import Header from "../Header/Header";
import Group from "../Group/Group";
import Roles from "../Roles/Roles";
import Permissions from "../Permissions/Permissions";
import User from "../User/User"
import Act from '../Mkt/Act/Act';
import Leads from '../Mkt/Leads/Leads';
import Appor from '../Sales/Appor/Appor';
import Contract from '../Sales/Contract/Contract';
import Student from '../Sales/Student/Student';
import NoMatch from "../NoMatch/NoMatch";
import DialogTips from "../Dialog/DialogTips";

import ajax from "../../utils/ajax";
import profileProcess from "../../utils/profileProcess";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: null,
      group: null,
      redirectToReferrer: false
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.changedCrmGroup = this.changedCrmGroup.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let profile = await ajax('/user/profile.do');
        const fmtProfile = profileProcess(profile);
        console.log(fmtProfile)
        this.setState({
          profile: fmtProfile,
          group: {
            id: fmtProfile.profile.org.cId,
            name: fmtProfile.profile.org.cName
          }
        });
      } catch (err) {
        if (err.errCode === 401) {
          this.setState({redirectToReferrer: true})
        } else {
          this.createDialogTips(`${err.errCode}: ${err.errText}`);
        }
      }
    };

    request();
  }

  createDialogTips(text) {
    if (this.tips === undefined) {
      this.tipsContainer = document.createElement('div');

      ReactDOM.render(
        <DialogTips
          accept={this.logout}
          title="提示"
          text={text}
          ref={(dom) => {
            this.tips = dom
          }}
        />,
        document.body.appendChild(this.tipsContainer)
      );
    } else {
      this.tips.setText(text);
    }

    this.tips.dialog.modal('show');
  }

  changedCrmGroup(group) {
    this.setState({group});
  }

  render() {
    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={{
          pathname: '/login',
          state: {from: this.props.location}
        }}/>
      )
    }

    if (!this.state.profile) {
      return (
        <div className="container-fluid">
          <p className="p-2">程序准备中...</p>
        </div>
      );
    }

    const query = {
      access: this.state.profile.access,
      profile: this.state.profile.profile,
      commands: this.state.profile.commands
    };

    return (
      <div className="container-fluid">
        <Drawer
          profile={this.state.profile.profile}
          menu={this.state.profile.menu}
          hasChangeGroupBtn={this.state.profile.hasChangeGroupBtn}
          changed={this.changedCrmGroup}
        />

        <main>
          <Header profile={this.state.profile.profile}/>

          <Switch>
            <Route
              exact
              path={this.props.match.url}
              render={() => (<div/>)}
            />
            <PrivateRoute path="/groups" component={Group}{...query}/>
            <PrivateRoute path="/roles" component={Roles}{...query}/>
            <PrivateRoute path="/permissions" component={Permissions}{...query}/>
            <PrivateRoute path="/users" component={User}{...query}/>
            <PrivateRoute path="/mkt/act" changedCrmGroup={this.state.group} component={Act}{...query}/>
            <PrivateRoute path="/mkt/leads" changedCrmGroup={this.state.group} component={Leads}{...query}/>
            <PrivateRoute path="/sales/oppor" changedCrmGroup={this.state.group} component={Appor}{...query}/>
            <PrivateRoute path="/sales/contract" changedCrmGroup={this.state.group} component={Contract}{...query}/>
            <PrivateRoute path="/sales/student" changedCrmGroup={this.state.group} component={Student}{...query}/>
            <Route render={(props) => (
              <NoMatch {...props} profile={this.state.profile.profile}/>
            )}/>
          </Switch>
        </main>
      </div>
    )
  }
}

export default Home;
