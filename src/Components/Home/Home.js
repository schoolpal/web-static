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
import NoMatch from "../NoMatch/NoMatch";
import DialogTips from "../Dialog/DialogTips";

import ajax from "../../utils/ajax";
import profileProcess from "../../utils/profileProcess";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {profile: null, redirectToReferrer: false};
    this.createDialogTips = this.createDialogTips.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let profile = await ajax('/user/profile.do');
        this.setState({profile: profileProcess(profile)});
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

    return (
      <div className="container-fluid">
        <Drawer
          menu={this.state.profile.menu}
          hasChangeGroupBtn={this.state.profile.hasChangeGroupBtn}
        />

        <main>
          <Header profile={this.state.profile.profile}/>

          <Switch>
            <Route
              exact
              path={this.props.match.url}
              render={() => (<div/>)}
            />
            <PrivateRoute
              path="/groups"
              access={this.state.profile.access}
              profile={this.state.profile.profile}
              commands={this.state.profile.commands}
              component={Group}
            />
            <PrivateRoute
              path="/roles"
              access={this.state.profile.access}
              profile={this.state.profile.profile}
              commands={this.state.profile.commands}
              component={Roles}
            />
            <PrivateRoute
              path="/permissions"
              access={this.state.profile.access}
              profile={this.state.profile.profile}
              commands={this.state.profile.commands}
              component={Permissions}
            />
            <PrivateRoute
              path="/users"
              access={this.state.profile.access}
              profile={this.state.profile.profile}
              commands={this.state.profile.commands}
              component={User}
            />
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
