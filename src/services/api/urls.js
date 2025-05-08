export const imgBaseURL = "https://upskilling-egypt.com:3006"
export const baseURL = "https://upskilling-egypt.com:3006/api/v1";


//USERS URLS 
export const USERS_URL = {
    LOGIN: `/Users/Login`,
    REGISTER: `/Users/Register`,
    CREATE: `/Users/Create`,
    DELETE: (id) => `/Users/${id}`,
    GET_USER: (id) => `/Users/${id}`,
    RESET_REQUEST: `/Users/Reset/Request`,
    RESET: `/Users/Reset`,
    GET_USER: (id) => `/Users/${id}`,
    CHANGE_PASSWORD: `/Users/ChangePassword`,
    GET_CURRENT_USER: `/Users/currentUser`,
    VERIFY_ACCOUNT: `/Users/verify`,
    GET_CURRENT_USER: `/Users/currentUser`,
    GET_ALL: `/Users`,
    UPDATE_PROFILE: `/Users`,
}


//CATEGORY 
export const CATEGORY_URLS = {
    ADD_CATEGORY: `/Category`,                  //create category 
    GET_CATEGORIES: `/Category`,                //get and filter categories  
    GET_CATEGORY: (id) => `/Category/${id}`,    //get category by id 
    DELETE_CATEGORY: (id) => `/Category/${id}`, // delete category by id 
    UPDATE_CATEGORY: (id) => `/Category/${id}`, //update category by id 

}

//RECIPES
export const RECIPE_URLS = {
    ADD_RECIPE: `/Recipe`,                  //create recipe 
    GET_RECIPES: `/Recipe`,                  //get and filter recipes
    GET_RECIPE: (id) => `/Recipe/${id}`,    //get recipe by id 
    DELETE_RECIPE: (id) => `/Recipe/${id}`, //delete recipe by id 
    UPDATE_RECIPE: (id) => `/Recipe/${id}`, //update recipe by id 

}

// USER RECIPE (Favorite)
export const USER_RECIPE_URLS = {
    GET_FAVORITES: `/userRecipe`,                  // get my favorite recipes 
    ADD_FAVORITE: `/userRecipe`,                   // add favorite recipe 
    DELETE_FAVORITE: (id) => `/userRecipe/${id}`,  // delete favorite recipe 
};

export const TAG = {
    ALL_TAGS: `/tag`,  // get all tags
}  