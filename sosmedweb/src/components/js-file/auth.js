import axios from "@/axios";

export async function login(username, password){
    try {
        var param = {
            "userID": username,
            "password": password
        };

        const response = await axios.post(`auth/login`,param);
        
        if (response.data.isSuccess) {
            const userID = response.data.userData.userID;
            const userName = response.data.userData.userName;
            const groupID = response.data.userData.groupID;
            const dept = response.data.userData.dept;
            const token = response.data.userData.token;

            localStorage.setItem('userID', userID);
            localStorage.setItem('userName', userName);
            localStorage.setItem('groupID', groupID);
            localStorage.setItem('dept', dept);
            localStorage.setItem('token', token);

            return response.data;
        }else{
            return response.data;
        }
    } catch (error) {
        alert(error)
    }
}
