"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const apollo_server_errors_1 = require("apollo-server-errors");
const uuid_1 = require("uuid");
const mongoose_1 = __importDefault(require("mongoose"));
exports.Mutation = {
    addNewCategory: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { input }, context) {
        if (context.user.role === "admin") {
            const { name } = input;
            const newCategory = {
                id: (0, uuid_1.v4)(),
                name,
            };
            try {
                yield context.CategoryModel.create(newCategory);
                return newCategory;
            }
            catch (err) {
                if (err.errmsg.includes("duplicate key error") &&
                    err.code === 11000) {
                    throw new apollo_server_errors_1.ApolloError("Category name must be unique", "Conflict", {
                        statusCode: 409,
                    });
                }
                throw err;
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    addNewProduct: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { input }, context) {
        if (context.user.role === "admin") {
            const { name, image, price, onSale, quantity, categoryId, description } = input;
            const newProduct = {
                id: (0, uuid_1.v4)(),
                name,
                image,
                price,
                onSale,
                quantity,
                categoryId,
                description,
            };
            try {
                yield context.ProductModel.create(newProduct);
                return newProduct;
            }
            catch (err) {
                if (err.errmsg.includes("duplicate key error") &&
                    err.code === 11000) {
                    throw new apollo_server_errors_1.ApolloError("Product name must be unique", "Conflict", {
                        statusCode: 409,
                    });
                }
                throw err;
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    // (try altair to test this mutation)
    addNewProducts: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { input }, context) {
        console.log("the input is.." + JSON.stringify(input.products));
        if (context.user.role === "admin") {
            const newProducts = input.products.map((productinput) => {
                const { name, image, price, onSale, quantity, categoryId, description, } = productinput;
                const newProduct = {
                    id: (0, uuid_1.v4)(),
                    name,
                    image,
                    price,
                    onSale,
                    quantity,
                    categoryId,
                    description,
                };
                return newProduct;
            });
            context.ProductModel.create(newProducts);
            return newProducts;
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    addNewReview: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { input }, context) {
        if (context.user.role === "admin") {
            const { date, title, comment, rating, productId } = input;
            const newReview = {
                id: (0, uuid_1.v4)(),
                date,
                title,
                comment,
                rating,
                productId,
            };
            try {
                yield context.ReviewModel.create(newReview);
                return newReview;
            }
            catch (err) {
                if (err.errmsg.includes("duplicate key error") &&
                    err.code === 11000) {
                    throw new apollo_server_errors_1.ApolloError("Review must be unique", "Conflict", {
                        statusCode: 409,
                    });
                }
                throw err;
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    // the below mutation is for adding a new user to the database
    // like a signup operation so don't need to check the role
    addNewUser: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { input }, context) {
        const { username, password, role } = input;
        console.log("the input is.." + JSON.stringify(input));
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = {
            id: (0, uuid_1.v4)(),
            username,
            password: hashedPassword,
            role,
        };
        const existingUser = yield context.PeopleModel.findOne({ username });
        console.log("existing user is.." + JSON.stringify(existingUser));
        try {
            if (existingUser) {
                console.log("Username must be unique");
                throw new apollo_server_errors_1.ApolloError("Username must be unique", "Conflict", {
                    statusCode: 409,
                });
            }
            else {
                yield context.PeopleModel.create(newUser);
                return newUser;
            }
        }
        catch (err) {
            throw err;
        }
    }),
    deleteCategory: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { categoryID }, context) {
        if (context.user.role === "admin") {
            try {
                let query = {
                    // converting the string to ObjectId
                    categoryId: new mongoose_1.default.Types.ObjectId(categoryID),
                };
                let updateOperation = { $set: { categoryId: null } };
                yield context.CategoryModel.findByIdAndDelete(query.categoryId);
                yield context.ProductModel.updateMany(query, updateOperation);
                return true;
            }
            catch (err) {
                throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the category", "Internal Server Error", {
                    statusCode: 500,
                });
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    deleteProduct: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { productID }, context) {
        if (context.user.role === "admin") {
            try {
                let query = {
                    productId: new mongoose_1.default.Types.ObjectId(productID),
                };
                yield context.ProductModel.findByIdAndDelete(query.productId);
                yield context.ReviewModel.deleteMany(query);
                return true;
            }
            catch (err) {
                throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the product", "Internal Server Error", {
                    statusCode: 500,
                });
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    deleteReview: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { reviewID }, context) {
        if (context.user.role === "admin") {
            try {
                yield context.ReviewModel.findByIdAndDelete(reviewID);
                return true;
            }
            catch (err) {
                throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the review", "Internal Server Error", {
                    statusCode: 500,
                });
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    updateCategory: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { categoryID, input }, context) {
        if (context.user.role === "admin") {
            try {
                const updatedCategory = yield context.CategoryModel.findByIdAndUpdate(categoryID, input, {
                    // By default, MongoDB's findByIdAndUpdate operation returns the original document before it was updated.
                    // If you set new: true, it will return the updated document.
                    new: true,
                });
                return updatedCategory;
            }
            catch (err) {
                throw new apollo_server_errors_1.ApolloError("An error occurred while updating the category", "Internal Server Error", {
                    statusCode: 500,
                });
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    // addToCart(userId, productId, quantity)
    addToCart: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        const { userId, items } = input;
        // Check permission
        if (context.user._id.toString() !== userId.toString()) {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
        // Check if user exists
        const user = yield context.PeopleModel.findById(userId);
        if (!user) {
            throw new apollo_server_errors_1.ApolloError("User not found", "Not Found", {
                statusCode: 404,
            });
        }
        // Utility: Validate and decrement product stock
        const validateAndDecrementProduct = (productId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
            const product = (yield context.ProductModel.findById(productId));
            if (!product) {
                throw new apollo_server_errors_1.ApolloError("Product not found", "Not Found", {
                    statusCode: 404,
                });
            }
            if (quantity > product.quantity) {
                throw new apollo_server_errors_1.ApolloError("Requested quantity exceeds available stock", "Bad Request", {
                    statusCode: 400,
                });
            }
            product.quantity -= quantity;
            yield product.save();
        });
        // Check if cart exists
        let cart = (yield context.CartModel.findOne({ userId }));
        // IF CART DOESN'T EXIST FOR THE USER, CREATE A NEW ONE
        if (!cart) {
            // New cart case
            // UPDATE THE QUANTITY IN THE PRODUCTS COLLECTION FOR EACH ITEM
            for (const item of items) {
                yield validateAndDecrementProduct(item.productId.toString(), item.quantity);
            }
            // CREATE A NEW CART OBJECT AND SAVE IT TO THE DATABASE
            const newCart = new context.CartModel({
                id: (0, uuid_1.v4)(),
                userId,
                items,
            });
            yield newCart.save();
            return newCart;
        }
        // CART EXISTS, UPDATE IT
        // Update existing cart case
        // UPDATE THE QUANTITY IN THE PRODUCTS COLLECTION FOR EACH ITEM
        for (const item of items) {
            const existingItem = cart.items.find((i) => i.productId.toString() === item.productId.toString());
            // UPDATE THE PRODUCT QUANTITY IN THE PRODUCTS COLLECTION
            yield validateAndDecrementProduct(item.productId.toString(), item.quantity);
            // IF ITEM ALREADY EXISTS IN CART, INCREMENT THE QUANTITY
            if (existingItem) {
                existingItem.quantity += item.quantity;
            }
            // ELSE, ADD THE NEW ITEM TO THE CART
            else {
                cart.items.push(item);
            }
        }
        yield cart.save();
        return cart;
    }),
    // Remove item from cart
    removeFromCart: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        const { userId, productId } = input;
        // Check permission
        if (context.user._id.toString() !== userId.toString()) {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
        // Check if user exists
        const user = yield context.PeopleModel.findById(userId);
        if (!user) {
            throw new apollo_server_errors_1.ApolloError("User not found", "Not Found", {
                statusCode: 404,
            });
        }
        // Check if cart exists
        const cart = (yield context.CartModel.findOne({ userId }));
        if (!cart) {
            throw new apollo_server_errors_1.ApolloError("Cart not found", "Not Found", {
                statusCode: 404,
            });
        }
        // Find the item in the cart
        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId.toString());
        if (itemIndex === -1) {
            throw new apollo_server_errors_1.ApolloError("Item not found in cart", "Not Found", {
                statusCode: 404,
            });
        }
        // Remove the item from the cart
        // What is this splice method?
        // array.splice(startIndex, deleteCount)
        // This method deletes the items starting from startIndex and deletes deleteCount number of items
        // EXAMPLE TO UNDERSTAND SPLICE:
        // const arr = [10, 20, 30, 40, 50];
        // arr.splice(1, 2);  // removes 2 elements: index 1 (20) and index 2 (30)
        // console.log(arr);  // [10, 40, 50]
        cart.items.splice(itemIndex, 1);
        yield cart.save();
        return true;
    }),
};
