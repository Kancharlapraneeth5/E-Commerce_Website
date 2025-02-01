import "./App.css";
import Navbar from "./Navbar";
import { Route, Switch, useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Categories from "./Categories";
import AddCategory from "./AddCategory";
import Products from "./Products";
import Filter from "./Filter";
import AddProduct from "./AddProduct";
import Thankyou from "./Thankyou";
import AddReview from "./AddReview";

function App() {
  const location = useLocation();
  return (
    // without the Router component, the Link component will not work in the Navbar component
    // (we have added the Router component in the index.js file)

    <div className="App">
      {location.pathname === "/Login" ||
        location.pathname === "/Register" ||
        (location.pathname === "/" && <Navbar />)}
      <div className="content">
        <Switch>
          <Route exact path="/">
            <div className="homepage">
              <img
                src="https://okcredit-blog-images-prod.storage.googleapis.com/2021/04/ecommerce3-2.jpg"
                alt="A welcoming greeting for the homepage"
                height="750px"
                width="1250px"
                className="homepage-image"
              />
              <h1>WELCOME !!</h1>
            </div>
          </Route>
          <Route exact path="/Login">
            <Login />
          </Route>
          <Route exact path="/Register">
            <Register />
          </Route>
          <Route exact path="/Categories">
            <Categories />
          </Route>
          <Route exact path="/AddCategory">
            <AddCategory />
          </Route>
          <Route exact path="/Products/:categoryId">
            <Products />
          </Route>
          <Route exact path="/Filter/:categoryId">
            <Filter />
          </Route>
          <Route exact path="/Products/:categoryId/AddProduct">
            <AddProduct />
          </Route>
          <Route exact path="/Products/:categoryId/AddReview/:productID">
            <AddReview />
          </Route>
          <Route exact path="/FeedBackDone">
            <Thankyou />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
