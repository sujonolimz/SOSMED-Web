import axios from "@/axios";

export default {};

export async function getData() {
  try {
    const response = await axios.get(`user/GetData`);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Group Error getData() :", error.message);
    }
  }
}

export async function insertData(paramList) {
  try {
    var param = {
      userID: paramList[0].userID,
      userName: paramList[0].userName,
      dept: paramList[0].dept,
      password: paramList[0].password,
      groupID: paramList[0].groupID,
      postLimitID: paramList[0].postLimitID,
      createdBy: localStorage.getItem("userID"),
    };

    const response = await axios.post(`user/InsertData`, param);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("User Error insertData() :", error.message);
    }
  }
}

export async function updateData(paramList) {
  try {
    var param = {
      userID: paramList[0].userID,
      userName: paramList[0].userName,
      dept: paramList[0].dept,
      password: paramList[0].password,
      groupID: paramList[0].groupID,
      postLimitID: paramList[0].postLimitID,
      updatedBy: localStorage.getItem("userID"),
    };

    const response = await axios.post(`user/UpdateData`, param);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("User Error updateData() :", error.message);
    }
  }
}

export async function deleteData(paramUserID) {
  try {
    const response = await axios.delete(
      `user/DeleteData?userID=${paramUserID}`
    );
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("User Error deleteData() :", error.message);
    }
  }
}

export async function getTotalMAUs() {
  try {
    const response = await axios.get(`user/GetTotalMAUs`);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("User Error getTotalMAUs() :", error.message);
    }
  }
}