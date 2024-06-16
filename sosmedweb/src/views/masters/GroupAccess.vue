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
          @click="onAddBtnClick"
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
        <div class="col-12">
          <div class="mb-3 col-6">
            <label for="groupID" class="form-label tabs-modify">Group</label>
            <!-- <input
              type="text"
              class="form-control"
              id="groupID"
              placeholder="Input Group ID"
              autocomplete="off"
              v-model="groupID"
              maxlength="50"
              :disabled="isGroupIDdisabled"
              @keydown.enter="submitData"
            /> -->

            <select
              id="groupID"
              v-model="groupID"
              class="form-select"
              :disabled="isGroupIDdisabled"
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
          <!-- <div class="mb-3 col-6">
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
          </div> -->

          <div class="row">
            <div class="mb-3 col-6">
              <label class="form-label tabs-modify"
                >No Have Access Form List</label
              >
              <DataTable
                class="table table-hover table-striped"
                width="100%"
                :data="notHaveAccFormList"
                :columns="notHaveAccFormColumns"
                :options="notHaveAccFormOptions"
                ref="tableAllDefForm"
              >
              </DataTable>
            </div>

            <div class="mb-3 col-6">
              <label class="form-label tabs-modify"
                >Have Access Form List</label
              >
              <DataTable
                class="table table-hover table-striped"
                width="100%"
                :data="HaveAccFormList"
                :columns="HaveAccFormColumns"
                :options="HaveAccFormOptions"
                ref="tableAllAccForm"
              >
              </DataTable>
            </div>
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
const tableAllDefForm = ref();
const tableAllAccForm = ref();
</script>

<script>
import {
  getData,
  getDetailData,
  insertData,
  deleteData,
} from "@/components/js-file/groupAccess";
import { getData as getGroupData } from "@/components/js-file/group";
import { getData as getFormData, getFormDescData } from "@/components/js-file/form";
import { useRouter } from "vue-router";

export default {
  name: "Group Access",
  components: {
    DataTable,
  },
  data() {
    return {
      groupIDList: [],
      groupID: "",
      groupDesc: "",
      formDesc: "Group Access",
      activeTab: "displayData",
      isModifyMode: false,
      isGroupIDdisabled: true,
      isEditData: false,
      allcolumns: [
        { title: "No", data: "no" },
        { title: "Group ID", data: "groupID" },
        { title: "Group Desc", data: "groupDesc" },
        { title: "Updated By", data: "createdBy" },
        {
          title: "Updated Date",
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
      defaultFormList: [],
      notHaveAccFormList: [],
      notHaveAccFormColumns: [
        { title: "Form ID", data: "formID" },
        { title: "Form Desc", data: "formDesc" },
        {
          title: "Actions",
          data: null,
          defaultContent: "", // to avoid errors if data is null
          orderable: false,
          searchable: false,
          // width: "150px",
          render: (data, type, row) => {
            const formID = "edit_" + data.formID.replace(/\s+/g, "");
            console.log(data.formID);
            return `
              <button class="btn btn-sm btn-primary" id="${formID}" data-id="${data.formID}" >Have Access <i class="fas fa-edit"></i></button>
            `;
          },
        },
      ],
      notHaveAccFormOptions: {
        paging: false,
        lengthMenu: false,
      },
      HaveAccFormList: [],
      HaveAccFormColumns: [
        { title: "Form ID", data: "formID" },
        { title: "Form Desc", data: "formDesc" },
        {
          title: "Actions",
          data: null,
          defaultContent: "", // to avoid errors if data is null
          orderable: false,
          searchable: false,
          render: (data, type, row) => {
            const formID = "accEdit_" + data.formID.replace(/\s+/g, "");

            return `
              <button class="btn btn-sm btn-danger" id="${formID}" data-id="${data.formID}" >Remove Access </button>
            `;
          },
        },
      ],
      HaveAccFormOptions: {
        paging: false,
        lengthMenu: false,
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
      this.notHaveAccFormList = [];
      this.HaveAccFormList = [];
    },
    onAddBtnClick() {
      this.enterMode("modifyData");
      this.getGroupData();
      this.getFormData();

      // copy data from default form list
      //this.notHaveAccFormList = [];
      // const defdata = this.defaultFormList;
      // const newArray = [].concat(defdata);
      // this.notHaveAccFormList = newArray;

      //this.HaveAccFormList = [];

      console.log(this.defaultFormList);
    },
    onBtnBackClick() {
      this.clearModifyScreen();
      this.enterMode("displayData");
      // this.isEditData = false;
    },
    async getGroupData() {
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

            const GroupIDItems = response.content.map((item) => {
              return {
                groupID: item.groupID,
                groupDesc: item.groupDesc,
              };
            });

            if (this.isEditData) {
              //Load data to datatable
              this.groupIDList = GroupIDItems;
            } else {
              //only get groupid data not exist in group access for add new data
              const ExistingGroupIDinGroupAcc = this.allData.map((item) => {
                return {
                  groupID: item.groupID,
                };
              });

              let filteredArray = GroupIDItems.filter(
                (item) =>
                  !ExistingGroupIDinGroupAcc.find(
                    (excludeItem) => excludeItem.groupID === item.groupID
                  )
              );

              //Load data to datatable
              this.groupIDList = filteredArray;
            }
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
    async getFormData() {
      try {
        var response = await getFormData();

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
            this.defaultFormList = [];
            this.notHaveAccFormList = [];

            const FormIDItems = response.content.map((item) => {
              return {
                formID: item.formID,
                formDesc: item.formDesc,
              };
            });

            //Load data to datatable
            this.defaultFormList = FormIDItems;
            this.notHaveAccFormList = FormIDItems;
            // console.log(this.defaultFormList);
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

      // setTimeout(() => {
      //   // this.message = 'Done!';
      // }, 4000);
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
    async getDetailData(groupID) {
      try {
        // debugger;
        // console.log(this.defaultFormList);
        // console.log("here i am");
        // console.log(this.notHaveAccFormList);
        var response = await getDetailData(groupID);

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
            let haveAccFormList = response.content.map((item) => {
              return {
                formID: item.formID,
              };
            });

            console.log("below have acc form list");
            console.log(haveAccFormList);
            // for (let index = 0; index < haveAccFormList.length; index++) {
            //   const AccFormID = haveAccFormList[index];
            //   //this.addFormAccess(AccFormID);
            // }
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
        debugger;
        // validation
        if (this.groupID === "") {
          this.$swal.fire({
            icon: "info",
            title: "Master Group Access",
            text: "please select Group ID",
            showConfirmButton: true,
          });
          return;
        } else if (this.HaveAccFormList.length === 0) {
          this.$swal.fire({
            icon: "info",
            title: "Master Group Access",
            text: "No have form access, please select minimum 1 form",
            showConfirmButton: true,
          });
          return;
        }

        //Insert and update data
        var response = await insertData(this.groupID, this.HaveAccFormList);

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
            title: "Master Group Access",
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

        // if (this.isEditData) {
        //   //Update data
        //   await this.updateData(this.groupID, this.groupDesc);
        // } else {
        // }
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

        //get group data to populate in selection
        this.getGroupData();

        this.getFormData();

        // copy data from default form list
        // this.notHaveAccFormList = [];
        // const defdata = this.defaultFormList;
        // const newArray = [].concat(defdata);
        // this.notHaveAccFormList = newArray;

        // console.log(this.defaultFormList);
        console.log("below data in not have acc form list");
        console.log(this.notHaveAccFormList);

        //retrieve data to modify screen
        const filteredData = this.allData.filter(
          (data) => data.groupID === groupID
        );

        this.groupID = filteredData[0].groupID;

        this.enterMode("modifyData");
        this.isGroupIDdisabled = true;

        this.getDetailData(this.groupID);
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: error,
          showConfirmButton: true,
        });
      }

      // setTimeout(() => {
      //   //debugger
      //   // this.message = 'Done!';
      //   // this.getDetailData(this.groupID);
      // }, 4000); // 2000 milliseconds = 2 seconds
    },
    // async updateData(groupID, groupDesc) {
    //   try {
    //     var response = await updateData(groupID, groupDesc);

    //     if (response == "ERR_NETWORK") {
    //       this.$swal.fire({
    //         icon: "warning",
    //         title: "Network",
    //         text: "Network error when access the server, please try again later or try to relogin !",
    //         showConfirmButton: true,
    //       });
    //       return;
    //     }

    //     if (response.isSuccess) {
    //       this.$swal.fire({
    //         position: "top-right",
    //         icon: "success",
    //         title: "Master Group",
    //         text: "Data updated",
    //         showConfirmButton: false,
    //         timer: 800,
    //       });

    //       this.clearModifyScreen();
    //       this.enterMode("displayData");
    //       this.getData();
    //     } else {
    //       this.$swal.fire({
    //         icon: "warning",
    //         title: "Error",
    //         text: response.message,
    //         showConfirmButton: true,
    //       });
    //     }

    //     //set isEditData as false
    //     this.isEditData = false;
    //   } catch (error) {
    //     this.$swal.fire({
    //       icon: "error",
    //       title: "Error",
    //       text: error,
    //       showConfirmButton: true,
    //     });
    //   }
    // },
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
            title: "Master Group Access",
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
    async addFormAccess(formID) {
      try {
        // console.log(this.notHaveAccFormList);
        //retrieve form data based on form ID from notHaveAccFormList variable
        const selectedData = this.notHaveAccFormList.filter(
          (data) => data.formID === formID
        );

        console.log(this.notHaveAccFormList);
        console.log("below error");
        console.log(selectedData);
        //Add data to HaveAccFormList variable
        this.HaveAccFormList.push(selectedData[0]);

        //Remove selected Form ID from NotHaveFormList variable
        // Find index of item
        let index = this.notHaveAccFormList.findIndex(
          (item) => item.formID === formID
        );

        // Remove item at that index
        if (index !== -1) {
          this.notHaveAccFormList.splice(index, 1);
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
    async removeFormAccess(formID) {
      try {
        //retrieve form data based on form ID from HaveAccFormList variable
        const selectedData = this.HaveAccFormList.filter(
          (data) => data.formID === formID
        );

        //Add data to notHaveAccFormList variable
        this.notHaveAccFormList.push(selectedData[0]);

        //Remove selected Form ID from HaveAccFormList variable
        // Find index of item
        let index = this.HaveAccFormList.findIndex(
          (item) => item.formID === formID
        );

        // Remove item at that index
        if (index !== -1) {
          this.HaveAccFormList.splice(index, 1);
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
    setEventInMainTable() {
      // set event for edit or delete onclick in datatable
      const tableElement = this.$refs.table.$el;

      tableElement.addEventListener("click", (event) => {
        const editButton = event.target.closest(".btn-primary");
        const deleteButton = event.target.closest(".btn-danger");

        if (editButton) {
          // debugger
          const rowId = editButton.getAttribute("data-id");
          this.editData(rowId);
        }

        if (deleteButton) {
          const rowId = deleteButton.getAttribute("data-id");

          this.$swal
            .fire({
              title: "Master Group Access",
              text:
                "Are you sure to delete data with Group ID '" + rowId + "' ?",
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
    setEventInAllDefFormTable() {
      // set event for edit or delete onclick in datatable
      const tableElement = this.$refs.tableAllDefForm.$el;

      tableElement.addEventListener("click", (event) => {
        const editButton = event.target.closest(".btn-primary");

        if (editButton) {
          const rowId = editButton.getAttribute("data-id");
          this.addFormAccess(rowId);
        }
      });
    },
    setEventInAllAccFormTable() {
      // set event for edit or delete onclick in datatable
      const tableElement = this.$refs.tableAllAccForm.$el;

      tableElement.addEventListener("click", (event) => {
        const deleteButton = event.target.closest(".btn-danger");

        if (deleteButton) {
          const rowId = deleteButton.getAttribute("data-id");
          this.removeFormAccess(rowId);
        }
      });
    },
    async getFormDescData() {
      try {
        var response = await getFormDescData('TGroupAccess');

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
    this.getFormData();
    this.getFormDescData();

    // set event for all table
    this.setEventInMainTable();
    this.setEventInAllDefFormTable();
    this.setEventInAllAccFormTable();
  },
};
</script>

<style>
@import "bootstrap";
@import "datatables.net-bs5";
</style>
