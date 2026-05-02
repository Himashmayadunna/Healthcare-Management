import Footer from "../components/Footer";
import Sidebar from "../components/sidebar";

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
}

export default async function HomePage() {
	const data = await getDashboardData();

	return (
		<div className="flex min-h-screen flex-col">
			<main className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_left,#dff8ef_0%,#f5fbf9_40%,#eff4fb_100%)]">
				<div className="pointer-events-none absolute -top-28 -right-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-24 -left-17.5 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

				<div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[250px_1fr] lg:px-8">
					<Sidebar />

					<section className="space-y-6">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight text-slate-900">Hospital Dashboard</h1>
							<p className="mt-1 text-sm text-slate-600">
								Unified home view for healthcare operations and inventory management.
							</p>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
							<article className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Patients</p>
								<p className="mt-2 text-3xl font-semibold text-slate-900">{data.patientCount}</p>
								<p className="mt-2 text-sm text-slate-500">Live count from backend</p>
							</article>

							<article className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm" id="appointments">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Appointments</p>
								<p className="mt-2 text-3xl font-semibold text-slate-900">{data.appointmentCount}</p>
								<p className="mt-2 text-sm text-slate-500">Add GET route to display live total</p>
							</article>

							<article className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Prescriptions</p>
								<p className="mt-2 text-3xl font-semibold text-slate-900">{data.prescriptionCount}</p>
								<p className="mt-2 text-sm text-slate-500">Pending backend summary endpoint</p>
							</article>

							<article className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm" id="inventory">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Inventory Alerts</p>
								<p className="mt-2 text-3xl font-semibold text-slate-900">7</p>
								<p className="mt-2 text-sm text-slate-500">Critical items below threshold</p>
							</article>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2" id="patients">
							<article className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
								<div className="flex items-center justify-between">
									<h2 className="text-lg font-semibold text-slate-900">Recent Patients</h2>
									<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
										Today
									</span>
								</div>

								<div className="mt-4 overflow-x-auto">
									<table className="w-full min-w-110 text-left text-sm">
										<thead>
											<tr className="border-b border-slate-200 text-slate-500">
												<th className="pb-2 font-medium">Name</th>
												<th className="pb-2 font-medium">Age</th>
												<th className="pb-2 font-medium">Contact</th>
											</tr>
										</thead>
										<tbody>
											{data.patients.length > 0 ? (
												data.patients.slice(0, 5).map((patient) => (
													<tr key={`${patient.id}-${patient.name}`} className="border-b border-slate-100 text-slate-700">
														<td className="py-3">{patient.name}</td>
														<td className="py-3">{patient.age}</td>
														<td className="py-3">{patient.contact}</td>
													</tr>
												))
											) : (
												<tr>
													<td className="py-4 text-slate-500" colSpan={3}>
														No patient records found yet.
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</article>

							<article className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
								<h2 className="text-lg font-semibold text-slate-900">Inventory Snapshot</h2>
								<ul className="mt-4 space-y-3 text-sm text-slate-700">
									<li className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
										<span>Gloves</span>
										<span className="font-semibold text-amber-600">Low</span>
									</li>
									<li className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
										<span>Syringes</span>
										<span className="font-semibold text-emerald-700">Good</span>
									</li>
									<li className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
										<span>Antibiotics</span>
										<span className="font-semibold text-rose-600">Critical</span>
									</li>
									<li className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
										<span>IV Fluids</span>
										<span className="font-semibold text-emerald-700">Good</span>
									</li>
								</ul>
							</article>
						</div>

						<div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">System Health</p>
							<p className="mt-2 text-sm text-emerald-900">{data.health}</p>
						</div>
					</section>
				</div>
			</main>

			<Footer />
		</div>
	);
}
