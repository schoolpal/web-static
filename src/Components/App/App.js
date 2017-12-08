import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "../Home/Home";
import Drawer from "../Drawer/Drawer";
import GroupList from "../Group/List";

import getProfile from "../../api/getProfile";
import profileProcess from "../../utils/profileProcess";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { profile: null };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ profile: getProfile().data });
    }, 500);
  }
  componentDidUpdate() {
    window.componentHandler.upgradeAllRegistered();
  }
  render() {
    if (this.state.profile) {
      return (
        <Router>
          <div className="layout">
            <Drawer
              menu={profileProcess(this.state.profile).menu}
              hasChangeGroupBtn={
                profileProcess(this.state.profile).hasChangeGroupBtn
              }
            />

            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/groups" component={GroupList} />
            </Switch>
          </div>
        </Router>
      );
    } else {
      return <p>程序初始化中...</p>;
    }
  }
}

export default App;
