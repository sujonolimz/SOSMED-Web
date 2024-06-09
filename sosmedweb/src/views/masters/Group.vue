<template>
  <h3>Master Group</h3>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link class="navbar-brand" to="/">Home</router-link>
      </li>
      <li class="breadcrumb-item active" aria-current="page">Master Group</li>
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
      <div>
        <div class="col-6">
          <div class="mb-3">
            <label for="groupID" class="form-label tabs-modify">Group ID</label>
            <input
              type="text"
              class="form-control"
              id="groupID"
              placeholder="Input Group ID"
              autocomplete="off"
              v-model="groupID"
              maxlength="50"
              :disabled="isGroupIDdisabled"
              @keydown.enter="submitData"
            />
          </div>
          <div class="mb-3">
            <label for="groupDesc" class="form-label tabs-modify"
              >Group Description</label
            >
            <input
              type="text"
              class="form-control"
              id="groupDesc"
              placeholder="Input Group Description"
              autocomplete="off"
              v-model="groupDesc"
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
      </div>
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
} from "@/components/js-file/group";
import { useRouter } from "vue-router";

export default {
  name: 'Group',
  components: {
    DataTable,
  },
  data() {
    return {
      groupID: "",
      groupDesc: "",
      activeTab: "displayData",
      isModifyMode: false,
      isGroupIDdisabled: true,
      isEditData: false,
      allcolumns: [
        { title: "Group ID", data: "groupID" },
        { title: "Group Desc", data: "groupDesc" },
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
            const editID = "edit_" + data.groupID.replace(/\s+/g, "");
            const deleteID = "delete_" + data.groupID.replace(/\s+/g, "");

            return `
              <button class="btn btn-sm btn-primary" id="${editID}" data-id="${data.groupID}" >Edit <i class="fas fa-edit"></i></button>
              <button class="btn btn-sm btn-danger" id="${deleteID}" data-id="${data.groupID}" >Delete <font-awesome-icon icon="fa-solid fa-trash"/></button>
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
        this.isGroupIDdisabled = false;
      } else {
        this.activeTab = "displayData";
        this.isModifyMode = false;
        this.enableDisabledButton(false);
        this.isGroupIDdisabled = true;
      }
    },
    clearModifyScreen() {
      this.groupID = "";
      this.groupDesc = "";
    },
    onBtnBackClick() {
      this.clearModifyScreen();
      this.enterMode("displayData");
      this.isEditData = false;
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
        if (this.groupID === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master Group",
            text: "please input Group ID",
            showConfirmButton: true,
          });
          return;
        } else if (this.groupDesc === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master Group",
            text: "please input Group Description",
            showConfirmButton: true,
          });
          return;
        }

        if (this.isEditData) {
          //Update data
          await this.updateData(this.groupID, this.groupDesc);
        } else {
          //Insert new data
          var response = await insertData(this.groupID, this.groupDesc);

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
              title: "Master Group",
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
    async editData(groupID) {
      try {
        //set isEditData as true
        this.isEditData = true;

        //retrieve data to modify screen
        const filteredData = this.allData.filter(
          (data) => data.groupID === groupID
        );

        this.groupID = filteredData[0].groupID;
        this.groupDesc = filteredData[0].groupDesc;

        this.enterMode("modifyData");
        this.isGroupIDdisabled = true;
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }
    },
    async updateData(groupID, groupDesc) {
      try {
        var response = await updateData(groupID, groupDesc);

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
            title: "Master Group",
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
            title: "Master Group",
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
        console.log(error);
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
  },
  mounted() {
    //get and load data
    this.getData();

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
            title: "Master Group",
            text: "Are you sure to delete data with Group ID '" + rowId + "' ?",
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
};
</script>

<style>
@import "bootstrap";
@import "datatables.net-bs5";
</style>

  