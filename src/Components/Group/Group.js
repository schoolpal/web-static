import React from 'react'
import {Route, Switch} from 'react-router-dom'
import List from './List'
import Create from './Create'
import Details from './Details'

class Group extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Switch>
        <Route path={`${this.props.match.url}/create`} component={Create}/>
        <Route path={`${this.props.match.url}/:groupId`} component={Details}/>
        <Route path={this.props.match.url} component={List}/>
      </Switch>
    )
  }
}

export default Group;