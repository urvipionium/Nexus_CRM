import { motion } from "framer-motion";

export default function DashboardCards() {

  const cards = [
    {
      title: "Revenue",
      value: "₹4,20,000",
      color: "from-green-400 to-green-600"
    },
    {
      title: "Deals",
      value: "58",
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Leads",
      value: "120",
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "Conversion",
      value: "34%",
      color: "from-pink-400 to-pink-600"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">

      {cards.map((card, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          className={`bg-gradient-to-r ${card.color} text-white p-5 rounded-2xl shadow-lg`}
        >
          <p className="text-sm opacity-80">
            {card.title}
          </p>

          <h2 className="text-2xl font-bold">
            {card.value}
          </h2>
        </motion.div>
      ))}

    </div>
  );
}