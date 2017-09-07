export default function subTitle(id, menu) {
    if (id === 'create') {
        return '新建' + menu;
    } else {
        return '编辑' + menu;
    }
}