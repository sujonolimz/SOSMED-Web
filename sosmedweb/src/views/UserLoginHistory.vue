<template>
  <h3>{{ formTitleDesc }}</h3>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link class="navbar-brand" to="/">Home</router-link>
      </li>
      <li class="breadcrumb-item active" aria-current="page">
        {{ formTitleDesc }}
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
        <div class="row">
          <div class="mb-3 col-4">
            <label for="year" class="form-label tabs-modify">Year</label>
            <select id="year" v-model="year" class="form-select">
              <option value="" disabled>Select Year</option>
              <option
                v-for="option in yearList"
                :key="option.key"
                :value="option.value"
              >
                {{ option.value }}
              </option>
            </select>
          </div>

          <div class="mb-3 col-4">
            <label for="month" class="form-label tabs-modify">Month</label>
            <select id="month" v-model="month" class="form-select">
              <option value="" disabled>Select Month</option>
              <option
                v-for="option in monthList"
                :key="option.key"
                :value="option.value"
              >
                {{ option.key }}
              </option>
            </select>
          </div>

          <div class="mb-3 col-4" style="margin-top: 1.8%">
            <button
              @click="getData(this.year, this.month)"
              class="btn btn-primary"
            >
              Search
            </button>
          </div>
        </div>

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
    ></div>
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
import { getLoginHistoryData } from "@/components/js-file/user";
import { getFormDescData } from "@/components/js-file/form";
import { useRouter } from "vue-router";

export default {
  name: "Form",
  components: {
    DataTable,
  },
  data() {
    return {
      year: "",
      month: "",
      yearList: [
        { key: "2024", value: "2024" },
        { key: "2025", value: "2025" },
        { key: "2026", value: "2026" },
      ],
      monthList: [
        { key: "January", value: 1 },
        { key: "February", value: 2 },
        { key: "March", value: 3 },
        { key: "April", value: 4 },
        { key: "May", value: 5 },
        { key: "June", value: 6 },
        { key: "July", value: 7 },
        { key: "August", value: 8 },
        { key: "September", value: 9 },
        { key: "October", value: 10 },
        { key: "November", value: 11 },
        { key: "December", value: 12 },
      ],
      formTitleDesc: "Login History",
      activeTab: "displayData",
      allcolumns: [
        { title: "No", data: "no" },
        { title: "ID", data: "id", visible: false },
        { title: "User ID", data: "userID" },
        { title: "User Name", data: "userName" },
        {
          title: "Login Time",
          data: "loginTime",
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
    async getData(paramYear, paramMonth) {
      try {
        var response = await getLoginHistoryData(paramYear, paramMonth);

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
    async getFormDescData() {
      try {
        var response = await getFormDescData("TLoginHistory");

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
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    this.year = currentYear;
    this.month = currentMonth;

    this.getData(this.year, this.month);
    this.getFormDescData();
  },
};
</script>

<style>
@import "bootstrap";
@import "datatables.net-bs5";
</style>
