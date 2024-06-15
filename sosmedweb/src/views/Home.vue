<template>
  <div>
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
      data-bs-whatever="@mdo"
      style="margin-left: 1%"
      v-if="!isAdmin"
    >
      <font-awesome-icon icon="fa-solid fa-plus" />
      New Post
    </button>

    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">New Posting</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              :onclick="clearModifyScreen"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="postTitle" class="col-form-label">Title</label>
                <input
                  type="text"
                  class="form-control"
                  id="postTitle"
                  autocomplete="off"
                  v-model="postTitle"
                />
              </div>
              <div class="mb-3">
                <label for="postDesc" class="col-form-label">Description</label>
                <textarea
                  class="form-control"
                  id="postDesc"
                  autocomplete="off"
                  v-model="postDesc"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              :onclick="clearModifyScreen"
            >
              Close
            </button>
            <button :onclick="submitData" type="button" class="btn btn-primary">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!isAdmin">
    <!-- <h3>Posting List</h3> -->
    <div
      v-for="item in allData"
      :key="item.postingID"
      class="card"
      style="margin: 16px"
    >
      <div class="card-header">
        <h5>{{ item.title }}</h5>
      </div>
      <div class="card-body">
        <p class="card-text">
          {{ item.description }}
        </p>
        <!-- <a class="btn btn-danger" style="margin-right: 4px">Like</a>
        <a class="btn btn-primary">Comment</a> -->
      </div>
      <div class="card-footer text-body-secondary">
        <div v-if="item.updatedBy">
          {{ editedData }}
        </div>
        Posted by : {{ item.createdBy }} |
        {{ moment(item.createdDate).format("YYYY-MM-DD HH:mm:ss") }}
      </div>
    </div>
  </div>

  <div v-if="isAdmin">
    <div class="row">
      <div class="col-md-3">
        <div class="card">
          <div class="card-header">
            <h5>Total Posting</h5>
          </div>
          <div class="card-body">
            <p class="card-text">
              <router-link class="nav-link" to="/posting">{{
                totalPosting
              }}</router-link>
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-header">
            <h5>Monthly Active Users (MAUs)</h5>
          </div>

          <div v-if="isHaveAccLoginHistory" class="card-body">
            <p class="card-text">
              <router-link class="nav-link" to="/loginhistory">{{
                totalMAUs
              }}</router-link>
            </p>
          </div>

          <div v-if="!isHaveAccLoginHistory" class="card-body">
            <p class="card-text">
              {{ totalMAUs }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import posting from "@/components/js-file/posting";
</script>

<script>
import { getData, insertData } from "@/components/js-file/posting";
import { getTotalMAUs } from "@/components/js-file/user";
import { isHaveFormAccess } from "@/components/js-file/auth";

import { useRouter } from "vue-router";
import moment from "moment";

export default {
  name: "Home",
  components: {
    // DataTable,
  },
  data() {
    return {
      userid: "",
      isAdmin: false,
      postTitle: "",
      postDesc: "",
      totalPosting: 0,
      totalMAUs: 0,
      isHaveAccLoginHistory: false,
      editedData: "[Edited]",
      allData: [],
    };
  },
  setup() {
    const router = useRouter();

    return { router };
  },
  methods: {
    clearModifyScreen() {
      this.postTitle = "";
      this.postDesc = "";
    },
    async getData() {
      try {
        var response = await getData("Admin");

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

            //get totalPosting
            this.totalPosting = response.content.length;
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
        if (this.postTitle === "") {
          this.$swal.fire({
            icon: "info",
            title: "Posting",
            text: "please input Title",
            showConfirmButton: true,
          });
          return;
        } else if (this.postDesc === "") {
          this.$swal.fire({
            icon: "info",
            title: "Posting",
            text: "please input Description",
            showConfirmButton: true,
          });
          return;
        }

        var paramList = [
          {
            title: this.postTitle,
            description: this.postDesc,
          },
        ];

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
            title: "Posting",
            text: "Posting success",
            showConfirmButton: false,
            timer: 2000,
          });

          this.clearModifyScreen();
          this.getData();
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
    async getTotalMAUsData() {
      try {
        var response = await getTotalMAUs();

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
            this.totalMAUs = 0;

            //Load totalMAUs data
            this.totalMAUs = response.totalMAUs;
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
    checkUserStatus() {
      this.userid = localStorage.getItem("userID");
      var dept = localStorage.getItem("dept");
      if (dept == "Admin") {
        this.isAdmin = true;
      }
    },
    async checkIsHaveAccess() {
      try {
        var formID = "TLoginHistory";
        var response = await isHaveFormAccess(this.userid, formID);

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
            if (formID == "TLoginHistory") {
              this.isHaveAccLoginHistory = true;
            }
          } else {
            if (formID == "TLoginHistory") {
              this.isHaveAccLoginHistory = false;
            }
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
    this.getTotalMAUsData();
    this.checkUserStatus();
    this.checkIsHaveAccess();
  },
};
</script>
