import React from "react";

class DialogTips extends React.Component {
  constructor(props){
    super(props)

    this.accept = this.accept.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount(){
    const dialogElem = document.getElementById("dialogTips");

    window.componentHandler.upgradeElement(dialogElem);
    this.dialog = dialogElem["Dialog"];
  }

  cancel(){
    this.dialog.hide()
  }

  accept(){
    this.props.accept();
    this.dialog.hide()
  }

  render(){
    return(
      <aside id="dialogTips" className="dialog js-dialog" role="alertdialog">
        <div className="dialog__surface">
          <header className="dialog__header">
            <h2 className="dialog__header__title">{this.props.title}</h2>
          </header>
          <section className="dialog__body">{this.props.text}</section>
          <footer className="dialog__footer">
            <button onClick={this.cancel} type="button"
                    className="button button--cancel dialog__footer__button--cancel">取消
            </button>
            <button onClick={this.accept} type="button"
                    className="button button--primary dialog__footer__button--accept">确认
            </button>
          </footer>
        </div>
        <div className="dialog__backdrop"></div>
      </aside>
    )
  }
}

export default DialogTips;