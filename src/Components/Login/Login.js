import React from 'react'
import {Redirect} from 'react-router-dom'
import './Login.css'

import Progress from "../Progress/Progress"
import MD5Mixed from "../../utils/MD5Mixed"
import nodeListToArray from "../../utils/nodeListToArray"

import getSalt from "../../api/getSalt"

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAnimating: false,
      redirectToReferrer: false,
    };
    this.login = this.login.bind(this);
  }

  componentDidMount() {

  }

  login(evt) {
    if (this.form.checkValidity()) {
      evt.preventDefault()
    }

    this.setState({isAnimating: true})

    const userName = this.form.userName.value;
    const userPwd = this.form.userPwd.value;
    let mixedPWD;

    this.setState({submitLoading: 'block'});
    const salt = "";

    mixedPWD = MD5Mixed(MD5Mixed(MD5Mixed(userPwd)) + salt);

    //login
    //
    // let ajax = async () => {
    //   try {
    //     let result = await getSalt();
    //
    //     this.setState({redirectToReferrer: true, isAnimating: false});
    //   } catch (err) {
    //     console.log(err)
    //
    //     this.form.userName.parentNode["Textfield"].change("");
    //     this.form.userPwd.parentNode["Textfield"].change("");
    //     this.setState({isAnimating: false});
    //   }
    // }
    //
    // ajax();
  }

  render() {
    const {from} = this.props.location.state || {from: {pathname: '/'}};

    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div className="container-fluid">
        <div className="login">
          <div className="card border-0">
            <div className="card-body">
              <h4 className="card-title">登陆校客系统</h4>
              <form
                ref={(dom) => {
                  this.form = dom
                }}
                onSubmit={this.login}
              >
                <div className="form-group">
                  <label htmlFor="userName">用户名</label>
                  <input type="text" className="form-control" id="userName" placeholder="Enter user name"
                         required={true}/>
                  <small className="form-text text-muted">&nbsp;</small>
                </div>
                <div className="form-group">
                  <label htmlFor="userPwd">密码</label>
                  <input type="text" className="form-control" id="userPwd" placeholder="Enter user password"
                         required={true}/>
                  <small className="form-text text-muted">&nbsp;</small>
                </div>
                <button type="submit" className="btn btn-primary float-right">登&nbsp;&nbsp;陆</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;