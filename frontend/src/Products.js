import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "./config/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewPopup, setReviewPopup] = useState(false);
  const [productID, setProductID] = useState(null);
  const history = useHistory();
  const { categoryId } = useParams();

  // Learn useLocation hook in detail..
  const location = useLocation();
  // console.log("Location in products: ", location);
  // console.log("Filtered products in location ", location.state);
  const filteredProducts = location.state
    ? location.state.FilteredProducts
    : [];

  console.log("Filtered products in location ", filteredProducts);

  const popupRef = useRef(null);

  const togglePopup = () => {
    setReviewPopup(!showReviewPopup);
  };

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setReviewPopup(false); // Close the popup
    }
  };

  useEffect(() => {
    console.log(
      "Filtered products in products are.. ",
      JSON.stringify(filteredProducts)
    );
    if (filteredProducts.length > 0) {
      console.log(
        "Filtered products in products: ",
        JSON.stringify(filteredProducts)
      );
      setProducts(filteredProducts);
    } else {
      handleGetProducts(categoryId);
    }
  }, [categoryId]);

  // useEffect(() => {
  //   if (filteredProducts.length === 0) {
  //     handleGetProducts(categoryId);
  //   }
  // }, [filteredProducts.length === 0]);

  useEffect(() => {
    if (showReviewPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReviewPopup]);

  const handleGetProducts = (categoryId) => {
    console.log("Get products for category with id: ", categoryId);
    fetch(API_ENDPOINTS.GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      credentials: "include",
      body: JSON.stringify({
        query: `
                    query Category($categoryId: ID!) {
                        category(categoryId: $categoryId) {
                        products{
                        id
                        name
                        description
                        quantity
                        image
                        price
                        onSale
                    }
                }
            }
                    `,
        variables: {
          categoryId: categoryId,
        },
        operationName: "Category",
      }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Error:", res.statusText);
          if (res.status === 401) {
            history.push("/Login");
          }
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.data.category.products);
        console.log("the server response data is" + JSON.stringify(data));
      });
  };

  const handleGetReviews = (productID) => {
    fetch(API_ENDPOINTS.GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        query: `query ReviewsByProductId($productId: ID!) {
                    reviewsByProductId(productId: $productId){
                    id
                    date
                    title
                    comment
                    rating
                    }
         }`,
        variables: {
          productId: productID,
        },
        operationName: "ReviewsByProductId",
      }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Error:", res.statusText);
          if (res.status === 401) {
            history.push("/Login");
          }
        }
        return res.json();
      })
      .then((data) => {
        setReviews(data.data.reviewsByProductId);
        console.log("the server response data is" + JSON.stringify(data));
      });
  };

  const handleProductDelete = (productID) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      fetch(API_ENDPOINTS.GRAPHQL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          query: `mutation DeleteProduct($productId: ID!) {
                      deleteProduct(productID: $productId)
                  }`,
          variables: {
            productId: productID,
          },
          operationName: "DeleteProduct",
        }),
      })
        .then((res) => {
          if (!res.ok) {
            console.error("Error:", res.statusText);
            if (res.status === 401) {
              history.push("/Login");
            }
          }
          return res.json();
        })
        .then((data) => {
          console.log("the server response data is" + JSON.stringify(data));
          handleGetProducts(categoryId);
        });
    } else {
      console.log("Delete operation cancelled");
    }
  };

  return (
    <div className="Products-Page">
      <div className="Products-header">
        <h1>Products</h1>
        <button
          className="Categories-button"
          onClick={() => history.push("/Categories")}
        >
          Categories
        </button>
        <button
          className="Filter-button"
          onClick={() => {
            history.push(`/Filter/${categoryId}`);
          }}
        >
          Filter
        </button>
        <button
          className="AddProduct-button"
          onClick={() => history.push(`/Products/${categoryId}/AddProduct`)}
        >
          Add Product
        </button>
      </div>
      <div className="Products-container">
        {products.map((product) => (
          <div className="Product" key={product.id}>
            <h1>{product.name}</h1>
            <h3>{"Product description - " + product.description}</h3>
            <h3>{"Available quantity -  " + product.quantity}</h3>
            <h3>{"Price -  " + product.price}</h3>
            <h3>{"Product onSale -  " + product.onSale}</h3>
            <div className="Product-Reviews">
              <button
                onClick={() => {
                  setProductID(product.id);
                  handleGetReviews(product.id);
                  togglePopup();
                }}
              >
                Reviews
              </button>
              {showReviewPopup && (
                <div className="popup" key={productID}>
                  <div className="popup-content" ref={popupRef}>
                    <span className="close-btn" onClick={togglePopup}>
                      ×
                    </span>
                    {/*Get the reviews for the specific producs*/}
                    <h2>{"Customer reviews"}</h2>

                    {productID && (
                      <div>
                        {/* Call the handleGetReviews function when the popup is shown */}
                        <div className="Reviews-Container">
                          {reviews &&
                            reviews.map((review) => (
                              <div className="Review" key={review.id}>
                                <h3>{"Comment: " + review.comment}</h3>
                                <h3>{"Rating: " + review.rating}</h3>
                              </div>
                            ))}
                        </div>
                        <div className="AddReview">
                          <button
                            onClick={() => {
                              history.push(
                                `/Products/${categoryId}/AddReview/${productID}`
                              );
                            }}
                          >
                            AddReview
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="Product-Delete" key={productID}>
              <button
                onClick={() => {
                  handleProductDelete(product.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
