import Footer from "../components/Footer";
import Sidebar from "../components/sidebar";
import { CalendarDays, Mail, Phone, Stethoscope, UserRound } from "lucide-react";

const profileStats = [
	{ label: "Years of Practice", value: "12", icon: Stethoscope },
	{ label: "Patients Seen", value: "2,847", icon: UserRound },
	{ label: "Appointments This Week", value: "24", icon: CalendarDays },
	{ label: "Contact", value: "Available", icon: Phone },
];

export default function DoctorProfilePage() {
	return (
		<div className="flex min-h-screen flex-col bg-slate-50">
			<Sidebar />

			<main className="relative flex-1 pt-8 pl-64">
				<div className="space-y-6 px-8 py-8">
					<section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
						<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
							<div className="flex items-center gap-5">
								<div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-500 text-2xl font-semibold text-white shadow-lg shadow-teal-200">
									DR
								</div>
								<div>
									<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Doctor Profile</p>
									<h1 className="mt-2 text-4xl font-bold text-slate-950">Dr. Rivera</h1>
									<p className="mt-2 text-slate-600">Administrator · Internal Medicine · Central Hospital</p>
								</div>
							</div>

							<div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-600">
								<p className="font-semibold text-slate-900">Contact</p>
								<p className="mt-1 flex items-center gap-2"><Mail className="h-4 w-4 text-teal-500" /> rivera@medicore.com</p>
								<p className="mt-1 flex items-center gap-2"><Phone className="h-4 w-4 text-teal-500" /> +1 (555) 014-2290</p>
							</div>
						</div>
					</section>

					<section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
						{profileStats.map((item) => (
							<div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
								<div className="flex items-center justify-between gap-4">
									<div>
										<p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
										<p className="mt-3 text-4xl font-bold text-slate-950">{item.value}</p>
									</div>
									<item.icon className="h-8 w-8 text-teal-500" />
								</div>
							</div>
						))}
					</section>

					<section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						<div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
							<h2 className="text-lg font-semibold text-slate-950">About</h2>
							<p className="mt-3 leading-7 text-slate-600">
								Dr. Rivera manages general consultations, patient follow-ups, and care coordination across the clinic.
								This page can be connected to live staff data later without changing the layout.
							</p>
						</div>

						<div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
							<h2 className="text-lg font-semibold text-slate-950">Quick Actions</h2>
							<div className="mt-4 space-y-3 text-sm text-slate-700">
								<div className="rounded-2xl bg-slate-50 px-4 py-3">Review schedule</div>
								<div className="rounded-2xl bg-slate-50 px-4 py-3">Edit preferences</div>
								<div className="rounded-2xl bg-slate-50 px-4 py-3">View billing details</div>
							</div>
						</div>
					</section>
				</div>
				<Footer />
			</main>
		</div>
	);
}
