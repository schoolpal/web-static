const SCHOOLPAL_CONFIG = {
  AUTH: {
    "7": { ICON_CLASS: "fa-sitemap" },
    "7-1": {
      PATH: "groups",
      PATH_RULE: /^\/groups(\/)?$/,
      ICON_CLASS: "fa-sitemap"
    },
    "7-1-1": { PATH_RULE: /^\/group\/create(\/)?$/ },
    "7-1-2": { PATH_RULE: /^\/group\/\w+(\/)?$/ },
    "7-2": {
      PATH: "roles",
      PATH_RULE: /^\/role(\/)?$/,
      ICON_CLASS: "fa-users"
    },
    "7-2-1": { PATH_RULE: /^\/role\/\w+\/create(\/)?$/ },
    "7-2-2": { PATH_RULE: /^\/role\/\w+\/\w+(\/)?$/ },

    "7-3": {
      PATH: "auths",
      PATH_RULE: /^\/auth(\/)?$/,
      ICON_CLASS: "fa-shield"
    },

    "7-4": { PATH: "users", PATH_RULE: /^\/user(\/)?$/, ICON_CLASS: "fa-user" },
    "7-4-1": { PATH_RULE: /^\/user\/\w+\/create(\/)?$/ },
    "7-4-2": { PATH_RULE: /^\/user\/\w+\/\w+(\/)?$/ }
  }
};

export default SCHOOLPAL_CONFIG;
