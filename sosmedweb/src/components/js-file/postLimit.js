import axios from "@/axios";

export default {};

export async function getData() {
  try {
    const response = await axios.get(`postlimit/GetData`);
    return response.data;

  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("PostLimit Error getData() :", error.message);
    }
  }
}

export async function insertData(paramPostLimitID, paramPostLimitValue) {
  try {
    var param = {
      postLimitID: paramPostLimitID,
      postLimitValue: paramPostLimitValue,
      createdBy: localStorage.getItem("userID"),
    };

    const response = await axios.post(`postlimit/InsertData`, param);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("PostLimit Error insertData() :", error.message);
    }
  }
}

export async function updateData(paramPostLimitID, paramPostLimitValue) {
  try {
    var param = {
      postLimitID: paramPostLimitID,
      postLimitValue: paramPostLimitValue,
      updatedBy: localStorage.getItem("userID"),
    };

    const response = await axios.post(`postlimit/UpdateData`, param);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("PostLimit Error updateData() :", error.message);
    }
  }
}

export async function deleteData(paramPostLimitID) {
  try {
    const response = await axios.delete(
      `postlimit/DeleteData?postlimitID=${paramPostLimitID}`
    );
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("PostLimit Error deleteData() :", error.message);
    }
  }
}
