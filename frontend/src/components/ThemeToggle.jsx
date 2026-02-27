import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

function ThemeToggle() {
    const [dark, setDark] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className="
        p-2 rounded-lg
        bg-gray-200 hover:bg-gray-300
        dark:bg-indigo-600 dark:hover:bg-indigo-500
        transition-all duration-300
      "
        >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}

export default ThemeToggle;