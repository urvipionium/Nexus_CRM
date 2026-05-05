const DealCard = ({ deal, onClick }: any) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-50 p-3 rounded shadow mb-3 cursor-pointer hover:shadow-md"
    >
      <h3 className="font-semibold">{deal.title}</h3>
      <p className="text-sm text-gray-500">{deal.company}</p>
      <p className="font-medium">{deal.value}</p>

      <div className="mt-2 bg-gray-200 h-2 rounded">
        <div
          className="bg-green-500 h-2 rounded"
          style={{ width: `${deal.probability}%` }}
        />
      </div>
    </div>
  );
};


export default DealCard;