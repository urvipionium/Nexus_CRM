const ProbabilityBadge = ({ probability }) => {
  let color = "bg-red-500";

  if (probability > 70) color = "bg-green-500";
  else if (probability > 40) color = "bg-yellow-500";

  return (
    <div className={`mt-2 text-white text-xs px-2 py-1 rounded ${color}`}>
      {probability}% Success
    </div>
  );
};

export default ProbabilityBadge;