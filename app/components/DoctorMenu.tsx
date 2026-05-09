"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown } from "lucide-react";

type DoctorMenuProps = {
	name?: string;
	role?: string;
};

export default function DoctorMenu({ name = "Dr. Rivera", role = "Administrator" }: DoctorMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handlePointerDown(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handlePointerDown);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
			document.removeEventListener("keydown", handleEscape);
		};
	}, []);

	return (
		<div className="relative flex items-center gap-6" ref={menuRef}>
			<button className="relative text-gray-600 hover:text-teal-600" type="button" aria-label="Notifications">
				<Bell className="h-5 w-5" />
				<span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
			</button>

			<div className="relative">
				<button
					type="button"
					onClick={() => setIsOpen((current) => !current)}
					aria-haspopup="menu"
					aria-expanded={isOpen}
					className="flex items-center gap-3 rounded-2xl px-2 py-1.5 text-left transition hover:bg-slate-50"
				>
					<span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white shadow-sm">
						DR
					</span>
					<div className="leading-tight">
						<p className="text-sm font-semibold text-slate-900">{name}</p>
						<p className="text-xs text-slate-500">{role}</p>
					</div>
					<ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
				</button>

				{isOpen ? (
					<div
						role="menu"
						aria-label="My account"
						className="absolute right-0 top-[calc(100%+12px)] z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
					>
						<div className="border-b border-slate-100 px-5 py-4">
							<p className="text-lg font-semibold text-slate-900">My Account</p>
						</div>

						<div className="p-2 text-sm text-slate-700">
							<Link
								href="/profile"
								role="menuitem"
								onClick={() => setIsOpen(false)}
								className="block rounded-xl px-4 py-3 transition hover:bg-slate-50 hover:text-slate-950"
							>
								Profile
							</Link>
							<Link
								href="/settings"
								role="menuitem"
								onClick={() => setIsOpen(false)}
								className="block rounded-xl px-4 py-3 transition hover:bg-slate-50 hover:text-slate-950"
							>
								Preferences
							</Link>
							<Link
								href="/settings"
								role="menuitem"
								onClick={() => setIsOpen(false)}
								className="block rounded-xl px-4 py-3 transition hover:bg-slate-50 hover:text-slate-950"
							>
								Billing
							</Link>
						</div>

						<div className="border-t border-slate-100 p-2">
							<Link
								href="/homepage"
								role="menuitem"
								onClick={() => setIsOpen(false)}
								className="block rounded-xl px-4 py-3 text-red-500 transition hover:bg-red-50"
							>
								Log out
							</Link>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
