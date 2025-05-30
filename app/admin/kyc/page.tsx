/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	CheckCircleIcon,
	XCircleIcon,
	EyeIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
	useGetKYCRequestsQuery,
	useApproveKYCMutation,
	useRejectKYCMutation,
} from "@/store/services/adminApi";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationSlice";

export default function KYCManagement() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// Sử dụng RTK Query hooks
	const { data, isLoading, error, refetch } = useGetKYCRequestsQuery({
		page: currentPage,
		perPage: itemsPerPage,
		search: searchTerm,
		status: filterStatus,
	});

	const [approveKYC, { isLoading: isApproving }] = useApproveKYCMutation();
	const [rejectKYC, { isLoading: isRejecting }] = useRejectKYCMutation();

	// Lấy dữ liệu
	const kycRequests = data?.requests || [];
	const totalRequests = data?.total || 0;
	const totalPages = Math.ceil(totalRequests / itemsPerPage);

	// Log dữ liệu để debug
	useEffect(() => {
		if (data) {
			console.log("KYC Requests Data:", data);
			console.log("Filter Status:", filterStatus);
			console.log("Total Requests:", totalRequests);
		}
	}, [data, filterStatus, totalRequests]);

	// Xử lý lỗi
	useEffect(() => {
		if (error) {
			dispatch(
				addNotification({
					message: "Không thể tải danh sách yêu cầu KYC",
					type: "error",
					duration: 5000,
				})
			);
		}
	}, [error, dispatch]);

	// Hàm định dạng ngày giờ
	const formatDateTime = (dateTimeStr: string) => {
		const date = new Date(dateTimeStr);
		return new Intl.DateTimeFormat("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	// Xử lý phê duyệt yêu cầu KYC
	const handleApproveKYC = async (requestId: number | string) => {
		// Nếu requestId là chuỗi bắt đầu bằng "user_", không thể phê duyệt
		if (typeof requestId === "string" && requestId.startsWith("user_")) {
			dispatch(
				addNotification({
					message: "Không thể phê duyệt yêu cầu KYC chưa có dữ liệu",
					type: "error",
					duration: 5000,
				})
			);
			return;
		}
		if (
			window.confirm("Bạn có chắc chắn muốn phê duyệt yêu cầu KYC này?")
		) {
			try {
				await approveKYC(requestId).unwrap();
				dispatch(
					addNotification({
						message: "Phê duyệt KYC thành công",
						type: "success",
						duration: 3000,
					})
				);
				refetch(); // Làm mới danh sách
			} catch (error) {
				console.error("Approve KYC error:", error);
				dispatch(
					addNotification({
						message: "Không thể phê duyệt yêu cầu KYC",
						type: "error",
						duration: 5000,
					})
				);
			}
		}
	};

	// Xử lý từ chối yêu cầu KYC
	const handleRejectKYC = async (requestId: number | string) => {
		// Nếu requestId là chuỗi bắt đầu bằng "user_", không thể từ chối
		if (typeof requestId === "string" && requestId.startsWith("user_")) {
			dispatch(
				addNotification({
					message: "Không thể từ chối yêu cầu KYC chưa có dữ liệu",
					type: "error",
					duration: 5000,
				})
			);
			return;
		}
		const reason = prompt("Vui lòng nhập lý do từ chối:");
		if (reason) {
			try {
				await rejectKYC({ kycId: requestId, reason }).unwrap();
				dispatch(
					addNotification({
						message: "Từ chối KYC thành công",
						type: "success",
						duration: 3000,
					})
				);
				refetch(); // Làm mới danh sách
			} catch (error) {
				console.error("Reject KYC error:", error);
				dispatch(
					addNotification({
						message: "Không thể từ chối yêu cầu KYC",
						type: "error",
						duration: 5000,
					})
				);
			}
		}
	};

	// Xử lý xem chi tiết yêu cầu KYC
	const handleViewKYC = (requestId: number | string) => {
		// Nếu requestId là chuỗi bắt đầu bằng "user_", không thể xem chi tiết
		if (typeof requestId === "string" && requestId.startsWith("user_")) {
			dispatch(
				addNotification({
					message:
						"Không thể xem chi tiết yêu cầu KYC chưa có dữ liệu",
					type: "error",
					duration: 5000,
				})
			);
			return;
		}
		router.push(`/admin/kyc/${requestId}`);
	};

	// Xử lý thay đổi trang
	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	// Xử lý tìm kiếm
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
	};

	// Xử lý thay đổi bộ lọc trạng thái
	const handleStatusFilterChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		setFilterStatus(e.target.value);
		setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
	};

	return (
		<div>
			<h1 className="text-2xl font-semibold text-gray-900">
				Quản lý KYC
			</h1>

			{/* Thanh tìm kiếm và bộ lọc */}
			<div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
				<form
					onSubmit={handleSearch}
					className="relative flex-1 max-w-md"
				>
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<MagnifyingGlassIcon
							className="h-5 w-5 text-gray-400"
							aria-hidden="true"
						/>
					</div>
					<input
						type="text"
						className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
						placeholder="Tìm kiếm yêu cầu KYC..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</form>

				<div className="flex w-[400px] space-x-4">
					<select
						value={filterStatus}
						onChange={handleStatusFilterChange}
						className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
					>
						<option value="all">Tất cả trạng thái</option>
						<option value="pending">Đang chờ</option>
						<option value="verified">Đã xác minh</option>
					</select>

					<button
						onClick={() => refetch()}
						className="inline-flex items-center w-full justify-center cursor-pointer px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
						disabled={isLoading}
					>
						{isLoading ? "Đang tải..." : "Làm mới"}
					</button>
				</div>
			</div>

			{/* Danh sách yêu cầu KYC */}
			{isLoading ? (
				<div className="text-center py-10">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
					<p>Đang tải dữ liệu...</p>
				</div>
			) : (
				<div className="mt-6 space-y-6">
					{kycRequests.length === 0 ? (
						<div className="bg-white p-6 text-center rounded-lg shadow">
							<p className="text-gray-500">
								Không tìm thấy yêu cầu KYC nào
							</p>
						</div>
					) : (
						kycRequests.map((request) => (
							<div
								key={`${request.id}-${request.user_id}`}
								className="bg-white p-6 rounded-lg shadow-md"
							>
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-lg font-semibold text-gray-900">
											{request.full_name}
										</h3>
										<p className="text-gray-600">
											{request.email}
										</p>
										<div className="mt-2 flex flex-col sm:flex-row sm:space-x-6">
											<span className="text-gray-500 text-sm">
												Ngày gửi:{" "}
												{formatDateTime(
													request.submitted_at
												)}
											</span>
											{request.verified_at && (
												<span className="text-gray-500 text-sm">
													Ngày xác minh:{" "}
													{formatDateTime(
														request.verified_at
													)}
												</span>
											)}
										</div>
									</div>
									<div>
										<span
											className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${request.status === "verified"
												? "bg-green-100 text-green-800"
												: request.status ===
													"rejected"
													? "bg-red-100 text-red-800"
													: "bg-yellow-100 text-yellow-800"
												}`}
										>
											{request.status === "verified"
												? "Đã xác minh"
												: request.status === "rejected"
													? "Đã từ chối"
													: "Đang chờ"}
										</span>
									</div>
								</div>

								{request.status === "rejected" && (
									<div className="mt-4 p-3 bg-red-50 rounded text-sm text-red-700">
										<span className="font-semibold">
											Lý do từ chối:
										</span>{" "}
										{request.rejection_reason ||
											"Không đáp ứng yêu cầu xác minh"}
									</div>
								)}

								<div className="mt-4 flex justify-end space-x-3">
									<button
										onClick={() =>
											handleViewKYC(request.id)
										}
										className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
									>
										<EyeIcon className="h-4 w-4 mr-1" />
										Chi tiết
									</button>

									{request.status === "pending" &&
										!(
											typeof request.id === "string" &&
											request.id.startsWith("user_")
										) && (
											<>
												<button
													onClick={() =>
														handleApproveKYC(
															request.id
														)
													}
													className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
													disabled={isApproving}
												>
													<CheckCircleIcon className="h-4 w-4 mr-1" />
													Phê duyệt
												</button>

												<button
													onClick={() =>
														handleRejectKYC(
															request.id
														)
													}
													className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
													disabled={isRejecting}
												>
													<XCircleIcon className="h-4 w-4 mr-1" />
													Từ chối
												</button>
											</>
										)}
								</div>
							</div>
						))
					)}
				</div>
			)}

			{/* Phân trang */}
			{totalPages > 1 && (
				<div className="flex justify-center mt-8">
					<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1 || isLoading}
							className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
						>
							<span className="sr-only">Previous</span>
							<svg
								className="h-5 w-5"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						</button>

						{Array.from(
							{ length: totalPages },
							(_, i) => i + 1
						).map((page) => (
							<button
								key={`page-${page}`}
								onClick={() => handlePageChange(page)}
								disabled={isLoading}
								className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${page === currentPage
									? "bg-orange-50 text-orange-600 border-orange-500 z-10"
									: "text-gray-500 hover:bg-gray-50"
									}`}
							>
								{page}
							</button>
						))}

						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages || isLoading}
							className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
						>
							<span className="sr-only">Next</span>
							<svg
								className="h-5 w-5"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</nav>
				</div>
			)}
		</div>
	);
}
