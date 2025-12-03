import React, { useState, useEffect } from 'react';
import { fetchProducts, addProduct, deleteProduct } from '../../api/productService'; // Đảm bảo đường dẫn import đúng

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        productName: '',
        price: '',
        image: 'https://placehold.co/600x400', // Ảnh mặc định cho đẹp
        description: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addProduct(newProduct);
            alert("Thêm sản phẩm thành công!");
            setNewProduct({ productName: '', price: '', image: 'https://placehold.co/600x400', description: '' });
            loadProducts();
        } catch (error) {
            alert("Lỗi khi thêm sản phẩm (Kiểm tra quyền Admin hoặc API).");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            try {
                await deleteProduct(id);
                alert("Đã xóa thành công!");
                loadProducts();
            } catch (error) {
                alert("Lỗi khi xóa sản phẩm.");
                console.error(error);
            }
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Product management (Admin)</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FORM THÊM SẢN PHẨM */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                        <h4 className="text-xl font-semibold mb-4 text-gray-700">Add Product</h4>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">name</label>
                                <input
                                    type="text" name="productName"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={newProduct.name} onChange={handleInputChange} required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">price ($)</label>
                                <input
                                    type="number" name="price"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={newProduct.price} onChange={handleInputChange} required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">iamge url: </label>
                                <input
                                    type="text" name="image"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={newProduct.imageUrl} onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={newProduct.description} onChange={handleInputChange} rows="3"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full py-2 px-4 rounded-md text-white font-bold transition duration-300 ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Thêm Sản Phẩm'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* DANH SÁCH SẢN PHẨM */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((prod) => (
                                    <tr key={prod.productId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{prod.productId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img src={prod.imageUrl} alt={prod.productName} className="h-10 w-10 rounded-full object-cover border" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{prod.productName}</div>
                                            <div className="text-sm text-gray-500">${prod.price}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteProduct(prod.productId)}
                                                className="text-red-600 hover:text-red-900 border border-red-200 px-3 py-1 rounded hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Chưa có sản phẩm nào.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;