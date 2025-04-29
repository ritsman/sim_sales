import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../config";
import Select from "react-select";
import { findIndex } from "lodash";

const Sales = () => {
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [selectedBuyerId, setSelectedBuyerId] = useState("");
  const [formData, setFormData] = useState({
    order_no: "",
    buyer: "",
    buyerId: "",
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
        const [productResponse, stockResponse, productCollectionsResponse] =
          await Promise.all([
            axios.get(`${config.API_URL}/api/master/getProduct/`),
            axios.get(`${config.API_URL}/api/gallery/getStock/`),
            axios.get(`${config.API_URL}/api/master/getSkuProduct/`),
          ]);

        const productData = productResponse.data || [];
        const stockData = stockResponse.data || [];
        const productCollectionsData = productCollectionsResponse.data || [];

        const stockMap = {};

        // Map stock data by product ID and size
        stockData.forEach(({ productId, type, sizes }) => {
          sizes.forEach(({ size, quantity }) => {
            if (!stockMap[productId]) {
              stockMap[productId] = {};
            }

            if (!stockMap[productId][size]) {
              stockMap[productId][size] = {
                totalIn: 0,
                totalOut: 0,
                totalReserved: 0,
                totalUnreserved: 0,
              };
            }

            // Update stock calculations
            if (type === "IN") {
              stockMap[productId][size].totalIn += quantity;
            } else if (type === "OUT") {
              stockMap[productId][size].totalOut += quantity;
            } else if (type === "RESERVED") {
              stockMap[productId][size].totalReserved += quantity;
            } else if (type === "UNRESERVED") {
              stockMap[productId][size].totalUnreserved += quantity;
            }
          });
        });

        // Group products by SKU
        const groupedProducts = {};

        productData.forEach((product) => {
          if (!product || !product._id) return;

          const sizesData = stockMap[product._id] || {};
          let productCol = productCollectionsData.find(
            (item) => item?.productId === product._id
          );

          let skuId = null;

          if (productCol) {
            skuId = productCol.skuId;
          }

          let allrelatedProd = [];

          if (skuId) {
            allrelatedProd = productCollectionsData.filter(
              (item) => item?.skuId === skuId
            );
          }

          let variations = [];
          allrelatedProd.forEach((item) => {
            if (!item || !item.productId) return;
            let obj = productData.find(
              (item2) => item2?._id === item.productId
            );
            if (obj) {
              variations.push(obj);
            }
          });

          let variation = variations.map((item) => {
            const sizesData = stockMap[product._id] || {};

            // Calculate available stock per size
            const availableStock = Object.keys(sizesData).reduce(
              (acc, size) => {
                acc[size] = Math.max(
                  sizesData[size].totalIn -
                    sizesData[size].totalOut -
                    (sizesData[size].totalReserved -
                      sizesData[size].totalUnreserved),
                  0 // Ensure stock doesn't go negative
                );
                return acc;
              },
              {}
            );

            // Ensure sizes object is initialized
            const initialSizes = product.size.sizes.reduce((acc, size) => {
              acc[size] = 0;
              return acc;
            }, {});
            return {
              ...item,
              sizes: availableStock,
              sizes2: initialSizes,
            };
          });

          let selectedInd = variations.findIndex(
            (ite) => ite._id == product._id
          );
          // If product doesn't exist in groupedProducts, initialize it
          if (!groupedProducts[product._id]) {
            groupedProducts[product._id] = {
              _id: product._id,
              skuId: skuId,
              styleName: product.styleName || "Unknown Style",
              category: product.category || "Uncategorized",
              season: product.season || "",
              variations: variation.length > 0 ? variation : [product], // Include at least this product as a variation
              selectedIndex: selectedInd >= 0 ? selectedInd : 0, // Default to first variation
            };
          }
        });

        // Convert object to array and ensure variations have all required properties
        const finalProducts = Object.values(groupedProducts).map((product) => {
          // Make sure each variation has properly defined properties
          const processedVariations = product.variations.map((variation) => {
            // Ensure color object exists
            if (!variation.color) {
              variation.color = {
                hex: "#CCCCCC",
                colorName: "Default",
              };
            }

            // Ensure sizes exist
            if (!variation.sizes) {
              variation.sizes = {};

              // If product has size info, use it
              if (variation.size && variation.size.sizes) {
                variation.size.sizes.forEach((size) => {
                  variation.sizes[size] = 0;
                });
              }
            }

            // Ensure sizes2 exists (for quantity selection)
            if (!variation.sizes2) {
              variation.sizes2 = { ...variation.sizes };
              // Reset quantities to 0
              Object.keys(variation.sizes2).forEach((size) => {
                variation.sizes2[size] = 0;
              });
            }

            // Ensure image exists
            if (!variation.image) {
              variation.image =
                variation.images?.image1 || "https://via.placeholder.com/150";
            }

            return variation;
          });

          return {
            ...product,
            variations: processedVariations,
          };
        });
        console.log(finalProducts);
        setProducts(finalProducts);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(finalProducts.map((p) => p?.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products", error);
        toast.error("Failed to load products");
      }
    };

    const fetchParty = async () => {
      try {
        const partyRes = await axios.get(
          `${config.API_URL}/api/master/getParty/`
        );
        let option = partyRes.data.map((party) => ({
          value: party,
          label: party.companyName,
        }));
        setParty(option);
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

  const addProductToOrder = (product, prodId, selectedIndex) => {
    // Check if all sizes have zero stock
    const isOutOfStock = Object.values(product.sizes).every((qty) => qty === 0);

    if (isOutOfStock) {
      toast.error("This product is out of stock!");
      return;
    }

    // Get the selected color information
    const selectedColor = {
      hex: product.color.hex,
      name: product.color.colorName,
    };

    // Generate a unique ID based on SKU & selected color
    const productSelectionId = `${prodId}-${product.color.hex}`;

    // Check if the same SKU & color combination is already added
    const isProductAlreadyAdded = selectedProducts.some(
      (p) => p.selectionId === productSelectionId
    );

    if (isProductAlreadyAdded) {
      toast.info("This product with the same color is already in your order!");
      return;
    }

    // Add product to selected list with all required properties
    setSelectedProducts((prev) => [
      ...prev,
      {
        // skuId: skuId,
        styleName: products.find((p) => p._id === prodId).styleName,
        price: product.price,
        sizes: { ...product.sizes }, // Available stock
        sizes2: { ...product.sizes2 }, // Selected quantities
        image: product.image,
        selectedColor: selectedColor, // Store selected color
        selectionId: productSelectionId, // Unique identifier
        _id: product._id, // Add product ID for stock reservation
      },
    ]);

    // Reset search term if applicable
    setSearchTerm("");
  };

  const handleColorSelect = (prodIndex, colorIndex) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, index) =>
        index === prodIndex
          ? { ...product, selectedIndex: colorIndex }
          : product
      )
    );
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleBuyerSelect = (buyers) => {
    console.log(buyers.value);
    let buyer = buyers.value;
    setSelectedBuyer(buyer.companyName);
    setSelectedBuyerId(buyer._id);
    setFormData((prev) => ({ ...prev, buyerId: buyer._id }));
    setFormData((prev) => ({ ...prev, buyer: buyer.companyName }));
    // setBuyerSearch("");
    // setShowBuyerDropdown(false);
  };

  useEffect(() => {
    console.log(selectedBuyer);
  }, [selectedBuyer]);

  const removeProductFromOrder = (selectionId) => {
    setSelectedProducts((prev) =>
      prev.filter((product) => product.selectionId !== selectionId)
    );
  };

  const updateQuantity = (index, size, quantity) => {
    setSelectedProducts((prev) => {
      const updatedProducts = [...prev];
      const product = updatedProducts[index];

      // Convert quantity to a number and ensure it's not negative
      const enteredQuantity = Math.max(0, Number(quantity));

      // Ensure it doesn't exceed available stock
      const availableStock = product.sizes[size] || 0;
      const finalQuantity = Math.min(enteredQuantity, availableStock);

      // Update selected quantity
      product.sizes2[size] = finalQuantity;
      return updatedProducts;
    });
  };

  const calculateProductTotal = (product) => {
    let total = 0;
    Object.entries(product.sizes2).forEach(([size, quantity]) => {
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

    // Prepare products data for reservation and order creation
    const productsForReservation = selectedProducts.map((product) => {
      return {
        productId: product._id,
        sizes: Object.entries(product.sizes2)
          .filter(([_, qty]) => Number(qty) > 0)
          .map(([size, qty]) => ({ size, quantity: Number(qty) })),
      };
    });

    const grandTotal = calculateGrandTotal();
    const orderData = {
      ...formData,
      products: selectedProducts,
      grandTotal,
    };
    console.log(productsForReservation);
    try {
      // Reserve stock first
      const reserveResponse = await axios.post(
        `${config.API_URL}/api/gallery/reserveStock`,
        { products: productsForReservation }
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
              <Select
                options={parties}
                value={selectedBuyer}
                onChange={(selectedOption) => {
                  handleBuyerSelect(selectedOption);
                  setSelectedBuyer(selectedOption);
                }}
                placeholder="Search party..."
                className="w-full"
              />
            ) : (
              <input
                type={key.includes("date") ? "date" : "text"}
                name={key}
                value={formData[key]}
                readOnly={key == "buyerId" ? true : false}
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
              {filteredProducts.map((product, prodIndex) => {
                const selectedVariation =
                  product.variations[product.selectedIndex];

                return (
                  <div
                    key={product._id}
                    className="border-2 border-green-200 p-4 rounded-lg shadow relative hover:shadow-lg cursor-pointer"
                  >
                    {/* Image & Details Clickable for Adding to Order */}
                    <div
                      onClick={() =>
                        addProductToOrder(
                          selectedVariation,
                          product.sku,
                          product.selectedIndex
                        )
                      }
                    >
                      <img
                        src={`${config.API_URL}${selectedVariation.image}`}
                        alt={product.styleName}
                        className="w-full h-32 object-cover rounded"
                      />
                      <h4 className="text-center font-semibold mt-2">
                        {product.styleName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Price: ₹{selectedVariation.price}
                      </p>

                      {/* Size & Qty Section */}
                      <div className="border p-3 shadow-sm rounded-md bg-gray-50 my-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Size & Qty
                        </h4>
                        {Object.keys(selectedVariation.sizes).length === 0 ? (
                          <p className="text-red-600 font-bold">Out of Stock</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                            {Object.keys(selectedVariation.sizes).map(
                              (size) => (
                                <div
                                  key={size}
                                  className="flex justify-between px-2 py-1 bg-white rounded-md shadow-sm"
                                >
                                  <span className="font-medium">{size}</span>
                                  <span className="text-blue-600">
                                    {selectedVariation.sizes[size]}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Color Selection */}
                    {product.variations.length > 0 && (
                      <div className="mt-2 border p-3 shadow-sm rounded-md bg-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">
                            Selected:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {selectedVariation.color.colorName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-medium text-gray-700">
                            Available Colors:
                          </span>
                        </div>

                        <div className="flex flex-wrap justify-start gap-2 mt-1">
                          {product.variations.map((variation, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border border-gray-400 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                              style={{
                                backgroundColor: variation.color.hex,
                                boxShadow:
                                  product.selectedIndex === index
                                    ? "0 0 0 2px white, 0 0 0 4px #3b82f6"
                                    : "",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleColorSelect(prodIndex, index);
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add to Order Button */}
                    <button
                      onClick={() =>
                        addProductToOrder(
                          selectedVariation,
                          product._id,
                          product.selectedIndex
                        )
                      }
                      className="w-full mt-3 py-2 rounded-lg text-white font-semibold transition-colors bg-[#310b6b] hover:bg-purple-800"
                    >
                      Add to Order
                    </button>
                  </div>
                );
              })}
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

                        {/* Price & Selected Color */}
                        <div className="text-sm text-gray-600 mb-2 flex justify-between">
                          <span>Price: ₹{product.price}</span>
                          <span className="inline-flex items-center">
                            <span
                              className="w-4 h-4 rounded-full border border-gray-400 mr-2"
                              style={{
                                backgroundColor: product.selectedColor.hex,
                              }}
                            ></span>
                            {product.selectedColor.name}
                          </span>
                        </div>

                        {/* Size & Quantity Selection */}
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
                                  value={product.sizes2[size]}
                                  onChange={(e) =>
                                    updateQuantity(index, size, e.target.value)
                                  }
                                  className="border px-2 py-1 rounded w-16 focus:ring focus:ring-green-300 text-center"
                                />
                                <span className="text-xs ml-2 text-gray-500">
                                  Avail: {product.sizes[size] || 0}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Subtotal Calculation */}
                        <div className="mt-2 text-right border-t pt-2">
                          <p className="font-semibold">
                            Subtotal: ₹
                            {calculateProductTotal(product).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Grand Total & Submit Button */}
                  <div className="mt-4 pt-4 border-t-2">
                    <div className="flex justify-between text-lg font-bold text-green-800">
                      <span>Grand Total:</span>
                      <span>₹{calculateGrandTotal().toFixed(2)}</span>
                    </div>

                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="w-full mt-4 bg-[#310b6b] text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition-colors font-semibold"
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
