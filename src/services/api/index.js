import axios from "axios";
import { baseURL } from "./urls";

export const axiosInstance = axios.create({
    baseURL, headers: { Authorization: localStorage.getItem("token") }


})