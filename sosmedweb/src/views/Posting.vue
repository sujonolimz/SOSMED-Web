<template>
  <div>
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
      data-bs-whatever="@mdo"
      v-if="!isAdmin"
    >
      <font-awesome-icon icon="fa-solid fa-plus" />
      New Post
    </button>

    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
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

  <div>
    <h3>Posting List</h3>
    <ul>
      <li v-for="item in allData" :key="item.postingID">
        <div class="card" style="margin: 16px">
          <div class="card-header">
            <h5>{{ item.title }}</h5>
          </div>
          <div class="card-body">
            <p class="card-text">
              {{ item.description }}
            </p>
            <a href="#" class="btn btn-danger" style="margin-right: 4px"
              >Give like</a
            >
            <a href="#" class="btn btn-primary">Comment</a>
          </div>
          <div class="card-footer text-body-secondary">
            Posted by: {{ item.createdBy }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  getData,
  insertData,
  updateData,
  deleteData,
} from "@/components/js-file/posting";
import { useRouter } from "vue-router";

export default {
  name: "Posting",
  components: {
    // DataTable,
  },
  data() {
    return {
      isAdmin: false,
      postTitle: "",
      postDesc: "",
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
            timer: 800,
          });

          this.clearModifyScreen();
          // this.enterMode("displayData");
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
        //   await this.updateData(this.formID, this.formDesc);
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
    checkUserStatus() {
      var dept = localStorage.getItem("dept");
      if (dept == "Admin") {
        this.isAdmin = true;
      }
    },
  },
  mounted() {
    //get and load data
    this.getData();
    this.checkUserStatus();
  },
};
</script>
