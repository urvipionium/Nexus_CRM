const ActionButtons = ({ deal }) => {

  const handleCall = () => {
    window.open(`tel:${deal.phone}`);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${deal.phone}`);
  };

  const handleClose = () => {
    alert("Deal Closed!");
  };

  return (
    <div className="flex gap-2 mt-3">
      <button onClick={handleCall} className="text-blue-500">📞</button>
      <button onClick={handleWhatsApp} className="text-green-500">💬</button>
      <button onClick={handleClose} className="text-red-500">✔</button>
    </div>
  );
};

export default ActionButtons;