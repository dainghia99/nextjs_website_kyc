"use client";
import { mockKYCAccounts } from "@/constants/mock-data";

export default function Dashboard() {
	return (
		<div className="container mx-auto px-4 py-8">
			{/* KYC Accounts List */}
			<div>
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					Danh sách tài khoản đã KYC
				</h1>
				<div className="grid gap-6">
					{mockKYCAccounts.map((account) => (
						<div
							key={account.id}
							className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
						>
							<div>
								<h3 className="font-bold text-gray-800">{account.name}</h3>
								<p className="text-gray-600">{account.email}</p>
								<p className="text-gray-500 text-sm mt-1">
									Ngày xác thực: {account.date}
								</p>
							</div>
							<div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
								{account.status}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
