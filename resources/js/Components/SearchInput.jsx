    // components/SearchInput.jsx
    import { Search } from "lucide-react";

    export default function SearchInput({ value, onChange, placeholder }) {
    return (
        <div className="mb-5 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        </div>
    );
    }
