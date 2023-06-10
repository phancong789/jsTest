export class Login {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async login(route, form) {
    var formdata = new FormData(form);
    var status = false;
    var objToken = {};
    await fetch(this.endpoint + route, {
      method: "POST",
      body: formdata,
    })
      .then((x) => {
        status = x.ok;
        return x.json();
      })
      .then((token) => (objToken = token));
    return {
      status: status,
      token: objToken,
      message: objToken.errors,
    };
  }
}

export class UpdateProfile extends Login {
  constructor(endpoint) {
    super(endpoint);
  }

  async updateProfile(route, form, imgToString) {
    var formdata = new FormData(form);
    var Jsonrequest = Object.fromEntries(formdata.entries());
    Jsonrequest.avatar_base64 = imgToString;
    var status = false;
    var objToken = {};
    await fetch(this.endpoint + route, {
      method: "POST",
      body: JSON.stringify(Jsonrequest),
    })
      .then((x) => {
        status = x.ok;
        return x.json();
      })
      .then((token) => (objToken = token));
    return {
      status: status,
      token: objToken,
      message: objToken.errors,
    };
  }
}

export class ChangePassword extends UpdateProfile {
  constructor(endpoint) {
    super(endpoint);
  }

  async changePassword(route, form) {
    var formdata = new FormData(form);
    var status = false;
    var objToken = {};
    await fetch(this.endpoint + route, {
      method: "PUT",
      body: formdata,
    })
      .then((x) => {
        status = x.ok;
        return x.json();
      })
      .then((token) => (objToken = token));
    return {
      status: status,
      token: objToken,
      message: objToken.errors,
    };
  }
}

export class Logout extends ChangePassword {
  constructor(endpoint, token) {
    super(endpoint);
    this.token = token;
  }

  async logout(route) {
    return await fetch(this.endpoint + route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token.token_type + " " + this.token.access_token,
      },
    }).then((x) => x.ok);
  }
}

export class GetData extends Logout {
  constructor(endpoint, param, token) {
    super(endpoint, token);
    this.param = param;
  }
  async GetData(route) {
    return await fetch(this.endpoint + route + "?" + this.param, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token.token_type + " " + this.token.access_token,
      },
    }).then((jsondata) => jsondata.json());
  }
}

class GetRoleOrRank extends GetData {
  constructor(endpoint, param, token) {
    super(endpoint, param, token);
  }
  async getRoleOrRank(route) {
    return await fetch(this.endpoint + route, {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          " " + this.token.token_type + " " + this.token.access_token,
      },
    }).then((jsondata) => jsondata.json());
  }
}

export class CreateNewUser extends GetRoleOrRank {
  constructor(endpoint, param, token) {
    super(endpoint, param, token);
  }
  async submitNewUSer(form, route, selectvalue) {
    var newselectvalue = [];
    newselectvalue.push(selectvalue);
    var formdata = new FormData(form);
    var Jsonrequest = Object.fromEntries(formdata.entries());
    Jsonrequest.role_ids = newselectvalue;

    var status;
    var message;
    await fetch(this.endpoint + route, {
      method: "POST",
      body: JSON.stringify(Jsonrequest),
      headers: {
        "content-type": "application/json",
        Authorization:
          " " + this.token.token_type + " " + this.token.access_token,
      },
    })
      .then((x) => {
        status = x.ok;
        return x.json();
      })
      .then((x) => {
        message = JSON.stringify(x.errors);
      });
    return { status: status, message: message };
  }
}

export class UpdateUserData extends CreateNewUser {
  constructor(endpoint, param, token) {
    super(endpoint, param, token);
  }

  async updateUserData(form, route, selectvalue, userId) {
    var newselectvalue = [];
    newselectvalue.push(selectvalue);
    var formdata = new FormData(form);
    var Jsonrequest = Object.fromEntries(formdata.entries());
    Jsonrequest.role_ids = newselectvalue;
    Jsonrequest.id = userId;

    var status;
    var message;
    await fetch(this.endpoint + route + "/" + userId, {
      method: "PUT",
      body: JSON.stringify(Jsonrequest),
      headers: {
        "content-type": "application/json",
        Authorization:
          " " + this.token.token_type + " " + this.token.access_token,
      },
    })
      .then((x) => {
        status = x.ok;
        return x.json();
      })
      .then((x) => {
        message = x.message;
      });
    return { status: status, message: message };
  }
}

export class RemoveUser extends UpdateUserData {
  constructor(endpoint, param, token) {
    super(endpoint, param, token);
  }
  async deleteUser(route, userId) {
    var status;
    await fetch(this.endpoint + route + "/" + userId, {
      method: "DELETE",
      headers: {
        Authorization:
          " " + this.token.token_type + " " + this.token.access_token,
      },
    }).then((x) => {
      return (status = x.ok);
    });
    return status;
  }
}

export default class CallApi extends RemoveUser {
  constructor(url, param, token) {
    super(url, param, token);
  }
}
