import React from 'react';

export default class OrgTree extends React.Component {
    constructor(props) {
        super(props)

        this.renderTree = this.renderTree.bind(this);
        this.renderTreeItem = this.renderTreeItem.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        $(this.treeDom).on('click', '[data-node]', function (event) {
            event.stopPropagation();

            if ($(this).hasClass('not-child')) {
                return;
            };

            if ($(this).hasClass('closed')) {
                $(this)
                    .removeClass('closed')
                    .closest('li')
                    .children('ul')
                    .show();
            } else {
                $(this)
                    .closest('li')
                    .find('[data-node]')
                    .addClass('closed')
                    .end()
                    .closest('li')
                    .find('ul')
                    .hide();
            };
        })
    }

    renderTree(data) {
        let tree = [];

        data.map((item) => {
            let children = [];

            if (item.children && item.children.length) {
                let children = [];

                children.push(this.renderTree(item.children));

                if (item.cName) {
                    tree.push(
                        <li key={item.cId}>
                            {this.renderTreeItem(item)}
                            <ul>{children}</ul>
                        </li>
                    );
                } else {
                    tree.push(children);
                }
            } else {
                tree.push(
                    <li key={item.cId}>{this.renderTreeItem(item)}</li>
                )
            }
        })

        return tree;
    }

    renderTreeItem(data) {
        const nodeClass = 'tree-node ' + ((data.children && data.children.length) ? '' : 'not-child');
        const nodeSelectClass = 'select ' + (this.props.defaults && this.props.defaults.toString() === data.cId ? 'selected' : '');

        return (
            <div className="hd">
                <i onClick={this.handleNode} data-node className={nodeClass}></i>
                <p onClick={this.handleSelect} data-o={data.cId} className={nodeSelectClass}><span>{data.cName}</span></p>
            </div>
        )
    }

    handleSelect(event) {
        const elem = $(event.target).data('o') ? $(event.target) : $(event.target).parent();

        if (elem.hasClass('selected')) {
            return;
        }

        this.props.selected({
            id: elem.data('o'),
            name: elem.children('span').text()
        })
    }

    render() {
        return (
            <div ref={(dom) => { this.treeDom = dom }} className="tree">
                <ul>
                    {(this.props.data && this.props.data.length) ? this.renderTree(this.props.data) : ''}
                </ul>
            </div>
        )
    }
}