const ICON_LOADING = `<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw" aria-hidden="true"></i>`
const ICON_SUCCESS = `<i class="fa fa-hand-peace-o fa-3x" aria-hidden="true"></i>`
const ICON_FAIL = `<i class="fa fa-close fa-3x" aria-hidden="true"></i>`
const AUTO_CLOSED = 2000;

export default function DialogTips(options) {
    if (!(this instanceof DialogTips)) {
        return new DialogTips(options);
    }

    const $elem = $(getTipsHtml());

    function getTipsHtml() {
        if (options.type === 'loading') {
            return `
                <div class="dialog-tips">
                    <div class="content">
                        ${ICON_LOADING}
                        <span>加载中</span>
                    </div>
                </div>
            `
        };

        if (options.type === 'success') {
            return `
                <div class="dialog-tips">
                    <div class="content">
                        ${ICON_SUCCESS}
                        <span>操作成功</span>
                    </div>
                </div>
            `
        };

        if (options.type === 'fail') {
            return `
                <div class="dialog-tips">
                    <div class="content">
                        ${ICON_FAIL}
                        <span>操作失败</span>
                    </div>
                </div>
            `
        };
    }

    function open() {
        $elem.appendTo('#app');

        if (options.autoClose && options.autoClose === true) {
            setTimeout(() => {
                $elem.detach();
            }, AUTO_CLOSED)
        }
    }

    function close() {
        $elem.detach();
    }

    return {
        open,
        close
    }
}