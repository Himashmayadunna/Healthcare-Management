import Footer from "../components/Footer";
import Sidebar from "../components/sidebar";
import {
  Search,
  Bell,
  Users,
  Calendar,
  Pill,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

type Patient = {
	id: number | string;
	name: string;
	age: number | string;
	contact: string;
};

type DashboardData = {
	health: string;
	patientCount: number;
	appointmentCount: number;
	prescriptionCount: number;
	patients: Patient[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

async function fetchJson<T>(path: string): Promise<T | null> {
	try {
		const response = await fetch(`${API_BASE_URL}${path}`, {
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		return (await response.json()) as T;
	} catch {
		return null;
	}
}

function normalizePatients(rows: unknown): Patient[] {
	if (!Array.isArray(rows)) {
		return [];
	}

	return rows
		.map((entry) => {
			if (Array.isArray(entry)) {
				return {
					id: entry[0] ?? "-",
					name: String(entry[1] ?? "Unknown"),
					age: entry[2] ?? "-",
					contact: String(entry[3] ?? "-"),
				} satisfies Patient;
			}

			if (entry && typeof entry === "object") {
				const row = entry as Record<string, unknown>;
				return {
					id: (row.id ?? row.ID ?? row.patient_id ?? row.PATIENT_ID ?? "-") as string | number,
					name: String(row.name ?? row.NAME ?? "Unknown"),
					age: (row.age ?? row.AGE ?? "-") as string | number,
					contact: String(row.contact ?? row.CONTACT ?? "-"),
				} satisfies Patient;
			}

			return null;
		})
		.filter((item): item is Patient => item !== null);
}

async function getDashboardData(): Promise<DashboardData> {
	try {
		const [patientsResponse, healthResponse] = await Promise.all([
			fetchJson<unknown[]>("/patients"),
			fetchJson<{ status?: string; error?: string }>("/health"),
		]);

		const patients = normalizePatients(patientsResponse);

		return {
			health: healthResponse?.status ?? healthResponse?.error ?? "Backend unavailable",
			patientCount: patients.length,
			appointmentCount: 0,
			prescriptionCount: 0,
			patients,
		};
	} catch (error) {
		console.error("Failed to fetch dashboard data:", error);
		return {
			health: "Backend unreachable",
			patientCount: 0,
			appointmentCount: 0,
			prescriptionCount: 0,
			patients: [],
		};
	}
}

export default async function HomePage() {
	const data = await getDashboardData();

	return (
		<div className="flex min-h-screen flex-col bg-gray-50">
			<Sidebar />
			
			{/* Top Header */}
			<header className="fixed left-64 right-0 top-0 z-10 border-b border-gray-200 bg-white">
				<div className="flex items-center justify-between px-8 py-4">
					<div className="flex-1">
						<div className="relative max-w-md">
							<input
								type="text"
								placeholder="Search patients, medicines, appointments..."
								className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
							/>
						<Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
						</div>
					</div>
					
					<div className="ml-8 flex items-center gap-6">
						<button className="relative text-gray-600 hover:text-teal-600">
							<Bell className="w-5 h-5" />
						</button>
						<div className="flex items-center gap-3">
							<span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">DR</span>
							<div className="text-sm">
								<p className="font-semibold text-gray-900">Dr. Rivera</p>
								<p className="text-xs text-gray-500">Administrator</p>
							</div>
							<button className="text-gray-400 hover:text-gray-600 ml-2">
								<ChevronDown className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</header>
			
			<main className="relative flex-1 overflow-y-auto pt-20 pl-64">
				<div className="space-y-6 px-6 py-8">
					{/* Welcome Section */}
					<div>
						<h1 className="text-4xl font-bold text-gray-900">Welcome back, Dr. Rivera</h1>
						<p className="mt-2 text-gray-600">Here's what's happening across your practice today.</p>
					</div>

					{/* KPI Cards Grid */}
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						{/* Total Patients */}
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Patients</p>
									<p className="mt-3 text-3xl font-bold text-gray-900">{data.patientCount.toLocaleString() || "2,847"}</p>
								<p className="mt-3 text-sm text-teal-600 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> 8.2% <span className="text-gray-500 ml-1">vs last week</span></p>
							</div>
							<Users className="w-8 h-8 text-teal-500" />
							</div>
						</div>

						{/* Appointments Today */}
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Appointments Today</p>
									<p className="mt-3 text-3xl font-bold text-gray-900">24</p>
								<p className="mt-3 text-sm text-teal-600 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> 12.5% <span className="text-gray-500 ml-1">vs last week</span></p>
							</div>
							<Calendar className="w-8 h-8 text-teal-500" />
							</div>
						</div>

						{/* Available Medicines */}
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Available Medicines</p>
									<p className="mt-3 text-3xl font-bold text-gray-900">1,326</p>
								<p className="mt-3 text-sm text-red-600 flex items-center gap-1"><TrendingDown className="w-4 h-4" /> 2.1% <span className="text-gray-500 ml-1">vs last month</span></p>
							</div>
							<Pill className="w-8 h-8 text-teal-500" />
							</div>
						</div>

						{/* Low Stock Alerts */}
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Low Stock Alerts</p>
									<p className="mt-3 text-3xl font-bold text-red-600">7</p>
								<p className="mt-3 text-sm text-teal-600 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> 3% <span className="text-gray-500 ml-1">new this week</span></p>
							</div>
							<AlertCircle className="w-8 h-8 text-red-500" />
							</div>
						</div>
					</div>

					{/* Alert Box */}
					<div className="rounded-lg border border-red-200 bg-red-50 p-6 flex items-start gap-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shrink-0">
							<AlertTriangle className="w-5 h-5" />
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-red-700">7 medicines need restocking</h3>
							<p className="mt-1 text-sm text-red-600">Insulin Glargine, Salbutamol Inhaler, Atorvastatin and 4 more are below their minimum threshold.</p>
						</div>
						<button className="whitespace-nowrap text-sm font-semibold text-red-600 hover:text-red-700 shrink-0">View Inventory →</button>
					</div>

					{/* Patient Visits Chart Section */}
					<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-lg font-semibold text-gray-900">Patient Visits</h2>
								<p className="text-sm text-gray-500">Last 7 days overview</p>
							</div>
							<div className="text-xs text-gray-500 space-x-4">
								<span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-teal-500"></span> Visits</span>
								<span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-cyan-500"></span> New</span>
							</div>
						</div>
						<div className="mt-6 h-64 rounded-lg bg-linear-to-b from-gray-50 to-white p-4">
							<p className="text-center text-sm text-gray-400 mt-20">Chart placeholder - Ready for chart library integration</p>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
