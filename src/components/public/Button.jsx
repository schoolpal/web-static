import React from 'react';
import { Link } from 'react-router';

export function LoginButton(props) {
    if (props.loading === true) {
        return (
            <div className="login-submit text-danger">
                <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" aria-hidden="true"></i>
            </div>
        )
    } else {
        return (
            <button type="submit" className="btn btn-link login-submit">
                <i className="fa fa-sign-in fa-3x" aria-hidden="true"></i>
                <span>登陆</span>
            </button>
        )
    }
}

export function CreateButton(props) {
    if (props.action) {
        if (props.disabled === true) {
            return (
                <button type="button" className="btn btn-primary" disabled="disabled">
                    <i className="fa fa-clone" aria-hidden="true"></i> 新建
                </button>
            )
        } else {
            return (
                <button onClick={props.action} type="button" className="btn btn-primary">
                    <i className="fa fa-clone" aria-hidden="true"></i> 新建
                </button>
            )
        }
    } else {
        return (
            <Link to={props.link} className="btn btn-primary">
                <i className="fa fa-clone" aria-hidden="true"></i> 新建
            </Link>
        )
    }
}

export function EditorButton(props) {
    if (props.disabled === true) {
        return (
            <button type="button" className="btn btn-primary" disabled="disabled">
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i> 编辑
            </button>
        )
    } else {
        return (
            <button onClick={props.action} type="button" className="btn btn-primary">
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i> 编辑
            </button>
        )
    }
}

export function AssignButton(props) {
    return (
        <button onClick={props.action} type="button" className="btn btn-primary">分配给</button>
    )
}

export function ConvertButton(props) {
    return (
        <button onClick={props.action} type="button" className="btn btn-primary">转化为</button>
    )
}

export function SignButton(props) {
    return (
        <Link to={props.link} className="btn btn-primary">创建合同</Link>
    )
}

export function DelButton(props) {
    const text = props.loading === true ? '' : ' 删除';

    if (props.disabled === true) {
        return (
            <button type="button" className="btn btn-danger" disabled="disabled">
                <Icon />{text}
            </button>
        )
    } else {
        return (
            <button type="button" className="btn btn-danger" onClick={props.action}>
                <Icon />{text}
            </button>
        )
    }

    function Icon() {
        if (props.loading === true) {
            return <i className="fa fa-circle-o-notch fa-spin fa-fw" aria-hidden="true"></i>;
        } else {
            return <i className="fa fa-trash-o" aria-hidden="true"></i>;
        }
    }
}

export function AuthButton(props) {
    return (
        <button className="btn btn-danger" type="submit">
            <i className='fa fa-shield' aria-hidden="true"></i> 授权
        </button>
    )
}

export function SaveButton(props) {
    return (
        <button type="submit" className="btn btn-primary">
            {props.text}
        </button>
    )
}

export function BackButton(props) {
    return (
        <button onClick={() => { props.router.goBack() }} type="button" className="btn btn-secondary">返回</button>
    )
}

export function ToggleButton(props) {
    if (props.enable === true) {
        if (props.available === true) {
            return (
                <button onClick={action} type="button" className="btn btn-link text-success">
                    <i className="fa fa-toggle-on fa-2x" aria-hidden="true"></i>
                </button>
            )
        } else {
            return (
                <button onClick={action} type="button" className="btn btn-link text-danger">
                    <i className="fa fa-toggle-off fa-2x" aria-hidden="true"></i>
                </button>
            )
        }
    } else {
        return <span>{props.available === true ? '启用' : '禁用'}</span>
    }

    function action() {
        props.action({
            uid: props.uid,
            available: props.available
        })
    }
}