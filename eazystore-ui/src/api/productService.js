import apiClient from "./apiClient";



// Lấy danh sách sản phẩm
export const fetchProducts = async () => {
    const response = await apiClient.get("/products");
    return response.data;
};

// Thêm sản phẩm mới
export const addProduct = async (productData) => {
    // productData là object chứa thông tin như name, price, image...
    const response = await apiClient.post("/products", productData);
    return response.data;
};

// Xóa sản phẩm
export const deleteProduct = async (productId) => {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
};