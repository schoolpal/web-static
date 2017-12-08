import React from 'react'
import {Route, Redirect} from 'react-router-dom'

const PrivateRoute = ({component: Component, ...rest}) => {
  const temp = {...rest}
  const access = temp.access.filter((item) => {
    return item.test(temp.path) === true;
  })

  console.log("PrivateRoute visit path is " + temp.path)

  return (
    <Route {...rest} render={props => (
      access.length ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: {from: props.location}
        }}/>
      )
    )}/>
  )
};

export default PrivateRoute;