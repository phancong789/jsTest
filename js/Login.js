import ModifyUi from "./ModifyUi.js";
import CallApi from "./CallApi.js";
import { endpoint, route, param } from "./env.js";

const loginForm = document.getElementById("login-form");
const alert = document.getElementById("alert");
const modifyUi = new ModifyUi();

var callapi = new CallApi(endpoint, param);

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  var respons = await callapi.login(route.login, loginForm);
  if (respons.status) {
    modifyUi.CallAlert(alert, "đăng nhập thằng công");
    localStorage.setItem("token", JSON.stringify(respons.token));
    window.location = "index.html";
    return;
  }
  modifyUi.CallAlert(alert, JSON.stringify(respons.message));
});
