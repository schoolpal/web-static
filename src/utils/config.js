export default {
  AUTH: {
    "7": {ICON_CLASS: "fa-sitemap"},
    "7-1": {
      PATH: "groups",
      PATH_RULE: /^\/groups$/,
      ICON_CLASS: "fa-sitemap"
    },
    "7-1-1": {PATH_RULE: /^\/groups\/create$/},
    "7-1-2": {PATH_RULE: /^\/groups\/((?!create).)*$/},
    "7-2": {
      PATH: "roles",
      PATH_RULE: /^\/roles$/,
      ICON_CLASS: "fa-users"
    },
    "7-2-1": {PATH_RULE: /^\/roles\/create$/},
    "7-2-2": {PATH_RULE: /^\/roles\/((?!create).)*$/},

    "7-3": {
      PATH: "permissions",
      PATH_RULE: /^\/permissions$/,
      ICON_CLASS: "fa-shield"
    },

    "7-4": {PATH: "users", PATH_RULE: /^\/users$/, ICON_CLASS: "fa-user"},
    "7-4-1": {PATH_RULE: /^\/users\/create$/},
    "7-4-2": {PATH_RULE: /^\/users\/((?!create).)*$/}
  }
};
