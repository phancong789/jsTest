import ModifyUi from "./ModifyUi.js";
import CallApi from "./CallApi.js";
import { endpoint, route, param } from "./env.js";

const token = JSON.parse(localStorage.getItem("token"));

const createUserRoleSelect = document.getElementById("roleId");
const updateUserRoleSelect = document.getElementById("UpdateroleId");

const createNewUserForm = document.getElementById("createNewForm");
const updateUserForm = document.getElementById("updateForm");
const deleteModal = document.querySelector("[delete-modal]");
const alert = document.getElementById("alert");

const LogoutBtn = document.getElementById("logoutbtn");
const userProfilebtn = document.getElementById("userProfilebtn");

const callapi = new CallApi(endpoint, param, token);
const modifyui = new ModifyUi(
  "app",
  callapi,
  createNewUserForm.parentElement,
  updateUserForm.parentElement,
  deleteModal
);

var mineinfo = await callapi.GetData(route.me);
var roledata = await callapi.getRoleOrRank(route.roles);

// #region validator
function Validator(options) {
  function validate(inputElement, rule) {
    var formMessage = inputElement.parentElement.querySelector(
      options.errorSelector
    );
    var errMessage = rule.test(inputElement.value);
    if (errMessage) {
      formMessage.innerText = errMessage;
    } else {
      formMessage.innerText = "";
    }

    return !errMessage;
  }

  var formElement = document.querySelector(options.form);

  formElement.onsubmit = function (e) {
    e.preventDefault();
    var isvaild = true;
    options.rules.forEach(function (rule) {
      var inputElement = formElement.querySelector(rule.selector);

      var isCheck = validate(inputElement, rule);

      if (!isCheck) {
        isvaild = false;
      }
    });

    if (isvaild) {
      options.onSubmit();
    }
  };

  if (formElement) {
    options.rules.forEach(function (rule) {
      var inputElement = formElement.querySelector(rule.selector);
      var formMessage = inputElement.parentElement.querySelector(
        options.errorSelector
      );

      if (inputElement) {
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        inputElement.oninput = function () {
          formMessage.innerText = "";
        };
      }
    });
  }
}

//#region rules
Validator.IsRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim()
        ? undefined
        : message || "trường này không được phép để trống";
    },
  };
};

Validator.IsEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "trường này phải là 1 email";
    },
  };
};

Validator.IsPassword = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&].{8,}$/gm;
      return regex.test(value)
        ? undefined
        : message ||
            "trường phải có tối thiếu 1 chữ cái viết hoa,1 chữ cái viết thường,1 chữ số và 1 kí tự đặc viết";
    },
  };
};

Validator.IsComfirmed = function (selector, getComfirmedValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getComfirmedValue()
        ? undefined
        : message || "giá trị nhập vào không chính xác";
    },
  };
};

// Validator.IsArrayEmpty = function (
//   Labelselector,
//   selectValueLength,
//   minlength,
//   message
// ) {
//   return {
//     selector: Labelselector,
//     test: function (value) {
//       return selectValueLength > minlength
//         ? undefined
//         : message || "giá trị nhập vào không chính xác";
//     },
//   };
// };

//#endregion

//#endregion

const createuser = async () => {
  var feedback = await callapi.submitNewUSer(
    createNewUserForm,
    route.users,
    createUserRoleSelect.value
  );
  if (feedback.status == false) {
    modifyui.CallAlert(alert, feedback.message);
    return;
  }
  modifyui.CallAlert(alert, "thêm người dùng mới thành công");
  modifyui.CloseModal(createNewUserForm.parentElement, createNewUserForm);
  modifyui.GenTable(await callapi.GetData(route.users), route.users);
};

const updateuser = async () => {
  var feedback = await callapi.updateUserData(
    updateUserForm,
    route.users,
    updateUserRoleSelect.value,
    modifyui.GetUserId()
  );
  if (feedback.status == false) {
    modifyui.CallAlert(alert, feedback.message);
    return;
  }
  modifyui.CallAlert(alert, "chỉnh sửa người dùng thành công");
  modifyui.CloseModal(updateUserForm.parentElement, updateUserForm);
  modifyui.GenTable(await callapi.GetData(route.users), route.users);
};

const removeuser = () => {
  document
    .getElementById("deleteButton")
    .addEventListener("click", async () => {
      var status = await callapi.deleteUser(route.users, modifyui.GetUserId());
      if (status == false) {
        modifyui.CallAlert(alert, "xoá người dùng thất bại");
        return;
      }
      modifyui.CallAlert(alert, "xoá người dùng thành công");
      modifyui.CloseModal(deleteModal);
      modifyui.GenTable(await callapi.GetData(route.users), route.users);
    });
};

const logout = () => {
  document.getElementById("logoutbtn").addEventListener("click", async () => {
    var status = await callapi.logout(route.Logout);
    if (status == false) {
      modifyui.CallAlert(alert, "đăng xuất thất bại");
      return;
    }
    localStorage.removeItem("token");
    window.location = "login.html";
  });
};

const main = async () => {
  Validator({
    form: "#createNewForm",
    errorSelector: ".form-message",
    rules: [
      Validator.IsRequired("#nameInput"),
      Validator.IsRequired("#UserNameInput"),
      Validator.IsEmail("#EmailInput"),
      Validator.IsPassword("#PswInput"),
      Validator.IsComfirmed("#PswCm", function () {
        return document.querySelector("#createNewForm #PswInput").value;
      }),
    ],
    onSubmit: function () {
      createuser();
    },
  });

  Validator({
    form: "#updateForm",
    errorSelector: ".form-message",
    rules: [
      Validator.IsRequired("#UpdateNameInput"),
      Validator.IsEmail("#UpdateEmailInput"),
    ],
    onSubmit: function () {
      updateuser();
    },
  });
  logout();
  removeuser();
  modifyui.CloseModal(createNewUserForm.parentElement, createNewUserForm);
  modifyui.CloseModal(updateUserForm.parentElement, updateUserForm);
  modifyui.CloseModal(deleteModal);
  modifyui.section();
  modifyui.genSideBar(await callapi.GetData(route.users), null, roledata, null);
  modifyui.genFilerZone(route.users, roledata, null);
  modifyui.GenTable(await callapi.GetData(route.users), route.users);
  modifyui.modifyUserNavUI("userinfo", mineinfo.user);

  modifyui.GenRole(roledata, createUserRoleSelect);
  modifyui.GenRole(roledata, updateUserRoleSelect);
};

main();
