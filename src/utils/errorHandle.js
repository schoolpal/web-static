export default function errorHandle(query) {
    if (query.data.type === SCHOOLPAL_CONFIG.NOT_SIGNIN) {
        query.router.replace({
            pathname: SCHOOLPAL_CONFIG.ROOTPATH + 'login',
            state: { nextPathname: query.router.location.pathname }
        })
    };
}