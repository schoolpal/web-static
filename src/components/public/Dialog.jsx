import React from 'react';
import ReactDOM from 'react-dom';

export default class Dialog extends React.Component {
    constructor(props) {
        super(props)
        this.closed = this.closed.bind(this)
        this.confrimAction = this.confrimAction.bind(this)
    }

    componentDidMount() {
        $(this.confrim)
            .modal('show')
            .one('hidden.bs.modal', () => {
                this.closed();
            });
    }

    componentWillUnmount() {
        document.body.removeChild(this.props.container);
    }

    closed() {
        ReactDOM.unmountComponentAtNode(this.props.container);
    }

    confrimAction() {
        $(this.confrim).modal('hide');

        if (this.props.action) {
            this.props.action();
        };
    }

    render() {
        const title = this.props.title || '提示';

        return (
            <div ref={(dom) => { this.confrim = dom }} className="modal fade">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-title">{title}</p>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{this.props.text}</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={this.confrimAction} type="button" className="btn btn-primary">确认</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}