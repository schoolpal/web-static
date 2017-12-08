import React from 'react'
import {Redirect} from 'react-router-dom'
import './Login.css'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      username: '',
      password: '',
      submitLoading: 'none'
    };

    this.inputChange = this.inputChange.bind(this)
    this.login = this.login.bind(this)
  }

  componentDidMount() {
    window.mdc.textfield.MDCTextfield.attachTo(document.querySelector('#nameWrapper'));
    window.mdc.textfield.MDCTextfield.attachTo(document.querySelector('#pwdWrapper'));
    window.mdc.ripple.MDCRipple.attachTo(document.querySelector('#submit'));
  }

  inputChange(event) {
    const targetName = event.target.name;
    const value = event.target.value;

    if (targetName === 'name') {
      this.setState({username: value})
    } else {
      this.setState({password: value})
    }
  }

  login() {
    if (!this.form.checkValidity()) {
      return
    }

    this.setState({submitLoading: 'block'});

    const profile = {
      name: 'aa'
    };

    sessionStorage.setItem('isAuthenticated', true);
    sessionStorage.setItem('profile', JSON.stringify(profile));

    setTimeout(() => {
      this.setState({redirectToReferrer: true})
    }, 2000)
  }

  render() {
    const {classes} = this.props;
    const {from} = this.props.location.state || {from: {pathname: '/'}};

    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div className="app">
        <main>
          <div id="login">
            <div className="mdc-card">
              <div role="progressbar"
                   className={`mdc-linear-progress ${this.state.submitLoading === 'none' ? '' : 'mdc-linear-progress--indeterminate'}`}>
                <div className="mdc-linear-progress__buffering-dots"/>
                <div className="mdc-linear-progress__buffer"/>
                <div className="mdc-linear-progress__bar mdc-linear-progress__primary-bar"
                     style={{display: this.state.submitLoading}}>
                  <span className="mdc-linear-progress__bar-inner"/>
                </div>
                <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                  <span className="mdc-linear-progress__bar-inner"/>
                </div>
              </div>
              <section className="mdc-card__primary">
                <h1 className="mdc-card__title mdc-card__title--large">登录</h1>
                <h2 className="mdc-card__subtitle">使用您的 校客 帐号</h2>
              </section>
              <form className="mdc-card__supporting-text" ref={(dom) => {
                this.form = dom
              }}>
                <div id="nameWrapper" className="mdc-textfield mdc-textfield--upgraded">
                  <input id="name" name="name" type="text" className="mdc-textfield__input"
                         aria-controls="name-helptext" value={this.state.username} onChange={this.inputChange}
                         required/>
                  <label htmlFor="name" className="mdc-textfield__label">账号</label>
                  <div className="mdc-textfield__bottom-line"/>
                </div>
                <p id="name-helptext" className="mdc-textfield-helptext mdc-textfield-helptext--validation-msg"
                   aria-hidden="true">
                  Help Text (possibly validation message)
                </p>
                <div id="pwdWrapper" className="mdc-textfield mdc-textfield--upgraded">
                  <input id="pwd" name="pwd" type="password" className="mdc-textfield__input"
                         aria-controls="pwd-helptext" required/>
                  <label htmlFor="pwd" className="mdc-textfield__label">密码</label>
                  <div className="mdc-textfield__bottom-line"/>
                </div>
                <p id="pwd-helptext" className="mdc-textfield-helptext mdc-textfield-helptext--validation-msg"
                   aria-hidden="true">
                  Help Text (possibly validation message)
                </p>
              </form>
              <section className="mdc-card__actions">
                <button id="submit" className="mdc-button mdc-button--raised" onClick={this.login}>登录</button>
              </section>
            </div>
          </div>
        </main>
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
    )
  }
}

export default Login;