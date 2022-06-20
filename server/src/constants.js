const Roles = [ "admin", "user" ];
const TagNamespaces = [ "copyright", "character"];
const Types = ["drawing", "photograph"];
const AllowedMimeTypes = [
    "image/png", ".image/jpeg", "image/jpeg", "image/jpg", "image/webp"
];

const AccessTokenLife = 7890000; // 3 months

const HttpResCode = {
    Ok: 200,
    Created: 201,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    Internal: 500
}

module.exports = {
  Roles,
  TagNamespaces,
  AllowedMimeTypes,
  Types,
  HttpResCode,
  AccessTokenLife,
}
