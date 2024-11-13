
import Header from "../../../shared/components/Header/Header";

export default function UsersList() {
  return (
    <>
      <Header
        title={"Welcome to Our Users List !"}
        username={" "}
        description={
          "We're thrilled to have you here. Explore and enjoy everything we have to offer!"
        }
        headerImg={"/public/resipes.svg"}
      />
    </>
  );
}