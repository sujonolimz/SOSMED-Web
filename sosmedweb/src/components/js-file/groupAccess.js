import axios from "@/axios";

export default {};

export async function getData() {
  try {
    const response = await axios.get(`GroupAccess/GetData`);
    return response.data;

  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("GroupAccess Error getData() :", error.message);
    }
  }
}

export async function getDetailData(paramGroupID) {
  try {
    const response = await axios.get(`GroupAccess/GetDetailData?groupID=${paramGroupID}`);
    return response.data;

  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("GroupAccess Error getDetailData() :", error.message);
    }
  }
}

export async function insertData(paramGroupID, formList) {
  try {
    let paramList = formList.map(item => {
      return {
        groupID: paramGroupID,
        formID: item.formID,
        createdBy: localStorage.getItem("userID"),
      }
    })

    const response = await axios.post(`GroupAccess/InsertData`, paramList);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("GroupAccess Error insertData() :", error.message);
    }
  }
}

export async function deleteData(paramGroupID) {
  try {
    const response = await axios.delete(
      `GroupAccess/DeleteData?groupID=${paramGroupID}`
    );
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("GroupAccess Error deleteData() :", error.message);
    }
  }
}
