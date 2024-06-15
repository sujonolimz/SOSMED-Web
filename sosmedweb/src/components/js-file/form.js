import axios from "@/axios";

export async function getData() {
  try {
    const response = await axios.get(`form/GetData`);
    return response.data;

  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Form Error getData() :", error.message);
    }
  }
}

export async function insertData(paramFormID, paramFormDesc) {
  try {
    var param = {
      formID: paramFormID,
      formDesc: paramFormDesc,
      createdBy: localStorage.getItem("userID"),
    };

    const response = await axios.post(`form/InsertData`, param);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Form Error insertData() :", error.message);
    }
  }
}

export async function updateData(paramFormID, paramFormDesc) {
  try {
    var param = {
      formID: paramFormID,
      formDesc: paramFormDesc,
      updatedBy: localStorage.getItem("userID"),
    };

    const response = await axios.post(`form/UpdateData`, param);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Form Error updateData() :", error.message);
    }
  }
}

export async function deleteData(paramFormID) {
  try {
    const response = await axios.delete(
      `form/DeleteData?formID=${paramFormID}`
    );
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Form Error deleteData() :", error.message);
    }
  }
}

export async function getFormDescData(paramFormID) {
  try {
    const response = await axios.get(`form/GetFormDesc?formID=${paramFormID}`);
    return response.data;

  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Form Error getData() :", error.message);
    }
  }
}