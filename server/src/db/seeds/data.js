const { Roles, Types, TagNamespaces } = require("../../constants");

// admin123
const DEFAULT_PASSWORD_HASH = "$2a$10$6hURZ2wrND0Ov3PmqlEtGupMoC/OAtrsINDbHdy4io6Ojj5zsPL/O"

const mapConstToData = (c) => {
    return c.map(e => {
        return { name: e }
    })
}

const tags =
[
    {
        name: "smile",
    },
    {
        name: "magical_girl",
    },
    {
        name: "kinomoto_sakura",
        namespaceId: 2,
    },
    {
        name: "cardcaptor_sakura",
        namespaceId: 1,
    }
]

const user = {
    name: "admin",
    passwordHash: DEFAULT_PASSWORD_HASH,
    roleId: 1
}

module.exports = {
    roles: mapConstToData(Roles),
    types: mapConstToData(Types),
    tagNamespaces: mapConstToData(TagNamespaces),
    tags: tags,
    user: user
}
