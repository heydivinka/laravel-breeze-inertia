    // CardList.jsx
    import { motion } from 'framer-motion';

    export default function CardList({ cards }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
            <div key={card.title} className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-2xl font-bold">{card.value}</p>
            </div>
        ))}
        </motion.div>
    );
    }
