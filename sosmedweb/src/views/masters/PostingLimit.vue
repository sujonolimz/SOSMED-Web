<template>
  <h3>{{ formDesc }}</h3>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link class="navbar-brand" to="/">Home</router-link>
      </li>
      <li class="breadcrumb-item active" aria-current="page">
        {{ formDesc }}
      </li>
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
            <label for="postLimitID" class="form-label tabs-modify"
              >Post Limit ID</label
            >
            <input
              type="text"
              class="form-control"
              id="postLimitID"
              placeholder="Input Post Limit ID"
              autocomplete="off"
              v-model="postLimitID"
              maxlength="50"
              :disabled="isPostLimitIDdisabled"
            />
          </div>
          <div class="mb-3">
            <label for="postLimitValue" class="form-label tabs-modify"
              >Post Limit Value</label
            >
            <input
              type="number"
              min="0"
              step="1"
              class="form-control"
              id="postLimitValue"
              placeholder="Input Post Limit Value"
              autocomplete="off"
              v-model="postLimitValue"
              maxlength="200"
              :disabled="!isModifyMode"
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
} from "@/components/js-file/postLimit";
import { getFormDescData } from "@/components/js-file/form";
import { useRouter } from "vue-router";

export default {
  name: "Post Limit",
  components: {
    DataTable,
  },
  data() {
    return {
      postLimitID: "",
      postLimitValue: "",
      formDesc: "Post Limit",
      activeTab: "displayData",
      isModifyMode: false,
      isPostLimitIDdisabled: true,
      isEditData: false,
      allcolumns: [
        { title: "No", data: "no" },
        { title: "Post Limit ID", data: "postLimitID" },
        { title: "Post Limit Value", data: "postLimitValue" },
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
            const editID = "edit_" + data.postLimitID.replace(/\s+/g, "");
            const deleteID = "delete_" + data.postLimitID.replace(/\s+/g, "");

            return `
              <button class="btn btn-sm btn-primary" id="${editID}" data-id="${data.postLimitID}" >Edit <i class="fas fa-edit"></i></button>
              <button class="btn btn-sm btn-danger" id="${deleteID}" data-id="${data.postLimitID}" >Delete <font-awesome-icon icon="fa-solid fa-trash"/></button>
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
        this.isPostLimitIDdisabled = false;
      } else {
        this.activeTab = "displayData";
        this.isModifyMode = false;
        this.enableDisabledButton(false);
        this.isPostLimitIDdisabled = true;
      }
    },
    clearModifyScreen() {
      this.postLimitID = "";
      this.postLimitValue = "";
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
        if (this.postLimitID === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master Post Limit",
            text: "please input Post Limit ID",
            showConfirmButton: true,
          });
          return;
        } else if (this.postLimitValue === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master Post Limit",
            text: "please input Post Limit Value",
            showConfirmButton: true,
          });
          return;
        }

        if (this.isEditData) {
          //Update data
          await this.updateData(this.postLimitID, this.postLimitValue);
        } else {
          //Insert new data
          var response = await insertData(
            this.postLimitID,
            this.postLimitValue
          );

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
              title: "Master Post Limit",
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
    async editData(postLimitID) {
      try {
        //set isEditData as true
        this.isEditData = true;

        //retrieve data to modify screen
        const filteredData = this.allData.filter(
          (data) => data.postLimitID === postLimitID
        );

        this.postLimitID = filteredData[0].postLimitID;
        this.postLimitValue = filteredData[0].postLimitValue;

        this.enterMode("modifyData");
        this.isPostLimitIDdisabled = true;
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }
    },
    async updateData(postLimitID, postLimitValue) {
      try {
        var response = await updateData(postLimitID, postLimitValue);

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
            title: "Master Post Limit",
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
    async deleteData(postLimitID) {
      try {
        var response = await deleteData(postLimitID);

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
            title: "Master Post Limit",
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
      const IDList = this.allData.map((item) => item.postLimitID);

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
              title: "Master Post Limit",
              text:
                "Are you sure to delete data with Post Limit ID '" +
                rowId +
                "' ?",
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
    async getFormDescData() {
      try {
        var response = await getFormDescData("TPostingLimit");

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
            //Load data to datatable
            this.formDesc = response.formDesc;
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
  },
  mounted() {
    //get and load data
    this.getData();
    this.setEventForMainTable();
    this.getFormDescData();
  },
};
</script>

<style>
@import "bootstrap";
@import "datatables.net-bs5";
</style>
