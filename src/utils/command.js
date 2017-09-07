import { getProfile } from './userProfile'

export default function command(path) {
    const profile = getProfile()
    const command = profile.roles.find((item) => {
        if (SCHOOLPAL_CONFIG.AUTH_DIC[item.id].PATH_RULE.test(path) === true) {
            return item;
        }
    })

    if (command && command.command.length) {
        return command.command;
    }

    return [];
}