import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../services/api";
import { USER_RECIPE_URLS, imgBaseURL } from "../../../../services/api/urls";
import toast from "react-hot-toast";
import Header from "../../../shared/components/Header/Header";
import NoData from "../../../shared/components/noData/NoData";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const getFavorites = async () => {
    try {
      const res = await axiosInstance.get(USER_RECIPE_URLS.GET_FAVORITES);
      setFavorites(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load favorites");
    }
  };

  const removeFavorite = async (favId) => {
    try {
      await axiosInstance.delete(USER_RECIPE_URLS.DELETE_FAVORITE(favId));
      setFavorites((prev) => prev.filter((f) => f.id !== favId));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error("Failed to remove favorite");
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <>
      <Header
        title={"My Favorite "}
        description={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
        headerImg={"/resipes.svg"}
      />
      <div className=" mt-4">
        {favorites.length === 0 ? (
          <>
            <p className="text-muted">No favorite recipes yet.</p>
            <NoData />
          </>
        ) : (
          <table className="table table-striped-reversed">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Image</th>
                <th>Price</th>
                <th>Description</th>
                <th>Tag</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav) => (
                <tr key={fav.id}>
                  <td>{fav.recipe?.name}</td>
                  <td>
                    <img
                      src={
                        fav.recipe?.imagePath
                          ? `${imgBaseURL}/${fav.recipe.imagePath}`
                          : ""
                      }
                      alt={fav.recipe?.name}
                      className="rounded img-thumbnail"
                      width="70"
                    />
                  </td>
                  <td>{fav.recipe?.price} EGP</td>
                  <td>{fav.recipe?.description?.slice(0, 50)}...</td>
                  <td>{fav.recipe?.tag?.name}</td>
                  <td>{fav.recipe?.category?.[0]?.name}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFavorite(fav.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
