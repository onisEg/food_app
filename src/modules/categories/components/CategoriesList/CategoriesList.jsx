import { useEffect, useState } from "react";
import Header from "../../../shared/components/Header/Header";

import { CATEGORY_URLS } from "../../../../services/api/urls";
import { axiosInstance } from "../../../../services/api";
import { toast } from "react-toastify";

export default function CategoriesList() {
  const [categoriesList, setCategoriesList] = useState([]);
  let getCategories = async () => {
    try {
      let response = await axiosInstance.get(`${CATEGORY_URLS.GET_CATEGORIES}`);
      // console.log(response?.data?.data);
      setCategoriesList(response.data.data)
    } catch (error) {
      console.error(error);
      toast.error(error)
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Header
        title={"Categories"}
        username={"Items"}
        description={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
        headerImg={"/resipes.svg"}
      />
      <div className="d-flex justify-content-between align-content-center my-4">
        <div className="d-flex flex-column ">
          <span className="fs-3">Categories Table Details</span>
          <span>You can check all details</span>
        </div>
        <div>
          <div
            style={{ background: "#009247" }}
            className="px-5 btn btn-success btn-lg text-white d-flex justify-content-center align-items-center"
          >
            Add New Category
          </div>
        </div>
      </div>
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">Price</th>
              <th scope="col">Description</th>
              <th scope="col">Discount</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            
            <tr>
              <td scope="row">Noodles with Sushi</td>
              <td>img</td>
              <td>350.99</td>
              <td>Rice-cack with noodles</td>
              <td>@mdo</td>
              <td className="">
                <i className="bi bi-trash mx-3 text-danger"></i>
                <i className="bi bi-pencil-square text-warning"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
