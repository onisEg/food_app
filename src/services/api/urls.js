import axios from "axios";

export const baseURL = "https://upskilling-egypt.com:3006/api/v1";


//USERS URLS 
export const USERS_URL = {
    LOGIN: `/Users/Login`,
    REGISTER: `/Users/Register`,
    RESET_REQUEST: `/Users/Reset/Request`,
    RESET: `/Users/Reset`,
    GET_USER: (id) => `/Users/${id}`,
    CHANGE_PASSWORD: `/Users/ChangePassword`,
    GET_CURRENT_USER: `/Users/currentUser`

}

//CATEGORY 
export const CATEGORY_URLS = {
    GET_CATEGORIES: `/Category/`,
}

//RECIPES
export const RECIPE_URLS = {
    GET_RECIPES: `/Recipe/`
}