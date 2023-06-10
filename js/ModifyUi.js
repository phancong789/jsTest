export default class ModifyUi {
  #min = 1;
  #max;
  #userId;
  constructor(
    appId,
    callapi,
    CreateNewUserDialog,
    updateUserDialog,
    DeleteUserDialog
  ) {
    this.parent = appId;
    this.CreateNewUserDialog = CreateNewUserDialog;
    this.updateUserDialog = updateUserDialog;
    this.DeleteUserDialog = DeleteUserDialog;
    this.callapi = callapi;
    this.sidebarDiv;
    this.AboveTable;
    this.tableDiv;
  }

  section() {
    var sidebarDiv = document.createElement("div");
    var container = document.createElement("div");
    var tableDiv = document.createElement("div");

    var AboveTable = document.createElement("div");
    var appDiv = document.getElementById(this.parent);

    appDiv.className = "container-fluid row";

    appDiv.appendChild(sidebarDiv);
    sidebarDiv.className = "col-sm-2 mh-100";

    appDiv.appendChild(container);

    container.append(AboveTable);
    tableDiv.className = "table-responsive";

    container.appendChild(tableDiv);
    container.className = "col-xl-10";

    this.AboveTable = AboveTable;
    this.sidebarDiv = sidebarDiv;
    this.tableDiv = tableDiv;
  }
  genSideBar(userData, categoryData, rolesdata, ranksdata) {
    var userPageButton = document.createElement("button");
    userPageButton.className = "btn m-2 d-block nav-item";
    userPageButton.innerHTML = '<i class="fa-regular fa-user"></i> User Table';
    if (userData && rolesdata) {
      userPageButton.addEventListener("click", () => {
        this.GenTable(userData, "users");
        this.genFilerZone("users", rolesdata, null);
        window.location = "http://127.0.0.1:5500/#/users";
      });
    }
    this.sidebarDiv.append(userPageButton);

    var CategoryButton = document.createElement("button");
    CategoryButton.className = "btn m-2 d-block nav-item";
    CategoryButton.innerHTML =
      '<i class="fa-regular fa-address-book"></i> Category Table';
    if (categoryData && ranksdata) {
      CategoryButton.addEventListener("click", () => {
        this.GenTable(categoryData, "phanloaihoc");
        this.genFilerZone("phanloaihoc", null, ranksdata);
        window.location = "http://127.0.0.1:5500/#/category";
      });
    }
    this.sidebarDiv.append(CategoryButton);
  }

  /**
   *
   * @param {*} tabletype
   * @param {object} roledata yêu cầu phải có để có thể tạo ra dc select lọc người dùng theo role
   * @param {object} rankdata yêu cầu phải có để có thể tạo ra dc select lọc category
   */
  genFilerZone(tabletype, roledata, rankdata) {
    var Searchbar = document.createElement("input");
    var NewUserBtn = document.createElement("button");
    var filterzone = document.createElement("div");

    this.AboveTable.innerHTML = "";

    this.AboveTable.appendChild(Searchbar);
    this.AboveTable.appendChild(NewUserBtn);
    this.AboveTable.appendChild(filterzone);
    this.AboveTable.className = "container-fluid mt-2 mb-2";
    Searchbar.className = "form-control d-inline w-75";
    Searchbar.placeholder = "điền giá trị để tìm kiếm";
    this.#searchUser(Searchbar, tabletype);
    NewUserBtn.classList = "btn float-end btn-warning";
    NewUserBtn.innerText = "Thêm Mới";
    NewUserBtn.onclick = () => {
      this.OpenModal(this.CreateNewUserDialog);
    };

    filterzone.className =
      "container-fluid row mt-2 ms-1 mb-2 bg-secondary-subtle";

    switch (tabletype) {
      case "users":
        this.#userFilter(filterzone, roledata);
        break;
      case "phanloaihoc":
        this.#CategoryFilter(filterzone, rankdata);
        break;
    }
  }

  #userFilter(filterzone, roledata) {
    //#region lọc người dùng theo trạng thái
    var activeFilterdiv = document.createElement("div");
    activeFilterdiv.className = "col-3 mb-2 mt-2";
    filterzone.appendChild(activeFilterdiv);

    var activeFilterLabel = document.createElement("Label");
    activeFilterLabel.innerHTML = "Trạng Thái";
    activeFilterLabel.className = "d-block";
    activeFilterdiv.setAttribute("for", "activeFilter");
    activeFilterdiv.appendChild(activeFilterLabel);
    var activeFilter = document.createElement("select");
    activeFilter.classList = "form-select";
    activeFilter.id = "activeFilter";
    activeFilterdiv.appendChild(activeFilter);
    this.#FilterActiveUser(activeFilter);
    //#endregion

    //#region lọc người dùng theo quyền
    var rolesFilterdiv = document.createElement("div");
    rolesFilterdiv.className = "col-3 mb-2 mt-2";
    filterzone.appendChild(rolesFilterdiv);

    var rolesFilterLabel = document.createElement("Label");
    rolesFilterLabel.innerHTML = "Quyền";
    rolesFilterLabel.className = "d-block";
    activeFilterdiv.setAttribute("for", "roleFilter");
    rolesFilterdiv.appendChild(rolesFilterLabel);
    var roleFilter = document.createElement("select");
    roleFilter.classList = "form-select";
    roleFilter.id = "roleFilter";
    rolesFilterdiv.appendChild(roleFilter);
    this.#FilterRoleUser(roleFilter, roledata);
    //#endregion

    //#region lọc người dùng theo ngày bắt đầu
    var date_start_Filterdiv = document.createElement("div");
    date_start_Filterdiv.className = "col-3 mb-2 mt-2";
    filterzone.appendChild(date_start_Filterdiv);

    var date_start_FilterLabel = document.createElement("Label");
    date_start_FilterLabel.innerHTML = "Ngày Bắt Đầu";
    date_start_FilterLabel.className = "d-block";
    date_start_FilterLabel.setAttribute("for", "dateStartFilter");
    date_start_Filterdiv.appendChild(date_start_FilterLabel);
    var date_start_Filter = document.createElement("input");
    date_start_Filter.name = "date_start";
    date_start_Filter.classList = "form-control";
    date_start_Filter.id = "dateStartFilter";
    date_start_Filterdiv.appendChild(date_start_Filter);
    this.#FilterUserByDate(date_start_Filter);

    var date_start_required = document.createElement("p");
    date_start_Filterdiv.appendChild(date_start_required);
    date_start_required.innerText = "định dạng dd/mm/yyyy";
    //#endregion

    //#region lọc người dùng theo ngày kết thúc
    var date_end_Filterdiv = document.createElement("div");
    date_end_Filterdiv.className = "col-3 mb-2 mt-2";
    filterzone.appendChild(date_end_Filterdiv);

    var date_end_FilterLabel = document.createElement("Label");
    date_end_FilterLabel.innerHTML = "Ngày Kết Thúc";
    date_end_FilterLabel.className = "d-block";
    date_end_FilterLabel.setAttribute("for", "dateEndFilter");
    date_end_Filterdiv.appendChild(date_end_FilterLabel);
    var date_end_Filter = document.createElement("input");
    date_end_Filter.name = "date_end";
    date_end_Filter.classList = "form-control";
    date_end_Filter.id = "dateEndFilter";
    date_end_Filterdiv.appendChild(date_end_Filter);
    this.#FilterUserByDate(date_end_Filter);

    var date_end_required = document.createElement("p");
    date_end_Filterdiv.appendChild(date_end_required);
    date_end_required.innerText = "định dạng dd/mm/yyyy";
    //#endregion
  }

  #CategoryFilter(filterzone, rankdata) {
    var clicked = false;
    rankdata.forEach((x) => {
      var button = document.createElement("button");
      filterzone.appendChild(button);
      button.className = "btn btn-light m-2 d-inline p-1 w-25";
      button.id = x.name;
      button.innerText = x.name_vn + " " + x.so_luong;
      button.onclick = async () => {
        if (!clicked) {
          this.callapi.param.set("rank", button.id);
          clicked = !clicked;
        } else {
          this.callapi.param.delete("rank");
          clicked = !clicked;
        }
        for (var i = 0; i < filterzone.childElementCount; i++) {
          if (
            filterzone.children[i].id == this.callapi.param.get("rank") &&
            this.callapi.param.get("rank") != null
          ) {
            filterzone.children[i].className =
              "btn btn-info m-2 d-inline p-1 w-25";
          } else {
            filterzone.children[i].className =
              "btn btn-light m-2 d-inline p-1 w-25";
          }
        }
        this.GenTable(await this.callapi.GetData("phanloaihoc"), "phanloaihoc");
      };
    });
  }

  #searchUser(searchInput, tabletype) {
    searchInput.addEventListener("keyup", async () => {
      this.callapi.param.set("search", searchInput.value);
      this.GenTable(await this.callapi.GetData(tabletype), tabletype);
    });
  }

  #FilterRoleUser(select, roledata) {
    var placeholder = document.createElement("option");
    select.appendChild(placeholder);
    placeholder.value = "";
    placeholder.innerText = "Quyền";
    roledata.forEach((x) => {
      var option = document.createElement("option");
      select.appendChild(option);
      option.value = x.id;
      option.innerText = x.name;
    });

    select.addEventListener("change", async () => {
      select.value != ""
        ? this.callapi.param.set("role_id", select.value)
        : this.callapi.param.delete("role_id");
      this.GenTable(await this.callapi.GetData("users"), "users");
    });
    if (this.callapi.param.get("role_id"))
      for (var i = 0; i < select.childElementCount; i++) {
        select.children[i].value == this.callapi.param.get("role_id")
          ? (select.children[i].selected = true)
          : (select.children[i].selected = false);
      }
  }

  #FilterActiveUser(select) {
    var all = document.createElement("option");
    all.value = "";
    all.text = "tất cả";
    var active = document.createElement("option");
    active.value = 0;
    active.text = "kích hoạt";
    var inactive = document.createElement("option");
    inactive.value = 1;
    inactive.text = "vô hiệu hóa";

    select.appendChild(all);
    select.appendChild(active);
    select.appendChild(inactive);
    select.addEventListener("change", async () => {
      select.value != ""
        ? this.callapi.param.set("inactive", select.value)
        : this.callapi.param.delete("inactive");
      this.GenTable(await this.callapi.GetData("users"), "users");
    });
    if (this.callapi.param.get("inactive"))
      for (var i = 0; i < select.childElementCount; i++) {
        select.children[i].value == this.callapi.param.get("inactive")
          ? (select.children[i].selected = true)
          : (select.children[i].selected = false);
      }
  }

  #FilterUserByDate(DateInput) {
    DateInput.addEventListener("keyup", async (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        DateInput.value != ""
          ? this.callapi.param.set(DateInput.name, DateInput.value)
          : this.callapi.param.delete(DateInput.name);
        this.GenTable(await this.callapi.GetData("users"), "users");
      }
    });

    DateInput.addEventListener("blur", () => {
      this.callapi.param.delete(DateInput.name);
    });
  }

  /**
   *
   * @param {string} data
   * @param {string} tabletype tabletype của bảng user là "users",tabletype của bảng category là "phanloaihoc"
   */
  GenTable(data, tabletype) {
    if (data == null) return;
    this.tableDiv.innerHTML = "";
    switch (tabletype) {
      case "users":
        this.#GenUserTable(data.list);
        this.#bottomtable(data.pagination.total, tabletype);
        break;
      case "phanloaihoc":
        this.#GenCategoryTable(data.list);
        this.#bottomtable(data.pagination.total, tabletype);
        break;
    }
  }

  #GenUserTable(data) {
    var Table = document.createElement("table");
    Table.className = "table mw-100 table-bordered table-hover";
    this.tableDiv.append(Table);
    var tableHeader = document.createElement("thead");
    Table.append(tableHeader);
    var html = "";
    html +=
      "<th>tên hiển thị</th><th>tên đăng nhập</th><th>số điện thoại</th><th>trạng thái</th><th>quyền</th><th>ngày khởi tạo</th><th>hành động</th>";

    tableHeader.innerHTML = html;
    var tableBody = document.createElement("tbody");
    Table.append(tableBody);

    data.forEach((userdata) => {
      let tr = document.createElement("tr");
      tableBody.appendChild(tr);

      let name = document.createElement("td");
      tr.appendChild(name);
      name.innerText = userdata.name;

      let username = document.createElement("td");
      tr.appendChild(username);
      username.innerText = userdata.username;

      let mobile = document.createElement("td");
      tr.appendChild(mobile);
      mobile.innerText = userdata.mobile;

      let inactive = document.createElement("td");
      tr.appendChild(inactive);
      inactive.innerText = !userdata.inactive;

      let role = document.createElement("td");
      tr.appendChild(role);

      userdata.roles.forEach((x) => {
        var span = document.createElement("span");
        span.textContent = x.name;
        span.style.backgroundColor = x.meta.color;
        span.style.color = x.meta["text-color"];
        span.className = "text-nowrap d-block d-lg-inline m-1 p-1 rounded";
        role.appendChild(span);
      });

      let created_at = document.createElement("td");
      tr.appendChild(created_at);
      created_at.innerText = userdata.created_at.substring(0, 10);

      let acctionTd = document.createElement("td");
      tr.appendChild(acctionTd);

      let Updatetd = document.createElement("Button");
      Updatetd.type = "Button";
      acctionTd.appendChild(Updatetd);
      Updatetd.className = "btn m-1 btn-success";
      Updatetd.innerText = "Update";
      Updatetd.onclick = () => {
        this.OpenModal(this.updateUserDialog);
        this.#FillUpdateForm(userdata);
        this.#userId = userdata.id;
      };

      let deleteTd = document.createElement("Button");
      deleteTd.type = "Button";
      acctionTd.appendChild(deleteTd);
      deleteTd.innerText = "delete";
      deleteTd.className = "btn m-1 btn-danger";
      deleteTd.onclick = () => {
        this.OpenModal(this.DeleteUserDialog);
        this.DeleteUserDialog.querySelector(
          ".delete-message"
        ).innerHTML = `Bạn chắc chắn muốn xóa <span class="text-primary">${userdata.username}</span>?.Hoàn động này không thể được hoàn tác.`;
        this.#userId = userdata.id;
      };
    });
  }

  #FillUpdateForm(userdata) {
    document.querySelector("#UpdateNameInput").value = userdata.name;
    document.querySelector("#UpdateUserNameInput").value = userdata.username;
    document.querySelector("#UpdateEmailInput").value = userdata.email;
    document.querySelector("#UpdatePhoneInput").value = userdata.mobile;
    var select = document.querySelector("#UpdateroleId");
    for (var i = 0; i < select.childElementCount; i++) {
      if (select.children[i].value == userdata.role.id) {
        select.children[i].selected = true;
      } else {
        select.children[i].selected = false;
      }
    }
  }

  #GenCategoryTable(data) {
    var Table = document.createElement("table");
    Table.className = "table mw-100 table-bordered table-hover";
    this.tableDiv.append(Table);
    var tableHeader = document.createElement("thead");
    Table.append(tableHeader);
    var html = "";
    html +=
      "<tr><th>uuid</th><th>id</th><th>tên</th><th>tên khoa học</th><th>rank</th><th>rank vn</th><th>loại</th></tr>";

    tableHeader.innerHTML = html;
    var tableBody = document.createElement("tbody");
    Table.append(tableBody);

    data.forEach((data) => {
      let tr = document.createElement("tr");
      tableBody.appendChild(tr);

      let uuid = document.createElement("td");
      tr.appendChild(uuid);
      uuid.innerText = data.uuid;

      let id = document.createElement("td");
      tr.appendChild(id);
      id.innerText = data.id;

      let ten = document.createElement("td");
      tr.appendChild(ten);
      ten.innerText = data.ten;

      let tenkhoahoc = document.createElement("td");
      tr.appendChild(tenkhoahoc);
      tenkhoahoc.innerText = data.ten_khoa_hoc;

      let rank = document.createElement("td");
      tr.appendChild(rank);
      rank.innerText = data.rank;

      let rankvn = document.createElement("td");
      tr.appendChild(rankvn);
      rankvn.innerText = data.rank_vn;

      let type = document.createElement("td");
      tr.appendChild(type);
      type.innerText = data.type;
    });
  }

  #bottomtable(totalData, tabletype) {
    var bottomtablediv = document.createElement("div");
    bottomtablediv.className = "row";
    this.tableDiv.append(bottomtablediv);

    var rowcountdiv = document.createElement("div");
    rowcountdiv.className = "col-5";
    bottomtablediv.append(rowcountdiv);
    var rowcounter = document.createElement("p");
    rowcountdiv.appendChild(rowcounter);
    this.#Countdata(totalData, rowcounter);

    var listwapper = document.createElement("div");
    listwapper.className = "col-5 justify-content-center";
    bottomtablediv.append(listwapper);
    var pagingList = document.createElement("ul");
    listwapper.append(pagingList);
    pagingList.classList.add("pagination");
    this.#pagination(
      pagingList,
      totalData,
      this.callapi.param.get("itemsPerPage"),
      tabletype
    );

    var perpageSelectwapper = document.createElement("div");
    perpageSelectwapper.className = "col-2";
    bottomtablediv.append(perpageSelectwapper);
    var PerpageSelect = document.createElement("select");
    PerpageSelect.className = "form-select";
    perpageSelectwapper.append(PerpageSelect);
    this.#ChangeNumberUserPerPage(PerpageSelect, tabletype);
  }

  #pagination(pagingList, totalData, Perpagevalue, tableType) {
    var pagecount = Math.ceil(totalData / Perpagevalue);
    var currentpage = Number(this.callapi.param.get("page"));
    var prevPage = currentpage - 1;
    var nextPage = currentpage + 1;
    pagingList.innerHTML = "";

    let firstli = document.createElement("li");
    firstli.className = "page-item";
    pagingList.appendChild(firstli);
    let PrevButton = document.createElement("button");
    PrevButton.className = "btn btn-light";
    PrevButton.innerText = "<";
    firstli.appendChild(PrevButton);
    PrevButton.onclick = () => {
      this.#changePagePrevOrNext(-1, tableType);
    };

    if (currentpage > 2) {
      let li = document.createElement("li");
      li.className = "page-item";
      pagingList.append(li);
      let Button = document.createElement("button");
      Button.innerText = 1;
      Button.className = "btn btn-light";
      li.appendChild(Button);
      Button.addEventListener("click", () => {
        this.#LoadPageOnPageNumber(Button.innerText, tableType);
      });
      if (currentpage > 3) {
        let li = document.createElement("li");
        li.className = "page-item";
        pagingList.append(li);
        let Button = document.createElement("button");
        Button.className = "btn btn-light";
        Button.innerText = "...";
        li.appendChild(Button);
      }
    }

    for (var page = prevPage; page <= nextPage; page++) {
      if (page <= pagecount) {
        if (page == 0) continue;

        let li = document.createElement("li");
        li.className = "page-item";
        pagingList.append(li);
        let Button = document.createElement("button");
        Button.innerText = page;
        Button.className = "btn btn-light";
        li.appendChild(Button);
        Button.addEventListener("click", () => {
          this.#LoadPageOnPageNumber(Button.innerText, tableType);
        });
        currentpage == Button.innerText
          ? (Button.className = "btn btn-light active")
          : (Button.className = "btn btn-light");
      }
    }

    if (currentpage < pagecount - 1) {
      if (currentpage < pagecount - 2) {
        let li = document.createElement("li");
        li.className = "page-item";
        pagingList.append(li);
        let Button = document.createElement("button");
        Button.className = "btn btn-light";
        Button.innerText = "...";
        li.appendChild(Button);
      }
      let li = document.createElement("li");
      li.className = "page-item";
      pagingList.append(li);
      let Button = document.createElement("button");
      Button.className = "btn btn-light";
      Button.innerText = pagecount;
      li.appendChild(Button);
      Button.addEventListener("click", () => {
        this.#LoadPageOnPageNumber(Button.innerText, tableType);
      });
    }

    let lastli = document.createElement("li");
    pagingList.appendChild(lastli);
    lastli.className = "page-item";
    let nextButton = document.createElement("button");
    nextButton.className = "btn btn-light";
    nextButton.innerText = ">";
    lastli.appendChild(nextButton);
    nextButton.onclick = () => {
      this.#changePagePrevOrNext(1, tableType);
    };

    this.#checkplusOrMinusPageButton(PrevButton, nextButton, pagecount);
  }

  async #LoadPageOnPageNumber(PageIndex, tableType) {
    this.callapi.param.set("page", PageIndex);
    this.GenTable(await this.callapi.GetData(tableType), tableType);
  }

  async #changePagePrevOrNext(plusOrMinus, tableType) {
    this.callapi.param.set(
      "page",
      Number(this.callapi.param.get("page")) + plusOrMinus
    );
    this.GenTable(await this.callapi.GetData(tableType), tableType);
  }

  #checkplusOrMinusPageButton(PrevButton, nextButton, pagecount) {
    if (this.callapi.param.get("page") == 1) {
      PrevButton.classList.add("d-none");
    } else {
      PrevButton.classList.remove("d-none");
    }

    if (pagecount == this.callapi.param.get("page")) {
      nextButton.classList.add("d-none");
    } else {
      nextButton.classList.remove("d-none");
    }
  }

  #Countdata(maxitems, counter) {
    this.#min =
      this.callapi.param.get("itemsPerPage") * this.callapi.param.get("page") -
      this.callapi.param.get("itemsPerPage") +
      1;
    if (this.callapi.param.get("itemsPerPage") < maxitems) {
      this.#max = this.callapi.param.get("itemsPerPage");
      this.callapi.param.get("page") * this.callapi.param.get("itemsPerPage");
    } else {
      this.#max = maxitems;
    }
    counter.textContent = this.#min + "-" + this.#max + "/" + maxitems;
  }

  #ChangeNumberUserPerPage(PerpageSelect, tableType) {
    var fiveperpage = document.createElement("option");
    fiveperpage.value = 5;
    fiveperpage.text = "5 / trang";
    var tenperpage = document.createElement("option");
    tenperpage.value = 10;
    tenperpage.text = "10 / trang";
    var twentyfiveperpage = document.createElement("option");
    twentyfiveperpage.value = 25;
    twentyfiveperpage.text = "25 / trang";
    var fiftyperpage = document.createElement("option");
    fiftyperpage.value = 50;
    fiftyperpage.text = "50 / trang";

    PerpageSelect.appendChild(fiveperpage);
    PerpageSelect.appendChild(tenperpage);
    PerpageSelect.appendChild(twentyfiveperpage);
    PerpageSelect.appendChild(fiftyperpage);

    for (var i = 0; i < PerpageSelect.childElementCount; i++) {
      PerpageSelect.children[i].value == this.callapi.param.get("itemsPerPage")
        ? (PerpageSelect.children[i].selected = true)
        : (PerpageSelect.children[i].selected = false);
    }
    PerpageSelect.addEventListener("change", async () => {
      this.callapi.param.set("itemsPerPage", PerpageSelect.value);
      this.GenTable(await this.callapi.GetData(tableType), tableType);
    });
  }

  GenRole(roledata, select) {
    var option = document.createElement("option");
    select.appendChild(option);
    option.disabled = true;
    option.selected = true;
    option.innerText = "Chọn Quyền";
    roledata.forEach((x) => {
      var option = document.createElement("option");
      select.appendChild(option);
      option.value = x.id;
      option.innerText = x.name;
    });
  }

  OpenModal(dialogElement) {
    dialogElement.show();
  }

  CloseModal(dialogElement, form) {
    var closebtns = dialogElement.querySelectorAll(".close");
    closebtns.forEach((closebtn) => {
      closebtn.addEventListener("click", () => {
        if (form) {
          var listOfInput = form.querySelectorAll("input");
          listOfInput.forEach((input) => {
            input.value = "";
          });
        }
        dialogElement.close();
      });
    });
    dialogElement.close();
  }

  CallAlert(dialogElement, message) {
    clearTimeout();
    clearInterval();
    dialogElement.show();
    dialogElement.style.animation = "";
    dialogElement.children[0].innerText = message;
    dialogElement.style.animation = "openModal 1s ease-in";
    setTimeout(() => {
      dialogElement.style.animation = "";
      dialogElement.style.animation = "closeModal 1s ease-in";
      dialogElement.addEventListener("animationend", (e) => {
        e.removeEventListener("animationend", dialogElement);
      });
      setTimeout(() => dialogElement.close(), 1000);
    }, 5000);
  }

  GetUserId() {
    return this.#userId;
  }

  modifyUserNavUI(mineinfoId, mineinfodata) {
    var opened = false;
    var userInfo = document.getElementById(mineinfoId);
    userInfo.querySelector("img").src = mineinfodata.avatar_url;
    userInfo.querySelector(".userNameDisplay").innerText =
      mineinfodata.username;
    var userModal = userInfo.querySelector("dialog");
    userInfo.querySelector("button").addEventListener("click", () => {
      if (opened) {
        userModal.show();
        opened = !opened;
      } else {
        userModal.close();
        opened = !opened;
      }
    });

    userModal.querySelector("img").src = mineinfodata.avatar_url;
    userModal.querySelector(".userNameDisplay").innerText =
      mineinfodata.username;
    var userRoleDisplay = userModal.querySelector(".userRoleDisplay");
    userRoleDisplay.innerText = mineinfodata.role.name;
    userRoleDisplay.style.backgroundColor = mineinfodata.role.meta.color;
    userRoleDisplay.style.color = mineinfodata.role.meta["text-color"];
    userRoleDisplay.className = "p-1 rounded";
    document.getElementById("userProfilebtn").addEventListener("click", () => {
      window.location = "user-info.html";
    });
  }

  genEditUserForm(mineinfoData, containerid, formtype) {
    document.querySelector(containerid).innerHTML = "";

    var form = document.createElement("form");
    form.id = "changeProfile";
    document.querySelector(containerid).append(form);

    var bigwapper = document.createElement("div");
    form.append(bigwapper);

    switch (formtype) {
      case "me":
        this.#GenProfile(mineinfoData, bigwapper, form);
        break;
      case "me/password":
        this.#GenChangePass(bigwapper, form);
        break;
    }
    return form;
  }

  #GenProfile(mineinfoData, bigwapper, form) {
    var displayNameWapper = document.createElement("div");
    displayNameWapper.className = "form-group mt-2 d-flex flex-column";
    bigwapper.appendChild(displayNameWapper);

    var displayNamelabel = document.createElement("label");
    displayNameWapper.appendChild(displayNamelabel);
    displayNamelabel.innerText = "tên hiển thị";

    var displayNameInput = document.createElement("input");
    displayNameWapper.appendChild(displayNameInput);
    displayNameInput.name = "name";
    displayNameInput.value = mineinfoData.name;

    var displayNameMessage = document.createElement("span");
    displayNameWapper.appendChild(displayNameMessage);
    displayNameMessage.className = "form-message";
    //////////////////////////////////////////////////////////////////////////
    var displayPhoneWapper = document.createElement("div");
    displayPhoneWapper.className = "form-group d-flex flex-column";
    bigwapper.appendChild(displayPhoneWapper);

    var displayPhonelabel = document.createElement("label");
    displayPhoneWapper.appendChild(displayPhonelabel);
    displayPhonelabel.innerText = "tên hiển thị";

    var displayPhoneInput = document.createElement("input");
    displayPhoneWapper.appendChild(displayPhoneInput);
    displayPhoneInput.name = "mobile";
    displayPhoneInput.type = "number";
    displayPhoneInput.value = mineinfoData.mobile;

    var displayPhoneMessage = document.createElement("span");
    displayPhoneWapper.appendChild(displayPhoneMessage);
    displayPhoneMessage.className = "form-message";

    var SubmitBtn = document.createElement("button");
    form.appendChild(SubmitBtn);
    SubmitBtn.type = "submit";
    SubmitBtn.className = "btn btn-success mt-3";
    SubmitBtn.innerText = "Lưu";
  }

  #GenChangePass(bigwapper, form) {
    var oldPasswordWapper = document.createElement("div");
    oldPasswordWapper.className = "form-group mt-2 d-flex flex-column";
    bigwapper.appendChild(oldPasswordWapper);

    var oldPasswordlabel = document.createElement("label");
    oldPasswordWapper.appendChild(oldPasswordlabel);
    oldPasswordlabel.innerText = "Mật Khẩu Cũ";

    var oldPasswordInput = document.createElement("input");
    oldPasswordWapper.appendChild(oldPasswordInput);
    oldPasswordInput.name = "old_password";

    var oldPasswordMessage = document.createElement("span");
    oldPasswordWapper.appendChild(oldPasswordMessage);
    oldPasswordMessage.className = "form-message";
    //////////////////////////////////////////////////////////////////////////
    var newPasswordWapper = document.createElement("div");
    newPasswordWapper.className = "form-group d-flex flex-column";
    bigwapper.appendChild(newPasswordWapper);

    var newPasswordlabel = document.createElement("label");
    newPasswordWapper.appendChild(newPasswordlabel);
    newPasswordlabel.innerText = "Mật khẩu mới";

    var newPasswordInput = document.createElement("input");
    newPasswordWapper.appendChild(newPasswordInput);
    newPasswordInput.name = "password";

    var newPasswordMessage = document.createElement("span");
    newPasswordWapper.appendChild(newPasswordMessage);
    newPasswordMessage.className = "form-message";
    //////////////////////////////////////////////////////////////////////////
    var newPasswordConfirmWapper = document.createElement("div");
    newPasswordConfirmWapper.className = "form-group d-flex flex-column";
    bigwapper.appendChild(newPasswordConfirmWapper);

    var newPasswordConfirmlabel = document.createElement("label");
    newPasswordConfirmWapper.appendChild(newPasswordConfirmlabel);
    newPasswordConfirmlabel.innerText = "xác nhận lại mật khẩu mới";

    var newPasswordConfirmInput = document.createElement("input");
    newPasswordConfirmWapper.appendChild(newPasswordConfirmInput);
    newPasswordConfirmInput.name = "password_confirmation";

    var newPasswordConfirmMessage = document.createElement("span");
    newPasswordConfirmWapper.appendChild(newPasswordConfirmMessage);
    newPasswordConfirmMessage.className = "form-message";

    var SubmitBtn = document.createElement("button");
    form.appendChild(SubmitBtn);
    SubmitBtn.type = "submit";
    SubmitBtn.className = "btn btn-success mt-3";
    SubmitBtn.innerText = "Lưu";
  }
}
