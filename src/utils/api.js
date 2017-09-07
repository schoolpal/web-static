import { browserHistory } from 'react-router'
import { conversionOrg, conversionFunc } from './conversion';

function io(options, callback) {
    if (!(this instanceof io)) {
        return new io(options, callback);
    };

    const defaults = {
        type: 'POST',
        dataType: 'json'
    };
    const settings = $.extend({}, defaults, options);
    const jqxhr = $.ajax({
        url: formatUrl(settings.url),
        type: settings.type,
        data: settings.data || {},
        dataType: settings.dataType
    });

    jqxhr.done(function (data, textStatus, jqXHR) {
        if (data.code === 200) {
            callback({
                type: SCHOOLPAL_CONFIG.XHR_DONE,
                data: data.data
            });
        } else {
            callback({
                type: SCHOOLPAL_CONFIG.XHR_BUSINESS_ERROR,
                data: data
            })
        };
    })

    jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.status, textStatus, errorThrown)

        if (jqXHR.status === 401) {
            callback({
                type: SCHOOLPAL_CONFIG.XHR_ERROR
            })

            browserHistory.replace({
                pathname: SCHOOLPAL_CONFIG.ROOTPATH + 'login',
                state: { nextPathname: browserHistory.getCurrentLocation().pathname }
            })
        } else {
            callback({
                type: SCHOOLPAL_CONFIG.XHR_ERROR
            })
        }
    })
}

function formatUrl(url) {
    return SCHOOLPAL_CONFIG.AJAXPATH + url;
}

export function salt() {
    const defer = $.Deferred();
    const url = 'user/salt.do';

    io({ url: url }, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function login(data) {
    const defer = $.Deferred();
    const url = 'user/login.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function logout() {
    const defer = $.Deferred();
    const url = 'user/logout.do';

    io({ url: url }, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function profile() {
    const defer = $.Deferred();
    const url = 'user/profile.do';

    io({ url: url }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function permissions() {
    const defer = $.Deferred();
    const url = 'user/listFuncs.do';

    io({ url: url }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            let commandRules = [];
            let accessRules = [];

            if (data.data.length) {
                $.each(data.data, (i, item) => {
                    if (item.WidgetType === 'MenuItem') {
                        const temp = $.extend({}, { id: item.cId, command: [] }, SCHOOLPAL_CONFIG.AUTH_DIC[item.cId]);

                        commandRules.push(temp);
                    }

                    if (item.WidgetType === 'Command') {
                        const index = commandRules.findIndex((value) => { return value.id === item.cParentId });

                        if (index >= 0) {
                            commandRules[index].command.push(item.CommandCode);
                        }
                    }

                    if (SCHOOLPAL_CONFIG.AUTH_DIC[item.cId]) {
                        accessRules.push(SCHOOLPAL_CONFIG.AUTH_DIC[item.cId].PATH_RULE)
                    }
                })
            };

            SCHOOLPAL_CONFIG.accessRules = accessRules;
            SCHOOLPAL_CONFIG.commandRules = commandRules;

            defer.resolve();
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function changePwd(data) {
    const defer = $.Deferred();
    const url = 'user/changePassword.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function orgList() {
    const defer = $.Deferred();
    const url = 'user/listOrgs.do';

    io({ url: url }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(conversionOrg(data.data));
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function roleList(oid) {
    const defer = $.Deferred();
    const url = 'org/listRoles.do';

    io({ url: url, data: { id: oid } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function sysOrgList() {
    const defer = $.Deferred();
    const url = 'sys/org/list.do';

    io({ url: url }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(conversionOrg(data.data));
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function orgDetails(oid) {
    const defer = $.Deferred();
    const url = 'org/query.do';

    io({ url: url, data: { id: oid } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function orgAdd(data) {
    const defer = $.Deferred();
    const url = 'sys/org/add.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function orgMod(data) {
    const defer = $.Deferred();
    const url = 'sys/org/mod.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function orgDel(oid) {
    const defer = $.Deferred();
    const url = 'sys/org/del.do';

    io({ url: url, data: { id: oid } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function sysRoleList(oid) {
    const defer = $.Deferred();
    const url = 'sys/role/list.do';

    io({ url: url, data: { id: oid } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function rankDic() {
    const defer = $.Deferred();
    const url = 'role/ranks.do';

    io({ url: url }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function funcDic() {
    const defer = $.Deferred();
    const url = 'func/listAllFuncs.do';

    io({ url: url }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function roleAdd(data) {
    const defer = $.Deferred();
    const url = 'sys/role/add.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function roleDel(rid) {
    const defer = $.Deferred();
    const url = 'sys/role/del.do';

    io({ url: url, data: { id: rid } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function roleDetails(rid) {
    const defer = $.Deferred();
    const url = 'role/query.do';

    io({ url: url, data: { id: rid } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function roleMod(data) {
    const defer = $.Deferred();
    const url = 'sys/role/mod.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function roleAuth(data) {
    const defer = $.Deferred();
    const url = 'sys/role/auth.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function funcByIds(fids) {
    const defer = $.Deferred();
    const url = 'func/list.do';

    io({ url: url, data: { ids: fids } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            const conversionFuncData = conversionFunc(data.data)

            defer.resolve({
                tree: conversionFuncData,
                data: data.data
            });
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function userList(oid) {
    const defer = $.Deferred();
    const url = 'org/listUsers.do';

    io({ url: url, data: { id: oid } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function userAdd(data) {
    const defer = $.Deferred();
    const url = 'sys/user/add.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function userDetails(uid) {
    const defer = $.Deferred();
    const url = 'sys/user/query.do';

    io({ url: url, data: { id: uid } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function userMod(data) {
    const defer = $.Deferred();
    const url = 'sys/user/mod.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function userEnable(uid, enable) {
    const defer = $.Deferred();
    const url = 'sys/user/enable.do';

    io({ url: url, data: { id: uid, enabled: enable } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function userDel(uid) {
    const defer = $.Deferred();
    const url = 'sys/user/del.do';

    io({ url: url, data: { id: uid } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function checkName(name) {
    const defer = $.Deferred();
    const url = 'sys/user/checkName.do';

    io({ url: url, data: { loginName: name } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function actList(oid) {
    const defer = $.Deferred();
    const url = 'mkt/activity/list.do';
    const settings = $.extend({ url: url }, { data: { orgnizationId: oid } });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function mktActList(oid) {
    const defer = $.Deferred();
    const url = 'mkt/activity/listTree.do';
    const settings = $.extend({ url: url }, { data: { orgId: oid } });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function actAdd(data) {
    const defer = $.Deferred();
    const url = 'mkt/activity/add.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function actMod(data) {
    const defer = $.Deferred();
    const url = 'mkt/activity/mod.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function actDel(id) {
    const defer = $.Deferred();
    const url = 'mkt/activity/del.do';
    const settings = $.extend({ url: url }, { data: { id: id } });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function actQuery(id) {
    const defer = $.Deferred();
    const url = 'mkt/activity/query.do';
    const settings = $.extend({ url: url }, { data: { id: id } });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function leadsSources(id) {
    const defer = $.Deferred();
    const url = 'mkt/leads/source/list.do';

    io({ url: url, data: { typeId: id } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function leadsStages(id) {
    const defer = $.Deferred();
    const url = 'mkt/leads/stage/list.do';

    io({ url: url, data: { typeId: id } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function leadsStatus(id) {
    const defer = $.Deferred();
    const url = 'mkt/leads/status/list.do';

    io({ url: url, data: { typeId: id } }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function genderList() {
    const defer = $.Deferred();
    const url = 'mkt/gender/list.do';

    io({ url: url }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function relationList() {
    const defer = $.Deferred();
    const url = 'mkt/relation/list.do';

    io({ url: url }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function leadsAdd(data) {
    const defer = $.Deferred();
    const url = 'mkt/leads/add.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function leadsList(oid) {
    const defer = $.Deferred();
    const url = 'mkt/leads/list.do';
    const settings = $.extend({ url: url }, { data: { orgId: oid } });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function leadsQuery(id) {
    const defer = $.Deferred();
    const url = 'mkt/leads/query.do';
    const settings = $.extend({ url: url }, { data: { id: id } });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function leadsMod(data) {
    const defer = $.Deferred();
    const url = 'mkt/leads/mod.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function leadsDel(id) {
    const defer = $.Deferred();
    const url = 'mkt/leads/del.do';
    const settings = $.extend({ url: url }, { data: { id: id } });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function leadsAssign(data) {
    const defer = $.Deferred();
    const url = 'mkt/leads/assign.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function leadsConvert(data) {
    const defer = $.Deferred();
    const url = 'mkt/leads/convert.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function contactList(id) {
    const defer = $.Deferred();
    const url = 'contact/list.do';
    const settings = $.extend({ url: url }, { data: { leadsId: id } });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function approachList() {
    const defer = $.Deferred();
    const url = 'contact/approach/list.do';

    io({ url: url }, (data) => {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    })

    return defer.promise();
}

export function contactAdd(data) {
    const defer = $.Deferred();
    const url = 'contact/add.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function contactMod(data) {
    const defer = $.Deferred();
    const url = 'contact/mod.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function opporList(data) {
    const defer = $.Deferred();
    const url = 'sales/oppor/list.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function opporAdd(data) {
    const defer = $.Deferred();
    const url = 'sales/oppor/add.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function opporQuery(id) {
    const defer = $.Deferred();
    const url = 'sales/oppor/query.do';

    io({ url: url, data: { id: id } }, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function opporDel(id) {
    const defer = $.Deferred();
    const url = 'sales/oppor/del.do';

    io({ url: url, data: { id: id } }, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function opporAssign(data) {
    const defer = $.Deferred();
    const url = 'sales/oppor/assign.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function contractList(id) {
    const defer = $.Deferred();
    const url = 'sales/contract/list.do';

    io({ url: url, data: { orgnizationId: id } }, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function contractAdd(data) {
    const defer = $.Deferred();
    const url = 'sales/contract/add.do';
    const settings = $.extend({ url: url }, { data: data });

    io(settings, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}

export function contractQuery(id) {
    const defer = $.Deferred();
    const url = 'sales/contract/query.do';

    io({ url: url, data: { id: id } }, function (data) {
        if (data.type === SCHOOLPAL_CONFIG.XHR_DONE) {
            defer.resolve(data.data);
        } else {
            defer.reject(data);
        }
    });

    return defer.promise();
}