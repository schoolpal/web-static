import React from "react";

const Add = ({action}) => (
  <button onClick={action} className="button button--icon js-button">
    <i className="fa fa-plus" aria-hidden="true"/>
  </button>
)

const Mod = ({action}) => (
  <button onClick={action} className="button button--icon js-button">
    <i className="fa fa-pencil" aria-hidden="true"/>
  </button>
)

const Del = ({action}) => (
  <button onClick={action} className="button button--icon js-button">
    <i className="fa fa-trash-o" aria-hidden="true"/>
  </button>
)

const Auth = ({action, disabled}) => (
  <button onClick={action} className="button button--primary js-button" disabled={disabled}>
    授权
  </button>
)

class Commands extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {
          this.props.commands.map((command, index) => {
            switch (command) {
              case "Add":
                return <Add key={index} action={this.props.addAction}/>
                break;
              case "Mod":
                return <Mod key={index} action={this.props.modAction}/>
                break;
              case "Del":
                return <Del key={index} action={this.props.delAction}/>
                break;
              case "Auth":
                return <Auth key={index} action={this.props.authAction} disabled={this.props.disabled}/>
                break
              default:
                return null;
            }
          })
        }
      </div>
    )
  }
}

export default Commands;