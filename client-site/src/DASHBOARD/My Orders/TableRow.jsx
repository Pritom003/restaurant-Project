/* eslint-disable react/prop-types */

const TableRow = ({ order }) => {
  return (
    <tr className="font-rancho">
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="block relative">
              <p className="text-gray-900 whitespace-no-wrap">
                {order?.userEmail}
              </p>
            </div>
          </div>
        </div>
      </td>
      {order?.items.map((food, idx) => (
        <td
          key={idx}
          className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
        >
          <p className="text-gray-900 whitespace-no-wrap">{food?.name}</p>
        </td>
      ))}

      {order?.items.map((food, idx) => (
        <td
          key={idx}
          className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
        >
          <p className="text-gray-900 whitespace-no-wrap">{food?.price}</p>
        </td>
      ))}
      {order?.items.map((food, idx) => (
        <td
          key={idx}
          className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
        >
          <p className="text-gray-900 whitespace-no-wrap">{food?.quantity}</p>
        </td>
      ))}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {order?.paymentMethod}
        </p>
      </td>
    </tr>
  );
};

export default TableRow;
