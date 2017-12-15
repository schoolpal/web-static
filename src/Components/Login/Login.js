import React from 'react'
import {Redirect} from 'react-router-dom'
import './Login.css'

import Progress from "../Progress/Progress"
import MD5Mixed from "../../utils/MD5Mixed"

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

  login() {
    if (!this.form.checkValidity()) {
      return
    }

    this.setState({isAnimating: true})

    const userName = this.form.userName.value;
    const userPwd = this.form.userPwd.value;
    let mixedPWD;

    this.setState({submitLoading: 'block'});
    const salt = "";

    mixedPWD = MD5Mixed(MD5Mixed(MD5Mixed(userPwd)) + salt);

    //login

    setTimeout(() => {
      this.setState({redirectToReferrer: true, isAnimating: false});
    }, 3000)
  }

  render() {
    const {from} = this.props.location.state || {from: {pathname: '/'}};

    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div className="layout">
        <div className="layout__container">
          <div className="login">
            <div className="content">
              <div className="body">
                <Progress isAnimating={this.state.isAnimating}/>

                <div className="logo">
                  <img src="http://www.risecenter.com/images/index/rise_logo.png"/>
                </div>

                <div className="body-text">
                  <p>使用您的 校客 帐号</p>
                </div>

                <div className="body-form">
                  <div className="body-form-container">
                    <form ref={(dom) => {
                      this.form = dom
                    }}>
                      <div className="row">
                        <div className="textfield textfield--floating-label js-textfield">
                          <input name="userName" className="textfield__input" type="text" required={true}/>
                          <label className="textfield__label" htmlFor="userName">
                            用户名...
                          </label>
                          <span className="textfield__error">此项为必填!</span>
                        </div>
                        <div className="textfield textfield--floating-label js-textfield">
                          <input name="userPwd" className="textfield__input" type="password" required={true}/>
                          <label className="textfield__label" htmlFor="userPwd">
                            密码...
                          </label>
                          <span className="textfield__error">此项为必填!</span>
                        </div>
                      </div>
                    </form>
                    <div className="body-form-action">
                      <button
                        className="button button--raised button--primary js-button"
                        onClick={this.login}
                      >
                        登 录
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 810" preserveAspectRatio="xMinYMin slice"
                   aria-hidden="true">
                <path fill="#efefee"
                      d="M592.66 0c-15 64.092-30.7 125.285-46.598 183.777C634.056 325.56 748.348 550.932 819.642 809.5h419.672C1184.518 593.727 1083.124 290.064 902.637 0H592.66z"></path>
                <path fill="#f6f6f6"
                      d="M545.962 183.777c-53.796 196.576-111.592 361.156-163.49 490.74 11.7 44.494 22.8 89.49 33.1 134.883h404.07c-71.294-258.468-185.586-483.84-273.68-625.623z"></path>
                <path fill="#f7f7f7"
                      d="M153.89 0c74.094 180.678 161.088 417.448 228.483 674.517C449.67 506.337 527.063 279.465 592.56 0H153.89z"></path>
                <path fill="#fbfbfc" d="M153.89 0H0v809.5h415.57C345.477 500.938 240.884 211.874 153.89 0z"></path>
                <path fill="#ebebec"
                      d="M1144.22 501.538c52.596-134.583 101.492-290.964 134.09-463.343 1.2-6.1 2.3-12.298 3.4-18.497 0-.2.1-.4.1-.6 1.1-6.3 2.3-12.7 3.4-19.098H902.536c105.293 169.28 183.688 343.158 241.684 501.638v-.1z"></path>
                <path fill="#e1e1e1"
                      d="M1285.31 0c-2.2 12.798-4.5 25.597-6.9 38.195C1321.507 86.39 1379.603 158.98 1440 257.168V0h-154.69z"></path>
                <path fill="#e7e7e7"
                      d="M1278.31,38.196C1245.81,209.874 1197.22,365.556 1144.82,499.838L1144.82,503.638C1185.82,615.924 1216.41,720.211 1239.11,809.6L1439.7,810L1439.7,256.768C1379.4,158.78 1321.41,86.288 1278.31,38.195L1278.31,38.196z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;