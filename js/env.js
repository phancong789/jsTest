const endpoint = "https://httpdl.howizbiz.com/api/";
const route = {
  login: "web-authenticate",
  me: "me",
  users: "users",
  roles: "roles",
  Logout: "web-logout",
  mePassword: "me/password",
};
const param = new URLSearchParams({
  with: "roles,createdBy",
  paginate: true,
  page: 1,
  itemsPerPage: 10,
  search: "",
});
export { endpoint, route, param };
