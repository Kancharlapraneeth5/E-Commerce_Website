import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Filter = () => {
  const [filters, setFilters] = useState({
    onSale: null,
    MinRating: null,
    MaxRating: null,
  });

  const [SavedFilters, setSavedFilters] = useState(null);
  const [savedProducts, setSavedProducts] = useState([]);
  const [savedPathName, setSavedPathName] = useState(null);
  const [onSaleProducts, setOnSaleProducts] = useState([]);
  const [reviewRatingProducts, setReviewRatingProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Make sure to set filteredProducts here
  const history = useHistory();
  const { categoryId } = useParams();

  const [selectedOnSaleRadio, setSelectedOnSaleRadio] = useState(null); // Use state for selected rating
  const [selectedRatingRadio, setSelectedRatingRadio] = useState(null); // Use state for selected rating
  const [pathName, setPathName] = useState(null);
  const [clickedSubmitButton, setClickedSubmitButton] = useState(false);
  const [clickedCancelButton, setClickedCancelButton] = useState(false);

  const location = useLocation();
  console.log("Location in Filter: ", location.pathname);

  const handleSubmitClicked = () => {
    setClickedSubmitButton(true);
  };

  const handleCancelClicked = () => {
    setClickedCancelButton(true);
  };

  useEffect(() => {
    if (clickedCancelButton) {
      // Reset filters and products
      console.log("I am in the cancel button click");
      setSelectedRatingRadio(null);
      setSelectedOnSaleRadio(null);
      setSavedFilters(null);
      setSavedProducts([]);

      // Check if all filters are reset
      if (
        selectedOnSaleRadio === null &&
        selectedRatingRadio === null &&
        savedProducts.length === 0 &&
        SavedFilters === null
      ) {
        history.push(`/Products/${categoryId}`);
      }
    }
  }, [
    clickedCancelButton,
    selectedOnSaleRadio,
    selectedRatingRadio,
    SavedFilters,
    savedProducts,
    history,
    categoryId,
  ]);

  useEffect(() => {
    const savedFilters = localStorage.getItem("filters");
    console.log("The saved filters are", savedFilters);
    setSavedFilters(JSON.parse(savedFilters));

    const savedProducts = localStorage.getItem("products");
    console.log("The saved products are", savedProducts);
    setSavedProducts(JSON.parse(savedProducts));
    const SavedPathName = localStorage.getItem("pathName");
    console.log("The saved path name is", SavedPathName);
    setSavedPathName(SavedPathName);

    if (SavedPathName === location.pathname) {
      console.log("I am in the same path name");
    } else {
      console.log("I am in the different path name");
      setSelectedOnSaleRadio(null);
      setSelectedRatingRadio(null);
      setFilters({
        onSale: null,
        MinRating: null,
        MaxRating: null,
      });
      setSavedFilters(null);
      setSavedProducts([]);
    }
  }, []);

  useEffect(() => {
    if (SavedFilters && savedProducts && savedPathName) {
      console.log("The saved filters are", SavedFilters);
      console.log("The saved products are", savedProducts);
      console.log("The saved path name is", savedPathName);

      setFilteredProducts(savedProducts);
      setSavedProducts(savedProducts);

      console.log("I am setting the onSale radio");
      setSelectedOnSaleRadio(SavedFilters.onSale);

      console.log("I am setting the rating radio");
      setSelectedRatingRadio(
        `${SavedFilters.MinRating}-${SavedFilters.MaxRating}`
      );
      setSavedPathName(savedPathName);
    }
  }, [SavedFilters, savedProducts, savedPathName]);

  useEffect(() => {
    if (SavedFilters && savedProducts && savedPathName) {
      if (
        clickedSubmitButton &&
        SavedFilters.onSale === filters.onSale &&
        SavedFilters.MinRating === filters.MinRating &&
        SavedFilters.MaxRating === filters.MaxRating &&
        savedProducts.length > 0
      ) {
        console.log("sending the saved products to the products page");
        history.push({
          pathname: `/Products/${categoryId}`,
          state: { FilteredProducts: savedProducts },
        });
      }
    }
  }, [
    SavedFilters,
    savedProducts,
    savedPathName,
    clickedSubmitButton,
    filters,
    categoryId,
    history,
  ]);

  useEffect(() => {
    if (
      filters.onSale === null &&
      filters.MinRating === null &&
      filters.MaxRating === null
    ) {
      console.log("Setting the saved filters.......");
      console.log("the savedFilters are", SavedFilters);
      localStorage.setItem("filters", JSON.stringify(SavedFilters));
      localStorage.setItem("products", JSON.stringify(savedProducts));
      localStorage.setItem("pathName", savedPathName);
    } else {
      console.log("Setting the filters.......");
      console.log("the filtered products are", filteredProducts);
      localStorage.setItem("filters", JSON.stringify(filters));
      localStorage.setItem("products", JSON.stringify(filteredProducts));
      localStorage.setItem("pathName", location.pathname);
    }
  }, [
    location.pathname,
    filters,
    SavedFilters,
    savedProducts,
    savedPathName,
    filteredProducts,
  ]);

  const handleOnSaleRadioSelection = (e) => {
    const value = e.target.value;

    if (selectedOnSaleRadio === (value === "yes" ? true : false)) {
      console.log("the selected onSale radio hook is", selectedOnSaleRadio);
      console.log("the selected onSale radio is", value);
      setSelectedOnSaleRadio(null);
      // Unselect the rating if it's already selected
      console.log("The selected rating is unselected");
    } else {
      console.log("The selected rating is", value === "yes" ? true : false);
      setSelectedOnSaleRadio(value === "yes" ? true : false); // Set the selected rating
    }
  };

  const handleRatingRadioSelection = (e) => {
    const value = e.target.value;

    if (selectedRatingRadio === value) {
      setSelectedRatingRadio(null);
      // Unselect the rating if it's already selected
      console.log("The selected rating is unselected");
    } else {
      console.log("The selected rating is", value);
      setSelectedRatingRadio(value); // Set the selected rating
    }
  };

  const handleGetOnSaleFilterProducts = () => {
    fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        query: `
              query Category($categoryId: ID!, $onSale: Boolean!) {
                  category(categoryId: $categoryId) {
                      products(filter: { onSale: $onSale }) {
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
          onSale: filters.onSale,
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
        console.log("the onSale data is" + JSON.stringify(data));
        setOnSaleProducts(data.data.category.products);
      });
  };

  const handleGetReviewRatingFilterProducts = () => {
    fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        query: `
              query ProductsByReviewRating($categoryId: ID!, $minRating: Int!, $maxRating: Int!) {
                  productsByReviewRating(minRating: $minRating
                                         maxRating: $maxRating
                                         categoryId: $categoryId) 
                    {
                      id
                      name
                      description
                      quantity
                      image
                      price
                      onSale
                  }
              }
          `,
        variables: {
          categoryId: categoryId,
          minRating: filters.MinRating,
          maxRating: filters.MaxRating,
        },
        operationName: "ProductsByReviewRating",
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
        console.log("the reviewRating data is" + JSON.stringify(data));
        setReviewRatingProducts(data.data.productsByReviewRating);
      });
  };

  const handleSubmitFilter = (e) => {
    const onSaleRadio = document.querySelector('input[name="onSale"]:checked');
    const ratingRadio = document.querySelector('input[name="rating"]:checked');

    console.log("The selected onSale radio is", onSaleRadio);
    console.log("The selected rating radio is", ratingRadio);

    // Determine OnSale value
    const OnSale = onSaleRadio
      ? onSaleRadio.value === "yes"
        ? true
        : false
      : null;
    const rating = ratingRadio ? ratingRadio.value : null;

    // If both filters are null, navigate to the products page without any filters
    if (OnSale === null && rating === null) {
      if (
        window.alert(
          "Please select at least one filter option before submitting"
        )
      ) {
      }
    } else {
      // Extract rating values if the rating is not null
      console.log("I am in the else block");
      let minRating = null;
      let maxRating = null;

      if (rating !== null) {
        const ratingParts = rating.split("-");
        minRating = parseInt(ratingParts[0].trim(), 10);
        maxRating = parseInt(ratingParts[1].trim(), 10);
      }

      setFilters({
        onSale: OnSale !== null ? OnSale : null, // Update OnSale if it's not null
        MinRating: minRating,
        MaxRating: maxRating,
      });

      setPathName(location.pathname);
    }

    // Update filters state based on the selected filters

    console.log("Filter options submitted");
  };

  useEffect(() => {
    // Handle the logic when OnSale, MinRating, and MaxRating change
    if (filters.onSale !== null) {
      console.log("onSale value is", filters.onSale);
      console.log("Filtering products based on sale");
      handleGetOnSaleFilterProducts();
    }
    if (filters.MinRating !== null && filters.MaxRating !== null) {
      console.log("Filtering products based on review rating");
      handleGetReviewRatingFilterProducts();
    }
    if (
      filters.onSale === null &&
      filters.MinRating === null &&
      filters.MaxRating === null
    ) {
      console.log("Clearing the filtered products");
      setFilteredProducts([]);
    }
  }, [filters.onSale, filters.MinRating, filters.MaxRating]);

  useEffect(() => {
    if (
      clickedSubmitButton &&
      onSaleProducts.length === 0 &&
      reviewRatingProducts.length === 0
    ) {
      if (
        window.alert(
          "No products found based on the filter options, please change the filter options."
        )
      ) {
      }
      setSavedFilters(null);
      setFilters({
        onSale: null,
        MinRating: null,
        MaxRating: null,
      });
      setSavedProducts([]);
    }

    if (
      clickedSubmitButton &&
      onSaleProducts.length > 0 &&
      reviewRatingProducts.length === 0
    ) {
      console.log("Filtered products based on sale");
      setFilteredProducts(onSaleProducts);
    }

    if (
      clickedSubmitButton &&
      onSaleProducts.length === 0 &&
      reviewRatingProducts.length > 0
    ) {
      console.log("Filtered products based on review rating");
      setFilteredProducts(reviewRatingProducts);
    }

    if (
      clickedSubmitButton &&
      onSaleProducts.length > 0 &&
      reviewRatingProducts.length > 0
    ) {
      console.log("Filtered products based on sale and review rating");
      const filtered = onSaleProducts.filter((onSaleProduct) =>
        reviewRatingProducts.some(
          (reviewRatingProduct) => reviewRatingProduct.id === onSaleProduct.id
        )
      );
      setFilteredProducts(filtered);
    }
  }, [onSaleProducts, reviewRatingProducts]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      console.log(
        "The final product list is..." + JSON.stringify(filteredProducts)
      );
      console.log("the value of submit button is", clickedSubmitButton);
      if (clickedSubmitButton) {
        history.push({
          pathname: `/Products/${categoryId}`,
          state: { FilteredProducts: filteredProducts },
        });
      }
    }
  }, [filteredProducts]);

  return (
    <div className="Filter">
      <h1>Filter</h1>
      <div className="Filter-Options">
        <div className="onSale">
          <label className="onSale-label">On Sale</label>
          <label>
            <input
              type="radio"
              checked={selectedOnSaleRadio === true}
              onClick={handleOnSaleRadioSelection}
              name="onSale"
              value="yes"
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              checked={selectedOnSaleRadio === false}
              onClick={handleOnSaleRadioSelection}
              name="onSale"
              value="no"
            />{" "}
            No
          </label>
        </div>

        <div className="Rating">
          <label className="Rating-label">Rating</label>
          <label>
            <input
              type="radio"
              checked={selectedRatingRadio === "1-5"} // Check if this rating is selected
              onClick={handleRatingRadioSelection}
              name="rating"
              value="1-5"
            />{" "}
            1 - 5
          </label>
          <label>
            <input
              type="radio"
              checked={selectedRatingRadio === "2-5"}
              onClick={handleRatingRadioSelection}
              name="rating"
              value="2-5"
            />{" "}
            2 - 5
          </label>
          <label>
            <input
              type="radio"
              checked={selectedRatingRadio === "3-5"}
              onClick={handleRatingRadioSelection}
              name="rating"
              value="3-5"
            />{" "}
            3 - 5
          </label>
          <label>
            <input
              type="radio"
              checked={selectedRatingRadio === "4-5"}
              onClick={handleRatingRadioSelection}
              name="rating"
              value="4-5"
            />{" "}
            4 - 5
          </label>
        </div>

        <div className="Submit-Filter">
          <button
            onClick={(event) => {
              handleSubmitClicked();
              handleSubmitFilter(event);
            }}
          >
            Submit
          </button>
          <button
            onClick={() => {
              handleCancelClicked();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
