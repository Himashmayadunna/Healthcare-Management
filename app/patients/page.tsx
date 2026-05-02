"use client";

import { useEffect, useMemo, useState } from "react";
import {
	AlertCircle,
	Calendar,
	ChevronDown,
	Filter,
	MoreHorizontal,
	Plus,
	Search,
	ShieldCheck,
	Stethoscope,
	Trash2,
	UserPlus,
	Users,
} from "lucide-react";
import Sidebar from "../components/sidebar";
import Footer from "../components/Footer";
import { patientAPI } from "../services/api";

type Patient = {
	id: number | string;
	name: string;
	age: number | string;
	contact: string;
	status?: string;
	condition?: string;
	lastVisit?: string;
	gender?: string;
};

type PatientFormState = {
	name: string;
	age: string;
	contact: string;
};

function normalizePatients(rows: unknown): Patient[] {
	if (!Array.isArray(rows)) {
		return [];
	}

	const normalized = rows
		.map<Patient | null>((entry, index) => {
			if (Array.isArray(entry)) {
				return {
					id: entry[0] ?? index + 1,
					name: String(entry[1] ?? "Unknown"),
					age: entry[2] ?? "-",
					contact: String(entry[3] ?? "-"),
					condition: "General checkup",
					status: index % 3 === 0 ? "Pending" : "Active",
					lastVisit: "2026-05-02",
					gender: "Unknown",
				} satisfies Patient;
			}

			if (entry && typeof entry === "object") {
				const row = entry as Record<string, unknown>;
				return {
					id: (row.id ?? row.ID ?? row.patient_id ?? row.PATIENT_ID ?? index + 1) as string | number,
					name: String(row.name ?? row.NAME ?? "Unknown"),
					age: (row.age ?? row.AGE ?? "-") as string | number,
					contact: String(row.contact ?? row.CONTACT ?? "-"),
					condition: String(row.condition ?? row.CONDITION ?? "General checkup"),
					status: String(row.status ?? row.STATUS ?? "Active"),
					lastVisit: String(row.lastVisit ?? row.last_visit ?? row.LAST_VISIT ?? "2026-05-02"),
					gender: String(row.gender ?? row.GENDER ?? "Unknown"),
				} satisfies Patient;
			}

			return null;
		})
		.filter((item): item is Patient => item !== null);

	return normalized;
}

function getStatusStyles(status?: string) {
	const normalized = (status ?? "Active").toLowerCase();

	if (normalized.includes("pend")) {
		return "bg-amber-100 text-amber-700";
	}

	if (normalized.includes("inactive")) {
		return "bg-slate-100 text-slate-600";
	}

	return "bg-emerald-100 text-emerald-700";
}

export default function PatientsPage() {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("All status");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form, setForm] = useState<PatientFormState>({
		name: "",
		age: "",
		contact: "",
	});
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function loadPatients() {
			setLoading(true);
			setErrorMessage(null);

			try {
				const data = await patientAPI.getAll();
				if (isMounted) {
					setPatients(normalizePatients(data));
				}
			} catch (error) {
				if (isMounted) {
					setErrorMessage(error instanceof Error ? error.message : "Failed to load patients");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadPatients();

		return () => {
			isMounted = false;
		};
	}, []);

	const stats = useMemo(() => {
		const active = patients.filter((patient) => (patient.status ?? "Active").toLowerCase().includes("active")).length;
		const pending = patients.filter((patient) => (patient.status ?? "").toLowerCase().includes("pend")).length;

		return {
			total: patients.length,
			active,
			pending,
		};
	}, [patients]);

	const filteredPatients = useMemo(() => {
		return patients.filter((patient) => {
			const matchesSearch =
				patient.name.toLowerCase().includes(search.toLowerCase()) ||
				String(patient.id).toLowerCase().includes(search.toLowerCase()) ||
				String(patient.contact).toLowerCase().includes(search.toLowerCase());

			const matchesStatus =
				statusFilter === "All status" ||
				(statusFilter === "Active" && (patient.status ?? "").toLowerCase().includes("active")) ||
				(statusFilter === "Pending" && (patient.status ?? "").toLowerCase().includes("pend"));

			return matchesSearch && matchesStatus;
		});
	}, [patients, search, statusFilter]);

	async function handleAddPatient(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		setErrorMessage(null);
		setSuccessMessage(null);

		try {
			await patientAPI.add({
				name: form.name.trim(),
				age: Number(form.age),
				contact: form.contact.trim(),
			});

			const updatedPatients = await patientAPI.getAll();
			setPatients(normalizePatients(updatedPatients));
			setSuccessMessage("Patient saved successfully.");
			setForm({ name: "", age: "", contact: "" });
			setIsModalOpen(false);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Failed to save patient");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex min-h-screen flex-col bg-slate-50">
			<Sidebar />

			<header className="fixed left-64 right-0 top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
				<div className="flex items-center justify-between px-8 py-4">
					<div className="relative w-full max-w-xl">
						<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							placeholder="Search patients, medicines, appointments..."
							className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
						/>
					</div>

					<div className="ml-8 flex items-center gap-6 text-slate-600">
						<button className="relative rounded-full p-2 transition hover:bg-slate-100 hover:text-teal-600">
							<AlertCircle className="h-5 w-5" />
							<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
						</button>
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white shadow-sm">
								DR
							</span>
							<div>
								<p className="text-sm font-semibold text-slate-900">Dr. Rivera</p>
								<p className="text-xs text-slate-500">Administrator</p>
							</div>
							<ChevronDown className="h-4 w-4 text-slate-400" />
						</div>
					</div>
				</div>
			</header>

			<main className="relative flex-1 overflow-y-auto pt-24 pl-64">
				<div className="space-y-6 px-8 py-8">
					<section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Patients</p>
							<h1 className="mt-2 text-4xl font-bold text-slate-950">Patients</h1>
							<p className="mt-2 max-w-2xl text-slate-600">Manage patient records, history, and contact details.</p>
						</div>

						<button
							type="button"
							onClick={() => setIsModalOpen(true)}
							className="inline-flex items-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition hover:bg-teal-600"
						>
							<Plus className="h-4 w-4" />
							Add Patient
						</button>
					</section>

					<section className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
							<p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Total</p>
							<p className="mt-3 text-4xl font-bold text-slate-950">{stats.total}</p>
						</div>
						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
							<p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Active</p>
							<p className="mt-3 text-4xl font-bold text-emerald-600">{stats.active}</p>
						</div>
						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
							<p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Pending</p>
							<p className="mt-3 text-4xl font-bold text-amber-500">{stats.pending}</p>
						</div>
					</section>

					<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div className="relative w-full max-w-md">
								<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<input
									type="text"
									value={search}
									onChange={(event) => setSearch(event.target.value)}
									placeholder="Search by name or ID..."
									className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
								/>
							</div>

							<button
								type="button"
								className="inline-flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
							>
								<span className="inline-flex items-center gap-2">
									<Filter className="h-4 w-4" />
									{statusFilter}
								</span>
								<ChevronDown className="h-4 w-4 text-slate-400" />
							</button>
						</div>

						<div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 text-sm">
							{['All status', 'Active', 'Pending'].map((item) => (
								<button
									key={item}
									type="button"
									onClick={() => setStatusFilter(item)}
									className={`rounded-full px-4 py-2 transition ${
										statusFilter === item
											? 'bg-teal-500 text-white'
											: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
									}`}
								>
									{item}
								</button>
							))}
						</div>

						{errorMessage && (
							<div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
								{errorMessage}
							</div>
						)}

						{successMessage && (
							<div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
								{successMessage}
							</div>
						)}

						<div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-slate-200 text-left">
									<thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
										<tr>
											<th className="px-6 py-4 font-semibold">Patient</th>
											<th className="px-6 py-4 font-semibold">Age</th>
											<th className="px-6 py-4 font-semibold">Contact</th>
											<th className="px-6 py-4 font-semibold">Condition</th>
											<th className="px-6 py-4 font-semibold">Last visit</th>
											<th className="px-6 py-4 font-semibold">Status</th>
											<th className="px-6 py-4 font-semibold text-right">Actions</th>
										</tr>
									</thead>

									<tbody className="divide-y divide-slate-100 bg-white">
										{loading ? (
											<tr>
												<td colSpan={7} className="px-6 py-20 text-center text-sm text-slate-500">
													Loading patients from the backend...
												</td>
											</tr>
										) : filteredPatients.length === 0 ? (
											<tr>
												<td colSpan={7} className="px-6 py-20 text-center text-sm text-slate-500">
													No patients found. Add a new patient to store it in the database.
												</td>
											</tr>
										) : (
											filteredPatients.map((patient) => (
												<tr key={String(patient.id)} className="transition hover:bg-slate-50/70">
													<td className="px-6 py-5">
														<div className="flex items-center gap-4">
															<div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
																{String(patient.name)
																	.split(" ")
																	.filter(Boolean)
																	.slice(0, 2)
																	.map((part) => part[0])
																	.join("")
																	.toUpperCase() || "P"}
															</div>
															<div>
																<p className="font-semibold text-slate-900">{patient.name}</p>
																<p className="text-sm text-slate-500">{patient.gender ?? "Patient"} · ID {String(patient.id)}</p>
															</div>
														</div>
													</td>
													<td className="px-6 py-5 text-slate-700">{patient.age}</td>
													<td className="px-6 py-5 text-slate-700">
														<span className="inline-flex items-center gap-2">
															<Calendar className="h-4 w-4 text-slate-400" />
															{patient.contact}
														</span>
													</td>
													<td className="px-6 py-5 text-slate-700">{patient.condition ?? "General checkup"}</td>
													<td className="px-6 py-5 text-slate-500">{patient.lastVisit ?? "-"}</td>
													<td className="px-6 py-5">
														<span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyles(patient.status)}`}>
															<span className="h-2 w-2 rounded-full bg-current" />
															{patient.status ?? "Active"}
														</span>
													</td>
													<td className="px-6 py-5">
														<div className="flex items-center justify-end gap-3 text-slate-500">
															<button className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-teal-600" aria-label="View patient">
																<Stethoscope className="h-4 w-4" />
															</button>
															<button className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-teal-600" aria-label="Edit patient">
																<UserPlus className="h-4 w-4" />
															</button>
															<button className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-rose-600" aria-label="Delete patient">
																<Trash2 className="h-4 w-4" />
															</button>
															<button className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-slate-700" aria-label="More actions">
																<MoreHorizontal className="h-4 w-4" />
															</button>
														</div>
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						</div>
					</section>
				</div>

				<Footer />
			</main>

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8 backdrop-blur-sm">
					<div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">New Patient</p>
								<h2 className="mt-2 text-2xl font-bold text-slate-950">Add patient</h2>
							</div>
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
							>
								✕
							</button>
						</div>

						<form className="mt-6 space-y-4" onSubmit={handleAddPatient}>
							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
								<input
									value={form.name}
									onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
									required
									className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
									placeholder="Enter patient name"
								/>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="mb-2 block text-sm font-medium text-slate-700">Age</label>
									<input
										type="number"
										value={form.age}
										onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
										required
										min="0"
										className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
										placeholder="Age"
									/>
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-slate-700">Contact</label>
									<input
										value={form.contact}
										onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))}
										required
										className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
										placeholder="Phone number"
									/>
								</div>
							</div>

							<div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-700">
								<div className="flex items-center gap-2">
									<ShieldCheck className="h-4 w-4" />
									The record will be saved directly in the database through the backend API.
								</div>
							</div>

							<div className="flex items-center justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={saving}
									className="inline-flex items-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
								>
									<Plus className="h-4 w-4" />
									{saving ? "Saving..." : "Save Patient"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
