import React from 'react'
import { Link } from 'react-router'
import { CreateButton } from '../../public/Button'

export default class List extends React.Component {
    constructor(props) {
        super(props)
        this.renderCommand = this.renderCommand.bind(this)
    }

    renderCommand() {
        const path = this.props.location.pathname.replace(SCHOOLPAL_CONFIG.ROOTPATH, '');
        const auth = SCHOOLPAL_CONFIG.commandRules.find((item) => { return item.PATH_RULE.test(path) === true });
        let temp = [];

        if (auth) {
            auth.command.map((item, index) => {
                if (item === 'Add') {
                    temp.push(<CreateButton key={index} link={this.props.location.pathname + '/edit/create'} />)
                };
            })
        }

        return temp;
    }

    render() {
        return (
            <div className="market">
                <h5>
                    <i className="fa fa-pie-chart" aria-hidden="true"></i>&nbsp;我的学员
                </h5>

                <div className="main-container">
                    <table className='table table-bordered table-sm'>
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>学员姓名</th>
                                <th>学员编号</th>
                                <th>性别</th>
                                <th>出生年月</th>
                                <th>年龄</th>
                                <th>证件类型</th>
                                <th>身份证号码</th>
                                <th>在读年级</th>
                                <th>所在学校</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        )
    }
}