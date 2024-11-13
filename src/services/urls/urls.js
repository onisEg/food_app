import axios from "axios";

export const baseURL = "https://upskilling-egypt.com:3006/api/v1";

export const axiosInstance = axios.create({ baseURL });


//USERS URLS 
export const USERS_URL = {
    LOGIN: `/Users/Login`,
    REGISTER: `/Users/Register`,
    RESET_REQYEST: `/Users/Reset/Request`,
    RESET: `/Users/Reset`,
    GET_USER: (id)=>`/Users/${id}`

}