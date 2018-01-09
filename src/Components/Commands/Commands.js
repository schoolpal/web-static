import React from "react";

const Add = ({action}) => (
  <button onClick={action} type="button" className="btn btn-primary">
    <i className="fa fa-plus" aria-hidden="true"/>&nbsp;&nbsp;新建
  </button>
);

const Mod = ({action}) => (
  <button onClick={action} type="button" className="btn btn-primary">
    <i className="fa fa-pencil" aria-hidden="true"/>&nbsp;&nbsp;编辑
  </button>
);

const Del = ({action}) => (
  <button type="button" className="btn btn-danger" onClick={action}>
    <i className="fa fa-trash-o" aria-hidden="true"/>&nbsp;&nbsp;删除
  </button>
);

const Auth = ({action}) => (
  <button onClick={action} className="btn btn-danger">
    <i className="fa fa-shield" aria-hidden="true"/>&nbsp;&nbsp;授权
  </button>
);

const Defaults = ({text, action}) => (
  <button onClick={action} type="button" className="btn btn-primary">
    {text}
  </button>
);

class Commands extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="btn-group float-right" role="group">
        {
          this.props.commands.map((command, index) => {
            switch (command) {
              case "Add":
                return <Add key={index} action={this.props.addAction}/>;
              case "Mod":
                return <Mod key={index} action={this.props.modAction}/>;
              case "Del":
                return <Del key={index} action={this.props.delAction}/>;
              case "Auth":
                return <Auth key={index} action={this.props.authAction}/>;
              case 'Assign':
                return <Defaults key={index} action={this.props.assignAction} text="分配给"/>;
              case 'Convert':
                return <Defaults key={index} action={this.props.convertAction} text="转化为"/>;
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