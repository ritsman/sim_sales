"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../config";

const Sales = () => {
  const [formData, setFormData] = useState({
    order_no: "",
    buyer: "",
    shipment_destination: "",
    whatsapp_number: "",
    shipment_type: "",
    confirm_date: "",
    entry_date: "",
    agent: "",
    factory_location: "",
    ex_factory_date: "",
    commission: "",
    payment_terms: "",
    delivery_terms: "",
    delivery_date: "",
  });

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [parties, setParty] = useState([]);
  const [buyerSearch, setBuyerSearch] = useState("");
  const [showBuyerDropdown, setShowBuyerDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term and selected category
  const filteredProducts = products.filter((product) => {
    return (
      product.styleName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || product.category === selectedCategory)
    );
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get(
          `${config.API_URL}/api/master/getProduct/`
        );
        const stockResponse = await axios.get(
          `${config.API_URL}/api/gallery/getStock/`
        );

        const productData = productResponse.data;
        const stockData = stockResponse.data;

        const stockMap = {};

        stockData.forEach((stock) => {
          stock.sizes.forEach(({ size, quantity }) => {
            if (!stockMap[stock.productId]) {
              stockMap[stock.productId] = {};
            }

            if (!stockMap[stock.productId][size]) {
              stockMap[stock.productId][size] = {
                totalIn: 0,
                totalOut: 0,
                totalReserved: 0,
                totalUnreserved: 0,
              };
            }

            if (stock.type === "IN") {
              stockMap[stock.productId][size].totalIn += quantity;
            } else if (stock.type === "OUT") {
              stockMap[stock.productId][size].totalOut += quantity;
            } else if (stock.type === "RESERVED") {
              stockMap[stock.productId][size].totalReserved += quantity;
            } else if (stock.type === "UNRESERVED") {
              stockMap[stock.productId][size].totalUnreserved += quantity;
            }
          });
        });

        // Merge stock data into product details
        const mergedData = productData.map((product) => {
          const sizesData = stockMap[product._id] || {};

          // Convert to UI-friendly format
          const sizesObject = Object.keys(sizesData).reduce((acc, size) => {
            acc[size] = Math.max(
              sizesData[size].totalIn -
                sizesData[size].totalOut -
                (sizesData[size].totalReserved -
                  sizesData[size].totalUnreserved),
              0 // Ensure stock never goes negative
            );
            return acc;
          }, {});

          const sizesObject2 = product.size.sizes.reduce((acc, size) => {
            acc[size] = 0;
            return acc;
          }, {});

          let colorObj = {
            "#9900ff": "Purple",
            "#ffff00": "Yellow",
            "#000000": "Black",
            "#ffffff": "White",
            "#ff1493": "Deep Pink",
            "#8b4513": "Brown",
          };

          const firstEntry = Object.entries(colorObj)[0];

          return {
            ...product,
            sizes: sizesObject,
            sizes2: sizesObject2,
            colors: colorObj,
            selectedColor: { hex: firstEntry[0], name: firstEntry[1] },
            image: product.images?.image1 || "https://via.placeholder.com/150",
            isSelected: false,
          };
        });

        setProducts(mergedData);
        // Extract unique categories
        const uniqueCategories = [
          ...new Set(mergedData.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    const fetchParty = async () => {
      try {
        const partyRes = await axios.get(
          `${config.API_URL}/api/master/getParty/`
        );
        console.log(partyRes.data);
        setParty(partyRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
    fetchParty();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addProductToOrder = (product) => {
    const allSizesZeroStock = Object.values(product.sizes).every(
      (sizeData) => sizeData === 0
    );

    // Generate a unique ID for this product selection (product ID + color)
    const productSelectionId = `${product._id}-${product.selectedColor.hex}`;

    // Check if this exact product + color combination already exists in the selection
    const existingProductIndex = selectedProducts.findIndex(
      (p) => `${p._id}-${p.selectedColor.hex}` === productSelectionId
    );

    if (existingProductIndex >= 0) {
      // If already exists, you may want to update it or notify the user
      toast.info("This product with the same color is already in your order!");
      return;
    }

    setSelectedProducts((prev) => [
      ...prev,
      {
        ...product,
        sizes: { ...product.sizes },
        selectedColor: product.selectedColor,
        selectionId: productSelectionId, // Add a unique ID for this selection
      },
    ]);

    setSearchTerm("");
  };

  // Handle color selection
  const handleColorSelect = (productId, hex, colorName) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId
          ? { ...p, selectedColor: { hex, name: colorName } }
          : p
      )
    );
  };

  const handleBuyerSelect = (buyer) => {
    setFormData((prev) => ({ ...prev, buyer }));
    setBuyerSearch("");
    setShowBuyerDropdown(false);
  };

  const removeProductFromOrder = (selectionId) => {
    setSelectedProducts((prev) =>
      prev.filter((product) => product.selectionId !== selectionId)
    );
  };

  const updateQuantity = (index, size, quantity) => {
    setSelectedProducts((prev) => {
      const updatedProducts = [...prev];
      const product = updatedProducts[index];

      // Convert quantity to a number
      const enteredQuantity = Number(quantity);

      // Update available stock
      product.sizes2[size] = enteredQuantity;
      return updatedProducts;
    });
  };

  useEffect(() => {
    console.log(selectedProducts, "selected Prod");
  }, [selectedProducts]);

  const calculateProductTotal = (product) => {
    let total = 0;
    Object.values(product.sizes2).forEach((quantity) => {
      total += Number(quantity) * Number(product.price || 0);
    });
    return total;
  };

  const calculateGrandTotal = () => {
    return selectedProducts.reduce((sum, product) => {
      return sum + calculateProductTotal(product);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("selected prod", selectedProducts);

    // 1️⃣ Validate if all form fields are filled
    const requiredFields = [
      "order_no",
      "buyer",
      "shipment_destination",
      "whatsapp_number",
      "shipment_type",
      "confirm_date",
      "entry_date",
      "agent",
      "factory_location",
      "ex_factory_date",
      "commission",
      "payment_terms",
      "delivery_terms",
      "delivery_date",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field.replace("_", " ")}`);
        return;
      }
    }

    // 2️⃣ Validate if at least one product is selected
    if (selectedProducts.length === 0) {
      toast.error("Please add at least one product to the order.");
      return;
    }

    // 3️⃣ Ensure at least ONE size has a valid quantity
    let hasValidQuantity = false;

    for (let product of selectedProducts) {
      for (let size in product.sizes2) {
        if (product.sizes2[size] > 0) {
          hasValidQuantity = true;
          break;
        }
      }
      if (hasValidQuantity) break; // Exit early if a valid size is found
    }

    if (!hasValidQuantity) {
      toast.error(
        "At least one selected product must have a quantity greater than 0."
      );
      return;
    }

    const grandTotal = calculateGrandTotal();
    const orderData = {
      ...formData,
      products: selectedProducts,
      grandTotal,
    };

    try {
      // Reserve stock first
      console.log(selectedProducts, "selected");
      const reserveResponse = await axios.post(
        `${config.API_URL}/api/gallery/reserveStock`,
        { products: selectedProducts }
      );

      if (reserveResponse.data.success) {
        // Proceed to save the order
        await axios.post(`${config.API_URL}/api/sales/postSales`, orderData);

        toast.success("Order placed successfully!");

        // Reset form
        setFormData({
          order_no: "",
          buyer: "",
          shipment_destination: "",
          whatsapp_number: "",
          shipment_type: "",
          confirm_date: "",
          entry_date: "",
          agent: "",
          factory_location: "",
          ex_factory_date: "",
          commission: "",
          payment_terms: "",
          delivery_terms: "",
          delivery_date: "",
        });
        setSelectedProducts([]);
      } else {
        toast.error("Not enough stock available!");
      }
    } catch (error) {
      toast.error("Error placing order");
      console.error(error);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="bg-gradient-to-r from-green-800 to-green-800 text-white p-6 rounded-t-2xl">
        <h2 className="text-2xl font-bold mb-2">Create Sales Order</h2>
      </div>

      {/* Order Form Fields */}
      <div className="grid grid-cols-3 mt-3 gap-6 mb-6">
        {Object.keys(formData).map((key) => (
          <div key={key} className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
              {key.replace("_", " ")}
            </label>
            {key === "buyer" ? (
              <div className="relative">
                <input
                  type="text"
                  name={key}
                  value={buyerSearch || formData[key]}
                  onChange={(e) => {
                    setBuyerSearch(e.target.value);
                    setShowBuyerDropdown(true);
                  }}
                  className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {showBuyerDropdown && buyerSearch && (
                  <ul className="absolute bg-white z-10 border border-green-200 w-full max-h-40 overflow-y-auto shadow-lg rounded-lg">
                    {parties
                      .filter((party) =>
                        party.companyName
                          .toLowerCase()
                          .includes(buyerSearch.toLowerCase())
                      )
                      .map((party) => (
                        <li
                          key={party._id}
                          className="p-3 hover:bg-green-50 cursor-pointer transition-colors"
                          onClick={() => handleBuyerSelect(party.companyName)}
                        >
                          {party.companyName}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ) : (
              <input
                type={key.includes("date") ? "date" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            )}
          </div>
        ))}
      </div>

      {/* Two Column Layout for Products and Selected Items */}
      <div className="flex flex-row gap-6 mt-6">
        {/* Left Column - Product Gallery */}
        <div className="w-2/3">
          <h3 className="text-lg font-semibold">Products Gallery</h3>

          {/* Category Filter & Search */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex gap-4 items-end">
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Product
                </label>
                <input
                  type="text"
                  placeholder="Search by product name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="border-2 border-gray-300 px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-4 overflow-y-auto max-h-[700px] border rounded-lg p-2">
            <div className="grid grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="border-2 border-green-200 p-4 rounded-lg shadow relative hover:shadow-lg cursor-pointer"
                >
                  {/* Make the image and details clickable to add the product */}
                  <div onClick={() => addProductToOrder(product)}>
                    <img
                      src={`${config.API_URL}${product.image}`}
                      alt={product.styleName}
                      className="w-full h-32 object-cover rounded"
                    />
                    <h4 className="text-center font-semibold mt-2">
                      {product.styleName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Price: ₹{product.price}
                    </p>

                    {/* Size & Qty Section */}
                    <div className="border p-3 shadow-sm rounded-md bg-gray-50 my-2">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Size & Qty
                      </h4>
                      {Object.keys(product.sizes).length === 0 ? (
                        <p className="text-red-600 font-bold">Out of Stock</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                          {Object.keys(product.sizes).map((key) => (
                            <div
                              key={key}
                              className="flex justify-between px-2 py-1 bg-white rounded-md shadow-sm"
                            >
                              <span className="font-medium">{key}</span>
                              <span className="text-blue-600">
                                {product.sizes[key]}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Color Palettes with Click Functionality */}
                  {product.colors && Object.keys(product.colors).length > 0 && (
                    <div className="mt-2 border p-3 shadow-sm rounded-md bg-gray-50">
                      {/* Color Label & Hover Name */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          Available Colors:
                        </span>
                        <span
                          id={`color-name-${product._id}`}
                          className="text-gray-600 font-semibold"
                        ></span>
                      </div>

                      {/* Color Circles - now clickable */}
                      <div className="flex flex-wrap justify-start gap-2 mt-1">
                        {Object.entries(product.colors)
                          .slice(0, 6)
                          .map(([hex, name], index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border border-gray-400 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                              style={{
                                backgroundColor: hex,
                                // Add a highlight for the selected color
                                boxShadow:
                                  product.selectedColor?.hex === hex
                                    ? "0 0 0 2px white, 0 0 0 4px #3b82f6"
                                    : "",
                              }}
                              onMouseEnter={() => {
                                document.getElementById(
                                  `color-name-${product._id}`
                                ).innerText = name;
                              }}
                              onMouseLeave={() => {
                                document.getElementById(
                                  `color-name-${product._id}`
                                ).innerText = "";
                              }}
                              onClick={(e) => {
                                // Stop event propagation to prevent adding product to order
                                e.stopPropagation();
                                handleColorSelect(product._id, hex, name);
                              }}
                            ></div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Add to Order button */}
                  <button
                    onClick={() => addProductToOrder(product)}
                    className="w-full mt-3 py-2 rounded-lg text-white font-semibold transition-colors bg-[#310b6b] hover:bg-purple-800"
                  >
                    Add to Order
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Selected Products */}
        <div className="w-1/3">
          <div className="sticky top-4">
            <div className="bg-gray-50 border rounded-lg p-4">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                Your Order
              </h3>

              {selectedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p>No products selected</p>
                  <p className="text-sm mt-2">
                    Click on products to add them to your order
                  </p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <ul className="space-y-4">
                    {selectedProducts.map((product, index) => (
                      <li
                        key={product.selectionId}
                        className="p-3 border-2 border-green-200 rounded-lg shadow-md bg-white"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">{product.styleName}</h4>
                          <button
                            className="text-red-500 font-bold bg-red-100 px-2 py-1 rounded hover:bg-red-200 text-sm"
                            onClick={() =>
                              removeProductFromOrder(product.selectionId)
                            }
                          >
                            Remove
                          </button>
                        </div>

                        <div className="text-sm text-gray-600 mb-2 flex justify-between">
                          <span>Price: ₹{product.price}</span>

                          {/* Display selected color in the order */}
                          {product.selectedColor && (
                            <span className="inline-flex items-center">
                              <span
                                className="w-3 h-3 rounded-full mr-1"
                                style={{
                                  backgroundColor: product.selectedColor.hex,
                                }}
                              ></span>
                              {product.selectedColor.name}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          {Object.keys(product.sizes2).map((size) => (
                            <div
                              key={size}
                              className="flex items-center justify-between bg-gray-50 p-2 rounded"
                            >
                              <span className="font-medium text-gray-700 w-16">
                                {size}:
                              </span>
                              <div className="flex items-center">
                                <input
                                  type="text"
                                  max={product.sizes[size]}
                                  value={product.sizes2[size]}
                                  onChange={(e) =>
                                    updateQuantity(index, size, e.target.value)
                                  }
                                  className="border px-2 py-1 rounded w-16 focus:ring focus:ring-green-300 text-center"
                                />
                                <span className="text-xs ml-2 text-gray-500">
                                  Avail:{" "}
                                  {product.sizes[size]
                                    ? product.sizes[size]
                                    : 0}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 text-right border-t pt-2">
                          <p className="font-semibold">
                            Subtotal: ₹
                            {calculateProductTotal(product).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-4 border-t-2">
                    <div className="flex justify-between text-lg font-bold text-green-800">
                      <span>Grand Total:</span>
                      <span>₹{calculateGrandTotal().toFixed(2)}</span>
                    </div>

                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="w-full mt-4 bg-[#310b6b] text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Submit Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
