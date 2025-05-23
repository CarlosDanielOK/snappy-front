"use client";

import { UserContext } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { showCustomToast } from "./Notificacion";
import SearchBar from "./SearchBar";

export default function NavBar() {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { setToken, setUserId, setUserGoogle, userData } =
		useContext(UserContext);
	const [unreadNotifications, setUnreadNotifications] = useState();

	const router = useRouter();

	const pathname = usePathname();
	const shouldRenderLayout = !(
		pathname?.includes("/dashboard") ||
		pathname?.includes("/register") ||
		pathname?.includes("/completarregistro") ||
		pathname?.includes("/terminos") ||
		pathname === "/"
	);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				if (userData?.id) {
					const response = await fetch(
						`${process.env.NEXT_PUBLIC_API_URL}/notifications/user/${userData.id}`
					);
					const data = await response.json();

					const unread = data.filter(
						(notification: { status: string }) =>
							notification.status === "unread"
					);
					setUnreadNotifications(unread.length);
				}
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};

		fetchNotifications();
	}, [userData?.id]);

	const handleLogout = () => {
		Cookies.remove("auth_token");
		Cookies.remove("roles");
		localStorage.removeItem("userId");
		localStorage.removeItem("users");
		setToken(null);
		setUserId(null);
		setUserGoogle(null);
		showCustomToast("Snappy", "Cerraste sesión correctamente", "success");
		router.push("/");
	};

	const toggleDropdown = () => {
		setIsDropdownOpen((prevState) => !prevState);
	};

	return (
		<>
			{shouldRenderLayout && (
				<header className="fixed w-full p-2 flex justify-between items-center bg-white z-10 max-sm:justify-center">
					<div
						id="logoynombre"
						className="hidden sm:flex items-center justify-center sm:justify-start sm:col-span-1"
					>
						<Link href="/socialfeed" className="flex items-center">
							<Image
								src="/favicon.ico"
								width={60}
								height={60}
								alt="snappy logo"
							/>
							<h1 className="font-bold text-2xl ml-2">SNAPPY FRIENDS</h1>
						</Link>
					</div>

					<SearchBar />

					<nav>
						<div
							id="barradenavegacion"
							className="flex justify-center sm:justify-end sm:col-span-1"
						>
							<ul className="flex space-x-4 sm:space-x-5 items-center">
								<li>
									<Link href="/socialfeed">
										<Image src="/home.png" width={35} height={35} alt="home" />
									</Link>
								</li>
								{/* <li className="lg:hidden">
								<Image
									src="/lupa.png"
									width={35}
									height={35}
									alt="searchbar toggle"
								/>
							</li> */}
								<li>
									<Link href="/mensajesprivados">
										<Image
											src="/mensajes.png"
											width={35}
											height={35}
											alt="chats privados"
										/>
									</Link>
								</li>
								<li>
									<Link href="/newchat">
										<Image
											src="/snappear.png"
											width={35}
											height={35}
											alt="snappear"
										/>
									</Link>
								</li>
								<li>
									<Link href="/notificaciones" className="relative">
										<Image
											src="/bell.png"
											width={35}
											height={35}
											alt="notificaciones"
										/>
										{!!unreadNotifications && (
											<div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs top-[-8px] right-0 absolute">
												{unreadNotifications}
											</div>
										)}
									</Link>
								</li>
								<li className="relative">
									<button
										onClick={toggleDropdown}
										className="focus:outline-none"
										aria-label="Toggle dropdown"
									>
										<div className="w-10 h-10 mt-2 md:w-11 md:h-11 rounded-full overflow-hidden">
											<Image
												src={userData?.profile_image || "/no_img.png"}
												width={48}
												height={48}
												alt="foto de perfil"
												className="object-cover w-full h-full"
											/>
										</div>
									</button>
									{isDropdownOpen && (
										<div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
											<ul className="py-1">
												<li>
													<Link
														href="/miperfil"
														className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														<Image
															src="/user.png"
															alt="Mi perfil"
															width={15}
															height={15}
															className="mr-2"
														/>
														Mi perfil
													</Link>
												</li>
												<li>
													<Link
														href="/crearpublicacion"
														className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														<Image
															src="/mas.jpg"
															alt="Crear publicación"
															width={15}
															height={5}
															className="mr-2"
														/>
														Crear Snappy Post
													</Link>
												</li>
												<li>
													<Link
														href="/crear-story"
														className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														<Image
															src="/reloj.png"
															alt="CrearStory"
															width={15}
															height={15}
															className="mr-2"
														/>
														Crear Snappy Moment
													</Link>
												</li>
												<li>
													<Link
														href="/mensajeschatgrupal"
														className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														<Image
															src="/chat-grupal.png"
															alt="CrearStory"
															width={15}
															height={15}
															className="mr-2"
														/>
														Chat grupal
													</Link>
												</li>
												<li>
													<Link
														href="/editarperfil"
														className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														<Image
															src="/editarperfil.png"
															alt="Editar perfil"
															width={15}
															height={15}
															className="mr-2"
														/>
														Editar perfil
													</Link>
												</li>
												<li>
													<Link
														href="/configuracion"
														className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														<Image
															src="/settings.png"
															alt="Configuración"
															width={15}
															height={15}
															className="mr-2"
														/>
														Configuración
													</Link>
												</li>
												{(userData?.user_role === "superadmin" ||
													userData?.user_role === "admin") && (
													<li>
														<Link
															href="/dashboard"
															className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
														>
															<Image
																src="/dashboard.png"
																alt="Dashboard"
																width={15}
																height={15}
																className="mr-2"
															/>
															Dashboard
														</Link>
													</li>
												)}
												<li>
													<button
														onClick={handleLogout}
														className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													>
														<Image
															src="/logout.png"
															alt="Cerrar sesión"
															width={15}
															height={15}
															className="mr-2"
														/>
														Cerrar sesión
													</button>
												</li>
											</ul>
										</div>
									)}
								</li>
							</ul>
						</div>
					</nav>
				</header>
			)}
		</>
	);
}
