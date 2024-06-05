import axios from "axios";

const API_URL = 'http://localhost:5022/api/';

export async function login(username, password){
    try {
        var param = {
            "userID": username,
            "password": password
        };
        const response = await axios.post(`${API_URL}auth/login`,param);
        
        if (response.data.isSuccess) {
            const token = response.data.userData.token;
        
            localStorage.setItem('userID', response.data.userData.userID);
            localStorage.setItem('userName', response.data.userData.userName);
            localStorage.setItem('groupID', response.data.userData.groupID);
            localStorage.setItem('dept', response.data.userData.dept);
            localStorage.setItem('token', token);
            
            return true;
        }else{
            alert(response.data.message);
        }   
    } catch (error) {
        alert('Login failed: ' + error.message)
        throw Error('Login failed ')
    }
}

export async function getUserInfo(token){
    try {
        const response = await axios.get(`${API_URL}auth/userinfo`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        throw Error('Failed to get user info')
    }
}