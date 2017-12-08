import React from "react";
import {Route, Switch} from 'react-router-dom'

import PrivateRoute from '../PrivateRoute/PrivateRoute'
import Drawer from "../Drawer/Drawer";
import GroupList from "../Group/List";
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

  componentDidUpdate() {
    window.componentHandler.upgradeAllRegistered();
  }

  render() {
    if (this.state.profile) {
      return (
        <div className="layout">
          <Drawer
            menu={this.state.profile.menu}
            hasChangeGroupBtn={this.state.profile.hasChangeGroupBtn}
          />

          <Switch>
            <Route
              exact
              path={this.props.match.url}
              render={() => (<div className="layout__container"></div>)}
            />
            <PrivateRoute path="/groups" access={this.state.profile.access} component={GroupList}/>
            <Route component={NoMatch}/>
          </Switch>
        </div>
      )
    } else {
      return <p>程序准备中...</p>;
    }
  }
}

export default Home;
