import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";

const Dispatch = () => {
  const [orders, setOrders] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [dispatchData, setDispatchData] = useState({});
  const [dispatchDataByProduct, setDispatchDataByProduct] = useState([]);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dispatchedData, setDispatchedData] = useState([]);

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

        if (!productMap[productId]) {
          productMap[productId] = {
            styleName: product.styleName,
            color: product.selectedColor.name || "N/A",
            image: product.image ? `${config.API_URL}${product.image}` : "",
            price: product.price || 0,

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
          productsId: product._id,
          orderDate: order.entry_date,
        };

        const dispatchedForOrder = dispatchedData.filter((shipment) =>
          shipment.products.some((p) => p.productId === productId)
        );

        Object.entries(sizes).forEach(([size, orderedQty]) => {
          let dispatchedQty = 0;

          dispatchedForOrder.forEach((shipment) => {
            shipment.products.forEach((p) => {
              if (p.productId === productId && p.size === size) {
                dispatchedQty += Number(p.dispatched_quantity || 0);
              }
            });
          });

          orderData.sizes[size] = {
            orderedQty,
            dispatchedQty,
            remainingQty: Math.max(0, orderedQty - dispatchedQty),
          };

          productMap[productId].totalOrderedQuantity += orderedQty;
          productMap[productId].totalDispatchedQuantity += dispatchedQty;
        });

        productMap[productId].orders.push(orderData);
      });
    });

    console.log("Grouped Products:", productMap);
    setGroupedProducts(productMap);
  };

  const getAvailableStock = (productId, stockData) => {
    if (!Array.isArray(stockData)) return {};

    const stockEntry = stockData.find((stock) => stock.productId === productId);
    return stockEntry ? stockEntry.sizes : {};
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

    const availableStock = productName.availableStock2?.[size] || 0;

    const orderForProduct = productName.orders.find(
      (order) => order.order_no === orderNo
    );
    const remainingQty = orderForProduct?.sizes?.[size]?.remainingQty || 0;

    console.log(availableStock, newDispatchQty, "avail");

    if (newDispatchQty > availableStock || newDispatchQty > remainingQty) {
      const errorMessage =
        newDispatchQty > availableStock
          ? "Dispatch quantity should not exceed available stock!"
          : "Dispatch quantity should not exceed remaining quantity!";

      alert(errorMessage);

      // Reset the dispatch input
      setDispatchData((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          [orderNo]: {
            ...prev[productId]?.[orderNo],
            [size]: "",
          },
        },
      }));

      // Reset the dispatch entry in dispatchDataByProduct
      setDispatchDataByProduct((prev) =>
        prev.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.size === size &&
              item.orderNo === orderNo
            )
        )
      );

      // Restore the available stock
      setGroupedProducts((prevGrouped) => {
        const updatedGrouped = { ...prevGrouped };

        Object.keys(updatedGrouped).forEach((productName) => {
          const product = updatedGrouped[productName];

          if (product.orders.some((order) => order.productsId === productId)) {
            product.availableStock = {
              ...product.availableStock,
              [size]: product.availableStock2[size],
            };
          }
        });

        return updatedGrouped;
      });

      return;
    }

    console.log("reached here");

    setDispatchDataByProduct((prev) => {
      const existingEntry = prev.find(
        (item) =>
          item.productId === productId &&
          item.size === size &&
          item.orderNo === orderNo
      );

      const previousQty = existingEntry ? existingEntry.quantity : 0;
      const qtyDifference = newDispatchQty - previousQty;

      // Get the price and style name for this product
      const price = productName.price || 0;
      const styleName = productName.styleName || "";
      const amount = price * newDispatchQty;

      console.log(qtyDifference, newDispatchQty, previousQty);

      setGroupedProducts((prevGrouped) => {
        const updatedGrouped = { ...prevGrouped };

        Object.keys(updatedGrouped).forEach((productName) => {
          const product = updatedGrouped[productName];

          if (product.orders.some((order) => order.productsId === productId)) {
            if ((product.availableStock[size] || 0) - qtyDifference < 0) {
              return;
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
              ? {
                  ...item,
                  quantity: newDispatchQty,
                  styleName: styleName,
                  price: price,
                  amount: amount,
                }
              : item
          )
        : [
            ...prev,
            {
              orderNo,
              productId,
              size,
              quantity: newDispatchQty,
              styleName: styleName,
              price: price,
              amount: amount,
            },
          ];
    });

    setDispatchData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [orderNo]: {
          ...prev[productId]?.[orderNo],
          [size]: newDispatchQty,
        },
      },
    }));
  };

  useEffect(() => {
    console.log(dispatchData, dispatchDataByProduct, "dispatch data");
  }, [dispatchData, dispatchDataByProduct]);

  const handleDispatch = async () => {
    console.log(dispatchDataByProduct);
    try {
      const shipmentData = dispatchDataByProduct.reduce(
        (
          acc,
          { orderNo, productId, size, quantity, styleName, price, amount }
        ) => {
          let existingOrder = acc.find((item) => item.order_no === orderNo);

          if (!existingOrder) {
            existingOrder = {
              order_no: orderNo,
              shipment_date: new Date().toISOString(),
              products: [],
              dispatch_type: "OUT",
              createdAt: new Date().toISOString(),
            };
            acc.push(existingOrder);
          }

          existingOrder.products.push({
            productId,
            size,
            dispatched_quantity: parseInt(quantity, 10),
            description: styleName,
            unitPrice: price,
            amount,
            quantity: parseInt(quantity, 10),
          });

          return acc;
        },
        []
      );

      const dispatchPayload = {
        dispatchData,
        dispatchDate: new Date().toISOString(),
        dispatchType: "OUT",
      };

      const groupedData = dispatchDataByProduct.reduce(
        (acc, { productId, size, quantity }) => {
          if (!acc[productId]) {
            acc[productId] = {
              productId,
              sizes: [],
            };
          }

          const existingSize = acc[productId].sizes.find(
            (s) => s.size === size
          );

          if (existingSize) {
            existingSize.quantity += parseInt(quantity, 10);
          } else {
            acc[productId].sizes.push({
              size,
              quantity: parseInt(quantity, 10),
            });
          }

          return acc;
        },
        {}
      );

      const finalResult = Object.values(groupedData);

      console.log(finalResult);

      console.log("Dispatching Orders:", shipmentData);

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
    <div className="min-w-6xl mx-auto p-6 overflow-x-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Shipment Details</h2>

      {Object.keys(groupedProducts).length === 0 ? (
        <div>
          <p className="my-4 text-red-500">No shipment data available.</p>
        </div>
      ) : (
        <>
          <table className="w-full  mt-2 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {/* <th className="border px-4 py-2">Product ID</th> */}
                <th className="border px-4 py-2">Style Name</th>
                <th className="border px-4 py-2">Color</th>
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
              {Object.entries(groupedProducts).map(([productId, data]) =>
                data.orders && data.orders.length > 0 ? (
                  data.orders.flatMap((order, orderIndex) => {
                    const sizes = order.sizes || {};

                    if (
                      !sizes ||
                      typeof sizes !== "object" ||
                      Object.keys(sizes).length === 0
                    ) {
                      return (
                        <tr
                          key={`${productId}-${order.order_no}-placeholder`}
                          className="border-2 border-black"
                        >
                          {orderIndex === 0 && (
                            <>
                              {/* <td
                                className="border px-4 py-2"
                                rowSpan={data.orders.length}
                              >
                                {productId}
                              </td> */}
                              <td
                                className="border px-4 py-2"
                                rowSpan={data.orders.length}
                              >
                                {data.styleName}
                              </td>
                              <td
                                className="border px-4 py-2"
                                rowSpan={data.orders.length}
                              >
                                {data.color}
                              </td>
                              <td
                                className="border px-4 py-2"
                                rowSpan={data.orders.length}
                              >
                                {data.image ? (
                                  <img
                                    src={data.image}
                                    alt={data.styleName}
                                    className="w-16 h-16 object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                                    No image
                                  </div>
                                )}
                              </td>
                            </>
                          )}
                          <td className="border px-4 py-2">{order.order_no}</td>
                          <td className="border px-4 py-2">
                            {order.orderDate}
                          </td>
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

                    return Object.entries(sizes).map(
                      ([size, qty], sizeIndex) => {
                        const remainingToDispatch = qty.remainingQty;
                        const availableStock = data.availableStock[size];
                        const alreadyDispatched = qty.dispatchedQty;

                        return (
                          <tr
                            key={`${productId}-${order.order_no}-${size}-${sizeIndex}`}
                            className={
                              remainingToDispatch === 0 ? "bg-green-50" : ""
                            }
                          >
                            {orderIndex === 0 && sizeIndex === 0 && (
                              <>
                                {/* <td
                                  className="border px-4 py-2"
                                  rowSpan={data.orders.reduce((sum, o) => {
                                    const orderSizes = o.sizes || {};
                                    return (
                                      sum +
                                      (Object.keys(orderSizes).length || 1)
                                    );
                                  }, 0)}
                                >
                                  {productId}
                                </td> */}
                                <td
                                  className="border px-4 py-2"
                                  rowSpan={data.orders.reduce((sum, o) => {
                                    const orderSizes = o.sizes || {};
                                    return (
                                      sum +
                                      (Object.keys(orderSizes).length || 1)
                                    );
                                  }, 0)}
                                >
                                  {data.styleName}
                                </td>
                                <td
                                  className="border px-4 py-2"
                                  rowSpan={data.orders.reduce((sum, o) => {
                                    const orderSizes = o.sizes || {};
                                    return (
                                      sum +
                                      (Object.keys(orderSizes).length || 1)
                                    );
                                  }, 0)}
                                >
                                  {data.color}
                                </td>
                                <td
                                  className="border px-4 py-2"
                                  rowSpan={data.orders.reduce((sum, o) => {
                                    const orderSizes = o.sizes || {};
                                    return (
                                      sum +
                                      (Object.keys(orderSizes).length || 1)
                                    );
                                  }, 0)}
                                >
                                  {data.image ? (
                                    <img
                                      src={data.image}
                                      alt={data.styleName}
                                      className="w-16 h-16 object-cover"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                                      No image
                                    </div>
                                  )}
                                </td>
                              </>
                            )}
                            <td className="border whitespace-nowrap px-4 py-2">
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
                                    dispatchData[order.productsId]?.[
                                      order.order_no
                                    ]?.[size] || ""
                                  }
                                  onChange={(e) =>
                                    handleDispatchChange(
                                      order.order_no,
                                      size,
                                      e.target.value,
                                      order.productsId,
                                      data
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
                  <tr key={`${productId}-empty`}>
                    <td className="border px-4 py-2">{productId}</td>
                    <td className="border px-4 py-2">{data.styleName}</td>
                    <td className="border px-4 py-2">{data.color}</td>
                    <td className="border px-4 py-2">
                      {data.image ? (
                        <img
                          src={data.image}
                          alt={data.styleName}
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
                    {/* <th className="text-left">Product ID</th> */}
                    <th className="text-left">Style Name</th>
                    <th className="text-left">Color</th>
                    <th className="text-right">Ordered</th>
                    <th className="text-right">Dispatched</th>
                    <th className="text-right">Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedProducts).map(([productId, data]) => (
                    <tr key={`summary-${productId}`}>
                      {/* <td className="py-1">{productId}</td> */}
                      <td className="py-1">{data.styleName}</td>
                      <td className="py-1">{data.color}</td>
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
                  ))}
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

export default Dispatch;
