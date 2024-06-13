<template>
  <h3>Master User</h3>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link class="navbar-brand" to="/">Home</router-link>
      </li>
      <li class="breadcrumb-item active" aria-current="page">Master User</li>
    </ol>
  </nav>
  <ul class="nav nav-tabs" id="myTab" role="tablist">
    <!-- Display Data tab -->
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        :class="{ active: activeTab === 'displayData' }"
        id="displayData-tab"
        data-bs-toggle="tab"
        data-bs-target="#displayData-tab-pane"
        type="button"
        role="tab"
        aria-controls="displayData-tab-pane"
        aria-selected="activeTab === 'displayData'"
        @click="activeTab = 'displayData'"
      >
        <font-awesome-icon icon="fa-solid fa-database" size="2x" />
      </button>
    </li>

    <!-- Modify Data tab -->
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        :class="{ active: activeTab === 'modifyData' }"
        id="modifyData-tab"
        data-bs-toggle="tab"
        data-bs-target="#modifyData-tab-pane"
        type="button"
        role="tab"
        aria-controls="modifyData-tab-pane"
        aria-selected="activeTab === 'modifyData'"
        @click="activeTab = 'modifyData'"
      >
        <font-awesome-icon icon="fa-solid fa-screwdriver-wrench" size="2x" />
      </button>
    </li>
  </ul>
  <div class="tab-content" id="myTabContent">
    <!-- Display Data content -->
    <div
      class="tab-pane fade tabs-style"
      :class="{ 'show active': activeTab === 'displayData' }"
      id="displayData-tab-pane"
      role="tabpanel"
      aria-labelledby="displayData-tab"
      tabindex="0"
    >
      <div>
        <button
          @click="enterMode('modifyData')"
          class="btn btn-primary"
          :disabled="isModifyMode"
        >
          Add
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>

        <DataTable
          class="table table-hover table-striped"
          width="100%"
          :data="allData"
          :columns="allcolumns"
          :options="options"
          ref="table"
        >
        </DataTable>
      </div>
    </div>

    <!-- Modify Data content-->
    <div
      class="tab-pane fade tabs-style"
      :class="{ 'show active': activeTab === 'modifyData' }"
      id="modifyData-tab-pane"
      role="tabpanel"
      aria-labelledby="modifyData-tab"
      tabindex="0"
    >
      <form>
        <div class="row">
          <div class="col-6">
            <div class="mb-3">
              <label for="userID" class="form-label tabs-modify">User ID</label>
              <input
                type="text"
                class="form-control"
                id="userID"
                placeholder="Input User ID"
                autocomplete="off"
                v-model="userID"
                maxlength="50"
                :disabled="isUserIDdisabled"
                @keydown.enter="submitData"
              />
            </div>
            <div class="mb-3">
              <label for="userName" class="form-label tabs-modify"
                >User Name</label
              >
              <input
                type="text"
                class="form-control"
                id="userName"
                placeholder="Input User Name"
                autocomplete="off"
                v-model="userName"
                maxlength="200"
                :disabled="!isModifyMode"
                @keydown.enter="submitData"
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label tabs-modify"
                >Password</label
              >
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Input Password"
                autocomplete="off"
                v-model="password"
                maxlength="200"
                :disabled="!isModifyMode"
                @keydown.enter="submitData"
              />
              <br />
              <input
                type="password"
                class="form-control"
                id="repassword"
                placeholder="Input reconfim Password"
                autocomplete="off"
                v-model="repassword"
                maxlength="200"
                :disabled="!isModifyMode"
                @keydown.enter="submitData"
              />
            </div>

            <button
              @click="onBtnBackClick"
              class="btn btn-outline-warning"
              style="margin-right: 4px"
              :disabled="!isModifyMode"
            >
              Back
            </button>
            <button
              @click="submitData"
              :disabled="!isModifyMode"
              class="btn btn-outline-primary"
            >
              Submit
            </button>
          </div>
          <div class="col-6">
            <div class="mb-3">
              <label for="deptID" class="form-label tabs-modify">Dept</label>
              <select
                id="deptID"
                v-model="deptID"
                class="form-select"
                :disabled="!isModifyMode"
              >
                <option v-if="!deptID" value="" disabled>Select Dept</option>
                <option
                  v-for="option in deptIDList"
                  :key="option.deptDesc"
                  :value="option.deptID"
                >
                  {{ option.deptDesc }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="groupID" class="form-label tabs-modify">Group</label>
              <select
                id="groupID"
                v-model="groupID"
                class="form-select"
                :disabled="!isModifyMode"
              >
                <option v-if="!groupID" value="" disabled>Select Group</option>
                <option
                  v-for="option in groupIDList"
                  :key="option.groupDesc"
                  :value="option.groupID"
                >
                  {{ option.groupDesc }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="postLimitID" class="form-label tabs-modify"
                >Post Limit</label
              >
              <select
                id="postLimitID"
                v-model="postLimitID"
                class="form-select"
                :disabled="!isModifyMode"
              >
                <option v-if="!postLimitID" value="" disabled>
                  Select Post Limit
                </option>
                <option
                  v-for="option in postLimitIDList"
                  :key="option.postLimitID"
                  :value="option.postLimitID"
                >
                  {{ option.postLimitID }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// import Datatable
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-bs5";
import "datatables.net-fixedcolumns";
import "datatables.net-select";
import moment from "moment";

DataTable.use(DataTablesCore);

const table = ref();
</script>

<script>
import {
  getData,
  insertData,
  updateData,
  deleteData,
} from "@/components/js-file/user";
import { getData as getPostLimitData } from "@/components/js-file/postLimit";
import { getData as getGroupData } from "@/components/js-file/group";
import { useRouter } from "vue-router";

export default {
  name: "User",
  components: {
    DataTable,
  },
  data() {
    return {
      userID: "",
      userName: "",
      groupID: "",
      groupIDList: [],
      deptIDList: [
        { deptID: "Admin", deptDesc: "Admin" },
        { deptID: "User", deptDesc: "User" },
      ],
      password: "",
      repassword: "",
      deptID: "",
      postLimitID: "",
      postLimitIDList: [],
      activeTab: "displayData",
      isModifyMode: false,
      isUserIDdisabled: true,
      isEditData: false,
      allcolumns: [
        { title: "User ID", data: "userID" },
        { title: "User Name", data: "userName" },
        { title: "Dept", data: "dept" },
        { title: "Group ID", data: "groupID" },
        { title: "PostLimit ID", data: "postLimitID" },
        { title: "Created By", data: "createdBy" },
        {
          title: "Created Date",
          data: "createdDate",
          render: (data) => {
            if (data == null) {
              return "";
            }
            const formattedDatetime = moment(data).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            return formattedDatetime;
          },
        },
        { title: "Updated By", data: "updatedBy" },
        {
          title: "Updated Date",
          data: "updatedDate",
          render: (data) => {
            if (data == null) {
              return "";
            }
            const formattedDatetime = moment(data).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            return formattedDatetime;
          },
        },
        {
          title: "Actions",
          data: null,
          defaultContent: "", // to avoid errors if data is null
          orderable: false,
          searchable: false,
          width: "150px",
          render: (data, type, row) => {
            const editID = "edit_" + data.userID.replace(/\s+/g, "");
            const deleteID = "delete_" + data.userID.replace(/\s+/g, "");

            return `
              <button class="btn btn-sm btn-primary" id="${editID}" data-id="${data.userID}" >Edit </button>
              <button class="btn btn-sm btn-danger" id="${deleteID}" data-id="${data.userID}" >Delete </button>
            `;
          },
        },
      ],
      allData: [],
      options: {
        scrollX: true,
      },
    };
  },
  setup() {
    const router = useRouter();

    return { router };
  },
  methods: {
    enterMode(mode) {
      if (mode == "modifyData") {
        this.activeTab = "modifyData";
        this.isModifyMode = true;
        this.enableDisabledButton(true);
        this.isUserIDdisabled = false;
      } else {
        this.activeTab = "displayData";
        this.isModifyMode = false;
        this.enableDisabledButton(false);
        this.isUserIDdisabled = true;
      }
    },
    clearModifyScreen() {
      this.userID = "";
      this.userName = "";
      this.password = "";
      this.repassword = "";
      this.deptID = "";
      this.groupID = "";
      this.postLimitID = "";
    },
    onBtnBackClick() {
      this.clearModifyScreen();
      this.enterMode("displayData");
      this.isEditData = false;
    },
    async getPostLimitList() {
      try {
        var response = await getPostLimitData();

        if (response == "ERR_NETWORK") {
          this.$swal.fire({
            icon: "warning",
            title: "Network",
            text: "Network error when access the server, please try again later or try to relogin !",
            showConfirmButton: true,
          });
          return;
        }

        if (response != "undefined") {
          if (response.isSuccess) {
            this.postLimitIDList = [];
            //Load data to datatable
            this.postLimitIDList = response.content;
          } else {
            this.$swal.fire({
              icon: "warning",
              title: "Error",
              text: response.message,
              showConfirmButton: true,
            });
          }
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }
    },
    async getGroupList() {
      try {
        var response = await getGroupData();

        if (response == "ERR_NETWORK") {
          this.$swal.fire({
            icon: "warning",
            title: "Network",
            text: "Network error when access the server, please try again later or try to relogin !",
            showConfirmButton: true,
          });
          return;
        }

        if (response != "undefined") {
          if (response.isSuccess) {
            this.groupIDList = [];
            //Load data to datatable
            this.groupIDList = response.content;
          } else {
            this.$swal.fire({
              icon: "warning",
              title: "Error",
              text: response.message,
              showConfirmButton: true,
            });
          }
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }
    },
    async getData() {
      try {
        var response = await getData();

        if (response == "ERR_NETWORK") {
          this.$swal.fire({
            icon: "warning",
            title: "Network",
            text: "Network error when access the server, please try again later or try to relogin !",
            showConfirmButton: true,
          });
          return;
        }

        if (response != "undefined") {
          if (response.isSuccess) {
            this.allData = [];
            //Load data to datatable
            this.allData = response.content;
          } else {
            this.$swal.fire({
              icon: "warning",
              title: "Error",
              text: response.message,
              showConfirmButton: true,
            });
          }
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }
    },
    async submitData() {
      try {
        // validation
        if (this.userID === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master User",
            text: "please input User ID",
            showConfirmButton: true,
          });
          return;
        } else if (this.userName === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master User",
            text: "please input User Name",
            showConfirmButton: true,
          });
          return;
        } else if (this.password !== this.repassword) {
          this.$swal.fire({
            icon: "info",
            title: "Master User",
            text: "please input password correctly",
            showConfirmButton: true,
          });
          return;
        } else if (this.deptID === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master User",
            text: "please select Dept",
            showConfirmButton: true,
          });
          return;
        } else if (this.groupID === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master User",
            text: "please select Group",
            showConfirmButton: true,
          });
          return;
        } else if (this.postLimitID === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master User",
            text: "please select Post Limit",
            showConfirmButton: true,
          });
          return;
        }

        var paramList = [
          {
            userID: this.userID,
            userName: this.userName,
            dept: this.deptID,
            password: this.password,
            groupID: this.groupID,
            postLimitID: this.postLimitID,
          },
        ];

        if (this.isEditData) {
          //Update data
          await this.updateData(paramList);
        } else {
          //Insert new data
          var response = await insertData(paramList);

          if (response == "ERR_NETWORK") {
            this.$swal.fire({
              icon: "warning",
              title: "Network",
              text: "Network error when access the server, please try again later or try to relogin !",
              showConfirmButton: true,
            });
            return;
          }

          if (response.isSuccess) {
            this.$swal.fire({
              position: "top-right",
              icon: "success",
              title: "Master User",
              text: "Data submitted",
              showConfirmButton: false,
              timer: 800,
            });

            this.clearModifyScreen();
            this.enterMode("displayData");
            this.getData();
          } else {
            this.$swal.fire({
              icon: "warning",
              title: "Error",
              text: response.message,
              showConfirmButton: true,
            });
          }
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }
    },
    async editData(userID) {
      try {
        //set isEditData as true
        this.isEditData = true;

        //retrieve data to modify screen
        const filteredData = this.allData.filter(
          (data) => data.userID === userID
        );

        this.userID = filteredData[0].userID;
        this.userName = filteredData[0].userName;
        this.deptID = filteredData[0].dept;
        this.groupID = filteredData[0].groupID;
        this.postLimitID = filteredData[0].postLimitID;

        this.enterMode("modifyData");
        this.isUserIDdisabled = true;
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }
    },
    async updateData(paramList) {
      try {
        var response = await updateData(paramList);

        if (response == "ERR_NETWORK") {
          this.$swal.fire({
            icon: "warning",
            title: "Network",
            text: "Network error when access the server, please try again later or try to relogin !",
            showConfirmButton: true,
          });
          return;
        }

        if (response.isSuccess) {
          this.$swal.fire({
            position: "top-right",
            icon: "success",
            title: "Master User",
            text: "Data updated",
            showConfirmButton: false,
            timer: 800,
          });

          this.clearModifyScreen();
          this.enterMode("displayData");
          this.getData();
        } else {
          this.$swal.fire({
            icon: "warning",
            title: "Error",
            text: response.message,
            showConfirmButton: true,
          });
        }

        //set isEditData as false
        this.isEditData = false;
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }
    },
    async deleteData(groupID) {
      try {
        var response = await deleteData(groupID);

        if (response == "ERR_NETWORK") {
          this.$swal.fire({
            icon: "warning",
            title: "Network",
            text: "Network error when access the server, please try again later or try to relogin !",
            showConfirmButton: true,
          });
          return;
        }

        if (response.isSuccess) {
          this.$swal.fire({
            position: "top-right",
            icon: "success",
            title: "Master User",
            text: "Data deleted",
            showConfirmButton: false,
            timer: 800,
          });
          await this.getData();
        } else {
          this.$swal.fire({
            icon: "warning",
            title: "Error",
            text: response.message,
            showConfirmButton: true,
          });
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }
    },
    enableDisabledButton(isDisabled) {
      // Extract all form ID values
      const IDList = this.allData.map((item) => item.groupID);

      for (let index = 0; index < IDList.length; index++) {
        const editID = "edit_" + IDList[index].replace(/\s+/g, "");
        const deleteID = "delete_" + IDList[index].replace(/\s+/g, "");

        var editButton = document.getElementById(editID);
        var deleteButton = document.getElementById(deleteID);

        if (editButton != null) {
          editButton.disabled = isDisabled;
        }

        if (deleteButton != null) {
          deleteButton.disabled = isDisabled;
        }
      }
    },
    setEventForMainTable() {
      // set event for edit or delete onclick in datatable
      const tableElement = this.$refs.table.$el;

      tableElement.addEventListener("click", (event) => {
        const editButton = event.target.closest(".btn-primary");
        const deleteButton = event.target.closest(".btn-danger");

        if (editButton) {
          const rowId = editButton.getAttribute("data-id");
          this.editData(rowId);
        }

        if (deleteButton) {
          const rowId = deleteButton.getAttribute("data-id");

          this.$swal
            .fire({
              title: "Master User",
              text:
                "Are you sure to delete data with User ID '" + rowId + "' ?",
              showDenyButton: true,
              showCancelButton: false,
              confirmButtonText: "Yes",
              denyButtonText: `No`,
            })
            .then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                this.deleteData(rowId);
              } else if (result.isDenied) {
                // do nothing
              }
            });
        }
      });
    },
  },
  mounted() {
    //get and load data
    this.getData();
    this.getPostLimitList();
    this.getGroupList();
    this.setEventForMainTable();
  },
};
</script>

<style>
@import "bootstrap";
@import "datatables.net-bs5";
</style>
