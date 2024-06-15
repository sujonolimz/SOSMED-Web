import axios from "@/axios";

export default {};

export async function getData(param) {
  try {
    const response = await axios.get(`Posting/GetData?userID=${param}`);
    return response.data;

  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Posting Error getData() :", error.message);
    }
  }
}

export async function insertData(paramList) {
  try {
    var param = {
      title: paramList[0].title,
      description: paramList[0].description,
      createdBy: localStorage.getItem("userID"),
    };

    const response = await axios.post(`Posting/InsertData`, param);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Posting Error insertData() :", error.message);
    }
  }
}

export async function updateData(paramList) {
  try {
    var param = {
      postingID: paramList[0].postingID,
      title: paramList[0].title,
      description: paramList[0].description,
      updatedBy: localStorage.getItem("userID"),
    };

    const response = await axios.post(`Posting/UpdateData`, param);
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Posting Error updateData() :", error.message);
    }
  }
}

export async function deleteData(paramPostingID) {
  try {
    const response = await axios.delete(
      `Posting/DeleteData?postingID=${paramPostingID}`
    );
    return response.data;
  } catch (error) {
    // Network error
    if (error.code === "ERR_NETWORK") {
      return error.code;
    } else {
      // Other errors (e.g., unexpected issues)
      alert("Posting Error deleteData() :", error.message);
    }
  }
}
