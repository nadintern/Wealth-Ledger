// Single registration site for chart.js components.
// Importing this file once at app start (via any chart component that needs it)
// has the side effect of wiring chart.js's tree-shakable pieces. Without this,
// react-chartjs-2 throws "controller … is not registered" at runtime.
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
