import React from 'react'
import {Route, Switch} from 'react-router-dom'

import List from './List'
// import Create from './Create'
import View from './View';
// import Editor from "./Editor";

const Student = ({commands, location, match, profile, changedCrmGroup}) => {
  const groupCommands = commands.find((item) => {
    return item.rule.test(location.pathname) === true
  });

  groupCommands.commands = [...new Set(groupCommands.commands)];

  return (
    <Switch>
      {/*<Route path={`${match.url}/create`} render={(props) => (*/}
      {/*<Create {...props} profile={profile} changedCrmGroup={changedCrmGroup}/>*/}
      {/*)}/>*/}
      {/*<Route path={`${match.url}/:contractId/edit`} render={(props) => (*/}
      {/*<Editor {...props} profile={profile} changedCrmGroup={changedCrmGroup}/>*/}
      {/*)}/>*/}
      <Route path={`${match.url}/:studentId`} render={(props) => (
        <View key={props.match.params.studentId} {...props} profile={profile} commands={groupCommands.commands}
              changedCrmGroup={changedCrmGroup}/>
      )}/>
      <Route path={`${match.url}`} render={(props) => (
        <List {...props} profile={profile} commands={groupCommands.commands} changedCrmGroup={changedCrmGroup}/>
      )}/>
    </Switch>
  )
};

export default Student;