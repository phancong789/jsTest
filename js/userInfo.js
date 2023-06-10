import ModifyUi from "./ModifyUi.js";
import CallApi from "./CallApi.js";
import { endpoint, route, param } from "./env.js";

const token = JSON.parse(localStorage.getItem("token"));
const callapi = new CallApi(endpoint, param, token);
const modifyui = new ModifyUi("app", callapi);

const openAvatarModalBtn = document.querySelector("[avatar-btn]");
const uploadImgModal = document.querySelector("[upload-img-modal]");

const openProfileBtn = document.querySelector("[open-profile]");
const openChangeBtn = document.querySelector("[open-changePass]");

var mineinfo = await callapi.GetData(route.me);

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

modifyui.modifyUserNavUI("userinfo", mineinfo.user);
modifyui.CloseModal(uploadImgModal);
openAvatarModalBtn.addEventListener("click", () => {
  modifyui.OpenModal(uploadImgModal);
});
openProfileBtn.onclick = () => {
  modifyui.genEditUserForm(mineinfo.user, "#formContent", route.me);
};

openChangeBtn.onclick = () => {
  modifyui.genEditUserForm(mineinfo.user, "#formContent", route.mePassword);
};
modifyui.genEditUserForm(mineinfo.user, "#formContent", route.me);
