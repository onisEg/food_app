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
    GET_CATEGORIES: `/Category`,
    GET_CATEGORY: (id) => `/Category/${id}`,
    DELETE_CATEGORY: (id) => `/Category/${id}`,
    ADD_CATEGORY: `/Category`,
    UPDATE_CATEGORY: (id) => `/Category/${id}`,


}

//RECIPES
export const RECIPE_URLS = {
    GET_RECIPES: `/Recipe`,
    GET_RECIPE: (id) => `/Recipe/${id}`,
    DELETE_RECIPE: (id) => `/Recipe/${id}`,
    ADD_RECIPE: `/Recipe`,
    UPDATE_RECIPE: (id) => `/Recipe/${id}`,

}