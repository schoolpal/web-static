import React from 'react'
import {Route, Switch, Link} from 'react-router-dom'
import Editor from './Editor';

class Details extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Switch>
        <Route path={`${this.props.match.url}/editor`} render={() => (
          <Editor groupId={this.props.match.params.groupId}/>
        )}/>
        <Route path={this.props.match.url} render={() => (
          <div>
            <h3>Details</h3>
            <Link to={`${this.props.match.url}/editor`}>Editor Id is {this.props.match.params.groupId}</Link>
          </div>
        )}/>
      </Switch>
    )
  }
}

export default Details;