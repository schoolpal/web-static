import { getProfile } from '../utils/userProfile'


export default function checkAuth(nextState, replace) {
    const targetPath = nextState.location.pathname.replace(SCHOOLPAL_CONFIG.ROOTPATH, '');
    const profile = getProfile();
    console.log('start check auth ...')
    console.log('check path is ' + targetPath)
    if (profile) {
        let hasMatch = false;

        if (profile.access.length) {
            for (let i = 0; i < profile.access.length; i++) {
                const id = profile.access[i];

                if (SCHOOLPAL_CONFIG.AUTH_DIC[id].PATH_RULE.test(targetPath) === true) {
                    hasMatch = true;
                    break;
                }
            }
        }

        if (SCHOOLPAL_CONFIG.ROOTPATH === nextState.location.pathname) {
            hasMatch = true;
        }

        if (hasMatch === false) {
            console.log('check auth result is not authorize !')

            replace({
                pathname: SCHOOLPAL_CONFIG.ROOTPATH + 'error',
                state: { text: '没有权限访问该页面 ！' }
            })
        }
    } else {
        console.log('check auth result is not login !')

        replace({
            pathname: SCHOOLPAL_CONFIG.ROOTPATH + 'login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}