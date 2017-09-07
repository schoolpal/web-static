import React from 'react';

export default function RenderOption(data) {
    let option = [];

    $.each(data, (i, item) => {
        option.push(<option key={i} value={item}>{item}</option>)
    })

    return option
}