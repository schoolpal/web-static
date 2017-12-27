import React from "react";
import {Route, Switch} from 'react-router-dom'

import PrivateRoute from '../PrivateRoute/PrivateRoute'
import Drawer from "../Drawer/Drawer";
import Header from "../Header/Header";
import Group from "../Group/Group";
import Roles from "../Roles/Roles";
import Permissions from "../Permissions/Permissions";
import User from "../User/User"
import NoMatch from "../NoMatch/NoMatch";

import getProfile from "../../api/getProfile";
import profileProcess from "../../utils/profileProcess";

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {profile: null};
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({profile: profileProcess(getProfile().data)});
    }, 500);
  }

  componentDidUpdate(){

  }

  render() {
    if (this.state.profile) {
      return (
        <div className="container-fluid">
          {/*<Drawer*/}
            {/*menu={this.state.profile.menu}*/}
            {/*hasChangeGroupBtn={this.state.profile.hasChangeGroupBtn}*/}
          {/*/>*/}

          <Switch>
            <Route
              exact
              path={this.props.match.url}
              render={() => (
                <Header title="" profile={this.state.profile.profile}/>
              )}
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
        </div>
      )
    } else {
      return (
        <div className="layout">
          <div className="layout__container">
            <header className="toolbar">
              <div className="toolbar__row"></div>
            </header>
            <main>
              <p>程序准备中...</p>
            </main>
          </div>
        </div>
      );
    }
  }
}

export default Home;
