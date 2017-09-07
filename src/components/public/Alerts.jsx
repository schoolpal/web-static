import React from 'react';

export default function Alerts(props) {
    return (
        <div className={'alert alert-' + props.type + ' border-right-0 border-left-0 rounded-0'} role="alert">
            <strong>{props.title}</strong> {props.text} {props.children}
        </div>
    )
}