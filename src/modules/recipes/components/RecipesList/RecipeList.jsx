import React from "react";
import Header from "../../../shared/components/Header/Header";

export default function RecipeList() {
  return (
    <>
      <Header
        title={"Recipes"}
        username={"Items"}
        description={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
        headerImg={"/resipes.svg"}
      />
      <div className="d-flex justify-content-between align-content-center my-4">
        <div className="d-flex flex-column ">
          <span className="fs-3">Recipe Table Details</span>
          <span>You can check all details</span>
        </div>
        <div>
          <div
            style={{ background: "#009247" }}
            className="px-5 btn btn-success btn-lg text-white d-flex justify-content-center align-items-center"
          >
            Add New Item
          </div>
        </div>
      </div>

    </>
  );
}
