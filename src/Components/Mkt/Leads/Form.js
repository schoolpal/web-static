import React from 'react'
import ReactDOM from 'react-dom'

import DialogDate from '../../Dialog/DialogDate';
import DialogAct from "../../Dialog/DialogAct"

import fmtDate from '../../../utils/fmtDate'

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      group: this.props.changedCrmGroup,
      data: null
    };
    this.createActDialog = this.createActDialog.bind(this);
    this.acceptActDialog = this.acceptActDialog.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if (this.tipsContainer) {
      document.body.removeChild(this.tipsContainer);
    }

    if (this.actContainer) {
      document.body.removeChild(this.actContainer);
    }
  }

  createActDialog() {
    if (this.act === undefined) {
      this.actContainer = document.createElement('div');
      ReactDOM.render(
        <DialogAct
          accept={this.acceptActDialog}
          changedCrmGroup={this.state.group}
          notRoot={true}
          ref={(dom) => {
            this.act = dom
          }}
        />,
        document.body.appendChild(this.actContainer)
      );
    }

    this.act.dialog.modal('show');
  }

  acceptActDialog(selected) {
    this.setState({
      parentId: selected.id,
      parentName: selected.name,
      startDate: null,
      endDate: null
    })
  }

  getFormValue() {
    if (!this.form.checkValidity() || (!this.state.startDate && !this.state.endDate)) {
      return
    }

    let query = {};

    if (this.state.parentId !== 'root') {
      query.parentId = this.state.parentId;
    }

    query.startDate = this.state.startDate;
    query.endDate = this.state.endDate;

    for (let i = 0; i < this.form.length; i++) {
      if (this.form[i].tagName !== 'BUTTON' && !this.form[i].readOnly) {
        query[this.form[i].name] = this.form[i].value;
      }
    }

    return query;
  }

  render() {
    // if (!this.state.data) {
    //   return (
    //     <form ref={(dom) => {
    //       this.form = dom
    //     }}>
    //       <div className="row justify-content-md-center">
    //         <div className="col col-12">
    //           <div className="card">
    //             <div className="card-body">数据加载中...</div>
    //           </div>
    //         </div>
    //       </div>
    //     </form>
    //   )
    // } else {
      return (
        <form ref={(dom) => {
          this.form = dom
        }}>
          <div className="row justify-content-md-center">
            <div className="col col-12">
              <div className="card">
                <div className="card-body">
                  <p className="ht pb-3 b-b">线索信息</p>
                  <div className="row">
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <input type="text" className="form-control" placeholder="Password"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <select className="form-control">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <input type="text" className="form-control" placeholder="Password"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <select className="form-control">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <input type="text" className="form-control" placeholder="Password"/>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <input type="text" className="form-control" placeholder="Password"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <select className="form-control">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <input type="text" className="form-control" placeholder="Password"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <input type="text" className="form-control" placeholder="Password"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <input type="text" className="form-control" placeholder="Password"/>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <select className="form-control">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <select className="form-control">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <textarea className="form-control" rows="3"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="ht pt-3 pb-3 b-t b-b">线索进程</p>
                  <div className="row">
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <select className="form-control">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="input-group col-7">
                          <input type="text" className="form-control" readOnly={true}/>
                          <span className="input-group-btn">
                            <button onClick={this.createActDialog} className="btn btn-secondary" type="button">
                              <i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"/>
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <select className="form-control">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                        <div className="col-7">
                          <select className="form-control">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col"/>
                    <div className="col"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )
    }
  // }
}

export default Form;