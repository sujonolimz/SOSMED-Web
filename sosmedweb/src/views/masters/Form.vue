<template>
  <h3>{{ formTitleDesc }}</h3>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link class="navbar-brand" to="/">Home</router-link>
      </li>
      <li class="breadcrumb-item active" aria-current="page">{{ formTitleDesc }}</li>
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
            <label for="formID" class="form-label tabs-modify">Form ID</label>
            <input
              type="text"
              class="form-control"
              id="formID"
              placeholder="Input Form ID"
              autocomplete="off"
              v-model="formID"
              maxlength="50"
              :disabled="isFormIDdisabled"
            />
          </div>
          <div class="mb-3">
            <label for="formDesc" class="form-label tabs-modify"
              >Form Description</label
            >
            <input
              type="text"
              class="form-control"
              id="formDesc"
              placeholder="Input Form Description"
              autocomplete="off"
              v-model="formDesc"
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
  getFormDescData,
} from "@/components/js-file/form";
import { useRouter } from "vue-router";

export default {
  name: "Form",
  components: {
    DataTable,
  },
  data() {
    return {
      formID: "",
      formDesc: "",
      formTitleDesc: "Form",
      activeTab: "displayData",
      isModifyMode: false,
      isFormIDdisabled: true,
      isEditData: false,
      allcolumns: [
        { title: "No", data: "no" },
        { title: "Form ID", data: "formID" },
        { title: "Form Desc", data: "formDesc" },
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
            const editID = "edit_" + data.formID.replace(/\s+/g, "");
            const deleteID = "delete_" + data.formID.replace(/\s+/g, "");

            return `
              <button class="btn btn-sm btn-primary" id="${editID}" data-id="${data.formID}" >Edit <i class="fas fa-edit"></i></button>
              <button class="btn btn-sm btn-danger" id="${deleteID}" data-id="${data.formID}" >Delete <font-awesome-icon icon="fa-solid fa-trash" size="2x" /></button>
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
        this.isFormIDdisabled = false;
      } else {
        this.activeTab = "displayData";
        this.isModifyMode = false;
        this.enableDisabledButton(false);
        this.isFormIDdisabled = true;
      }
    },
    clearModifyScreen() {
      this.formID = "";
      this.formDesc = "";
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
        if (this.formID === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master Form",
            text: "please input Form ID",
            showConfirmButton: true,
          });
          return;
        } else if (this.formDesc === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master Form",
            text: "please input Form Description",
            showConfirmButton: true,
          });
          return;
        }

        if (this.isEditData) {
          //Update data
          await this.updateData(this.formID, this.formDesc);
        } else {
          //Insert new data
          var response = await insertData(this.formID, this.formDesc);

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
              title: "Master Form",
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
    async editData(formID) {
      try {
        //set isEditData as true
        this.isEditData = true;

        //retrieve data to modify screen
        const filteredData = this.allData.filter(
          (data) => data.formID === formID
        );

        this.formID = filteredData[0].formID;
        this.formDesc = filteredData[0].formDesc;

        this.enterMode("modifyData");
        this.isFormIDdisabled = true;
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }
    },
    async updateData(formID, formDesc) {
      try {
        var response = await updateData(formID, formDesc);

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
            title: "Master Form",
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
    async deleteData(formID) {
      try {
        var response = await deleteData(formID);

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
            title: "Master Form",
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
      const allFormID = this.allData.map((item) => item.formID);

      for (let index = 0; index < allFormID.length; index++) {
        const editID = "edit_" + allFormID[index].replace(/\s+/g, "");
        const deleteID = "delete_" + allFormID[index].replace(/\s+/g, "");

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
              title: "Master Form",
              text:
                "Are you sure to delete data with Form ID '" + rowId + "' ?",
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
        var response = await getFormDescData("TForm");

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
            this.formTitleDesc = response.formDesc;
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
    this.getFormDescData();

    // set event for edit or delete onclick in datatable
    this.setEventForMainTable();
  },
};
</script>

<style>
@import "bootstrap";
@import "datatables.net-bs5";
</style>
