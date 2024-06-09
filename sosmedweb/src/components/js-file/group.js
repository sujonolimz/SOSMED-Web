import axios from "@/axios";

export default {};

export async function getData() {
  try {
    const response = await axios.get(`group/GetData`);
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

export async function insertData(paramGroupID, paramGroupDesc) {
  try {
    var param = {
      groupID: paramGroupID,
      groupDesc: paramGroupDesc,
      createdBy: localStorage.getItem("userID"),
    };

    const response = await axios.post(`group/InsertData`, param);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Group Error insertData() :", error.message);
    }
  }
}

export async function updateData(paramGroupID, paramGroupDesc) {
  try {
    var param = {
      groupID: paramGroupID,
      groupDesc: paramGroupDesc,
      updatedBy: localStorage.getItem("userID"),
    };

    const response = await axios.post(`group/UpdateData`, param);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Group Error updateData() :", error.message);
    }
  }
}

export async function deleteData(paramGroupID) {
  try {
    const response = await axios.delete(
      `group/DeleteData?groupID=${paramGroupID}`
    );
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Group Error deleteData() :", error.message);
    }
  }
}
