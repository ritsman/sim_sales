import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";

const Shipment = () => {
  const [orders, setOrders] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [dispatchData, setDispatchData] = useState({});
  const [dispatchDataByProduct , setDispatchDataByProduct] = useState([]);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dispatchedData , setDispatchedData]= useState([])

 useEffect(() => {
  
   fetchData();
 }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersResponse, stockResponse] = await Promise.all([
        axios.get(`${config.API_URL}/api/sales/getSales`),
        axios.get(`${config.API_URL}/api/gallery/getAvailStock`),
      ]);

      // Fetch dispatched data for all orders
      const dispatchedResponses = await axios.get(
        `${config.API_URL}/api/shipment/getDispatched`
      );
      console.log(dispatchedResponses);

      const dispatchedData = dispatchedResponses.data;

      setOrders(ordersResponse.data || []);
      setStockData(stockResponse.data || {});
      console.log(dispatchedResponses);
      setDispatchedData(dispatchedData);
      groupProducts(
        ordersResponse.data || [],
        stockResponse.data || {},
        dispatchedData
      );
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load orders or stock data.");
    } finally {
      setLoading(false);
    }
  };

 const groupProducts = (orders, stockData, dispatchedData) => {
   const productMap = {};

   if (!Array.isArray(orders)) {
     console.error("Orders is not an array:", orders);
     return;
   }

   orders.forEach((order) => {
     if (!order || !Array.isArray(order.products)) {
       console.error("Invalid order or missing products:", order);
       return;
     }

     order.products.forEach((product) => {
       if (!product || !product.styleName) {
         console.error("Invalid product or missing styleName:", product);
         return;
       }

       const productId = product._id;
       const sizes = product.sizes || product.sizes2 || {};

       if (!productMap[product.styleName]) {
         productMap[product.styleName] = {
           image: product.image ? `${config.API_URL}${product.image}` : "",
           orders: [],
           totalOrderedQuantity: 0,
           totalDispatchedQuantity: 0,
           availableStock: getAvailableStock(productId, stockData),
           availableStock2: getAvailableStock(productId, stockData),
         };
       }

       const orderData = {
         order_no: order.order_no || "Unknown",
         order_date: order.order_date || "Unknown",
         buyer: order.buyer || "Unknown",
         sizes: {},
         productsId:product._id,
         orderDate:order.entry_date
       };

       // Fetch dispatched data for this order and product
       const dispatchedForOrder = dispatchedData.filter((shipment) =>
         shipment.products.some((p) => p.productId === productId)
       );

       Object.entries(sizes).forEach(([size, orderedQty]) => {
         let dispatchedQty = 0;

         // Calculate total dispatched quantity for this product and size
         dispatchedForOrder.forEach((shipment) => {
           shipment.products.forEach((p) => {
             if (p.productId === productId && p.size === size) {
               dispatchedQty += Number(p.dispatched_quantity || 0);
             }
           });
         });

         // Store size details
         orderData.sizes[size] = {
           orderedQty,
           dispatchedQty,
           remainingQty: Math.max(0, orderedQty - dispatchedQty),
         };

         productMap[product.styleName].totalOrderedQuantity += orderedQty;
         productMap[product.styleName].totalDispatchedQuantity += dispatchedQty;
       });

       productMap[product.styleName].orders.push(orderData);
     });
   });

   console.log("Grouped Products:", productMap);
   setGroupedProducts(productMap);
 };

const getAvailableStock = (productId, stockData) => {
  if (!Array.isArray(stockData)) return {};

  const stockEntry = stockData.find((stock) => stock.productId === productId);
  return stockEntry ? stockEntry.sizes : {}; // Return sizes if found, else empty object
};


const getAvailableQuantity = (productId, size) => {

  if (!Array.isArray(stockData)) return 0;

  const stockEntry = stockData.find((stock) => stock.productId === productId);
  return stockEntry?.sizes?.[size] || 0;
};


  const calculateRemainingToDispatch = (order, size, qty) => {
    if (!order.dispatched || !Array.isArray(order.dispatched)) {
      return qty;
    }

    // Sum up all dispatched quantities for this size
    const dispatched = order.dispatched.reduce((total, dispatch) => {
      return total + Number(dispatch.quantities?.[size] || 0);
    }, 0);

    return Math.max(0, Number(qty) - dispatched);
  };

 const handleDispatchChange = (
   orderNo,
   size,
   newValue,
   productId,
   productName
 ) => {
   let newDispatchQty = parseInt(newValue, 10) || 0;

   // Get current available stock for the product and size
   const availableStock = productName.availableStock2?.[size] || 0;

   console.log(availableStock, newDispatchQty, "avail");

   // ✅ If dispatch quantity exceeds stock, alert and reset input
   if (newDispatchQty > availableStock) {
     alert("Dispatch quantity should not exceed available stock!");

     // Reset input field
     setDispatchData((prev) => ({
       ...prev,
       [orderNo]: {
         ...prev[orderNo],
         [size]: "", // Reset to empty
       },
     }));

     // ✅ **Restore available stock to previous state**
     setGroupedProducts((prevGrouped) => {
       const updatedGrouped = { ...prevGrouped };

       Object.keys(updatedGrouped).forEach((productName) => {
         const product = updatedGrouped[productName];

         if (product.orders.some((order) => order.productsId === productId)) {
           product.availableStock = {
             ...product.availableStock,
             [size]: product.availableStock2[size], // Restore previous value
           };
         }
       });

       return updatedGrouped;
     });

     return; // **Stop execution to prevent further updates**
   }

   setDispatchDataByProduct((prev) => {
     const existingEntry = prev.find(
       (item) =>
         item.productId === productId &&
         item.size === size &&
         item.orderNo === orderNo
     );

     const previousQty = existingEntry ? existingEntry.quantity : 0;
     const qtyDifference = newDispatchQty - previousQty;

     // ✅ Update available stock dynamically
     setGroupedProducts((prevGrouped) => {
       const updatedGrouped = { ...prevGrouped };

       Object.keys(updatedGrouped).forEach((productName) => {
         const product = updatedGrouped[productName];

         if (product.orders.some((order) => order.productsId === productId)) {
           if ((product.availableStock[size] || 0) - qtyDifference < 0) {
             return; // Prevent further updates
           }
           product.availableStock = {
             ...product.availableStock,
             [size]: (product.availableStock[size] || 0) - qtyDifference,
           };
         }
       });

       return updatedGrouped;
     });

     return existingEntry
       ? prev.map((item) =>
           item.productId === productId &&
           item.size === size &&
           item.orderNo === orderNo
             ? { ...item, quantity: newDispatchQty }
             : item
         )
       : [...prev, { orderNo, productId, size, quantity: newDispatchQty }];
   });

   // ✅ Update input field only when valid
   setDispatchData((prev) => ({
     ...prev,
     [orderNo]: {
       ...prev[orderNo],
       [size]: newDispatchQty,
     },
   }));
 };



  useEffect(()=>{
    console.log(stockData)
  },[stockData])

  const handleDispatch = async () => {
    console.log(dispatchDataByProduct);
    try {
      // Group dispatch data by order number
      const shipmentData = dispatchDataByProduct.reduce(
        (acc, { orderNo, productId, size, quantity }) => {
          // Find existing order in accumulator
          let existingOrder = acc.find((item) => item.order_no === orderNo);

          if (!existingOrder) {
            // If order entry doesn't exist, create it
            existingOrder = {
              order_no: orderNo,
              shipment_date: new Date().toISOString(),
              products: [],
              dispatch_type: "OUT",
              createdAt: new Date().toISOString(),
            };
            acc.push(existingOrder);
          }

          // Add product details to the order
          existingOrder.products.push({
            productId,
            size,
            dispatched_quantity: parseInt(quantity, 10),
          });

          return acc;
        },
        []
      );

      // Prepare dispatch data with additional metadata
      const dispatchPayload = {
        dispatchData,
        dispatchDate: new Date().toISOString(),
        dispatchType: "OUT",
      };

      const groupedData = dispatchDataByProduct.reduce(
        (acc, { productId, size, quantity }) => {
          // Ensure product entry exists
          if (!acc[productId]) {
            acc[productId] = {
              productId,
              sizes: [],
            };
          }

          // Find if the size already exists for the product
          const existingSize = acc[productId].sizes.find(
            (s) => s.size === size
          );

          if (existingSize) {
            // Sum quantity if size already exists
            existingSize.quantity += parseInt(quantity, 10);
          } else {
            // Otherwise, add new size entry
            acc[productId].sizes.push({
              size,
              quantity: parseInt(quantity, 10),
            });
          }

          return acc;
        },
        {}
      );

      // Convert object to array format
      const finalResult = Object.values(groupedData);

      console.log(finalResult);

      console.log("Dispatching Orders:", shipmentData);

      // API call to update dispatch status
      let res = await axios.post(`${config.API_URL}/api/shipment/outStock`, {
        products: finalResult,
      });

      console.log(res);

        await axios.post(
          `${config.API_URL}/api/shipment/createShipment`,
          shipmentData
        );

      alert("Orders dispatched successfully!");
       fetchData();
      setDispatchData({});
    } catch (error) {
      console.error("Error dispatching orders:", error);
      alert("Failed to dispatch orders. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">Loading shipment data...</div>
    );
  }

  if (error) {
    return <div className="max-w-6xl mx-auto p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Shipment Details</h2>

      {Object.keys(groupedProducts).length === 0 ? (
        <div>
          <p className="my-4 text-red-500">No shipment data available.</p>
        </div>
      ) : (
        <>
          <table className="w-full mt-2 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Order No</th>
                <th className="border px-4 py-2">Order Date</th>
                <th className="border px-4 py-2">Buyer</th>
                <th className="border px-4 py-2">Size</th>
                <th className="border px-4 py-2">Order Qty</th>
                <th className="border px-4 py-2">Already Dispatched</th>
                <th className="border px-4 py-2">Remaining</th>
                 <th className="border px-4 py-2">Available Stock</th> 
                <th className="border px-4 py-2">Dispatch Quantity</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedProducts).map(([productName, data]) =>
                data.orders && data.orders.length > 0 ? (
                  data.orders.flatMap((order, orderIndex) => {
                    // Try to get sizes from the order
                    const sizes = order.sizes || {};

                    // Check if sizes is empty or not an object
                    if (
                      !sizes ||
                      typeof sizes !== "object" ||
                      Object.keys(sizes).length === 0
                    ) {
                      // Render at least one row even if no sizes
                      return (
                        <tr
                          key={`${productName}-${order.order_no}-placeholder`}
                          className="border-2 border-black"
                        >
                          {orderIndex === 0 && (
                            <td
                              className="border px-4 py-2"
                              rowSpan={data.orders.length}
                            >
                              {productName}
                            </td>
                          )}
                          {orderIndex === 0 && (
                            <td
                              className="border px-4 py-2"
                              rowSpan={data.orders.length}
                            >
                              {data.image ? (
                                <img
                                  src={data.image}
                                  alt={productName}
                                  className="w-16 h-16 object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                                  No image
                                </div>
                              )}
                            </td>
                          )}
                          <td className="border px-4 py-2">{order.order_no}</td>
                          <td className="border px-4 py-2">{order.orderDate}</td>
                          <td className="border px-4 py-2">{order.buyer}</td>
                          <td className="border px-4 py-2">N/A</td>
                          <td className="border px-4 py-2">0</td>
                          <td className="border px-4 py-2">0</td>
                          <td className="border px-4 py-2">0</td>
                          <td className="border px-4 py-2">0</td>
                          <td className="border px-4 py-2">-</td>
                        </tr>
                      );
                    }

                    // Regular case - process the sizes
                    return Object.entries(sizes).map(
                      ([size, qty], sizeIndex) => {
                        const remainingToDispatch = qty.remainingQty;

                        const availableStock = data.availableStock[size]

                        const alreadyDispatched = qty.dispatchedQty;

                        return (
                          <tr
                            key={`${productName}-${order.order_no}-${size}-${sizeIndex}`}
                            className={
                              remainingToDispatch === 0 ? "bg-green-50" : ""
                            }
                          >
                            {orderIndex === 0 && sizeIndex === 0 && (
                              <td
                                className="border px-4 py-2"
                                rowSpan={data.orders.reduce((sum, o) => {
                                  const orderSizes = o.sizes || {};
                                  return (
                                    sum + (Object.keys(orderSizes).length || 1)
                                  );
                                }, 0)}
                              >
                                {productName}
                              </td>
                            )}
                            {orderIndex === 0 && sizeIndex === 0 && (
                              <td
                                className="border px-4 py-2"
                                rowSpan={data.orders.reduce((sum, o) => {
                                  const orderSizes = o.sizes || {};
                                  return (
                                    sum + (Object.keys(orderSizes).length || 1)
                                  );
                                }, 0)}
                              >
                                {data.image ? (
                                  <img
                                    src={data.image}
                                    alt={productName}
                                    className="w-16 h-16 object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                                    No image
                                  </div>
                                )}
                              </td>
                            )}
                            <td className="border px-4 py-2">
                              {order.order_no}
                            </td>
                            <td className="border px-4 py-2">
                              {new Date(order.orderDate).toLocaleDateString(
                                "en-GB"
                              )}
                            </td>
                            <td className="border px-4 py-2">{order.buyer}</td>
                            <td className="border px-4 py-2">{size}</td>
                            <td className="border px-4 py-2">
                              {qty.orderedQty}
                            </td>
                            <td className="border px-4 py-2">
                              {alreadyDispatched}
                              {alreadyDispatched > 0 && (
                                <span className="ml-1 text-xs text-green-600">
                                  ✓
                                </span>
                              )}
                            </td>
                            <td className="border px-4 py-2">
                              {remainingToDispatch}
                              {remainingToDispatch === 0 && (
                                <span className="ml-1 text-xs text-green-600">
                                  ✓
                                </span>
                              )}
                            </td>
                            <td className="border px-4 py-2">
                              {availableStock}
                              {availableStock < remainingToDispatch && (
                                <span className="ml-1 text-xs text-red-600">
                                  ⚠️
                                </span>
                              )}
                            </td>
                            <td className="border px-4 py-2">
                              {remainingToDispatch > 0 ? (
                                <input
                                  type="number"
                                  min="0"
                                  max={Math.min(
                                    remainingToDispatch,
                                    availableStock
                                  )}
                                  className={`w-16 border px-2 py-1 rounded ${
                                    availableStock < remainingToDispatch
                                      ? "border-red-300 bg-red-50"
                                      : "border-red-300 bg-red-50"
                                  }`}
                                  value={
                                    dispatchData[order.order_no]?.[size] || ""
                                  }
                                  onChange={(e) =>
                                    handleDispatchChange(
                                      order.order_no,
                                      size,
                                      e.target.value,
                                      order.productsId,
                                      data,
                                      productName
                                    )
                                  }
                                  disabled={remainingToDispatch === 0}
                                />
                              ) : (
                                <span className="text-green-600">
                                  Completed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    );
                  })
                ) : (
                  <tr key={`${productName}-empty`}>
                    <td className="border px-4 py-2">{productName}</td>
                    <td className="border px-4 py-2">
                      {data.image ? (
                        <img
                          src={data.image}
                          alt={productName}
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2" colSpan="8">
                      No orders available for this product
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 border rounded bg-gray-50">
              <h4 className="font-semibold mb-2">Inventory Summary</h4>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Product</th>
                    <th className="text-right">Ordered</th>
                    <th className="text-right">Dispatched</th>
                    <th className="text-right">Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedProducts).map(
                    ([productName, data]) => (
                      <tr key={`summary-${productName}`}>
                        <td className="py-1">{productName}</td>
                        <td className="py-1 text-right">
                          {data.totalOrderedQuantity}
                        </td>
                        <td className="py-1 text-right">
                          {data.totalDispatchedQuantity}
                        </td>
                        <td className="py-1 text-right">
                          {data.totalOrderedQuantity -
                            data.totalDispatchedQuantity}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <button
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        onClick={handleDispatch}
        disabled={Object.keys(dispatchData).length === 0}
      >
        Dispatch Orders
      </button>
    </div>
  );
};

export default Shipment;
