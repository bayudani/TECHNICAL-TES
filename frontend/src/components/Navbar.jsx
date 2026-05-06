import Link from 'next/link';
import { cookies } from 'next/headers';
import { logoutAction } from '../lib/actions';

export default async function Navbar() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userName = cookieStore.get('user_name')?.value;

    return (
        <div className="navbar bg-base-100 shadow-sm border-b border-base-200 sticky top-0 z-50">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
                        </svg>
                    </div>
                    {/* Menu Dropdown Mobile */}
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200">
                        <li><Link href="/">Home</Link></li>
                        {token && <li><Link href="/dashboard">Dashboard</Link></li>}
                    </ul>
                </div>
                <Link href="/" className="btn btn-ghost text-xl font-bold text-primary">Garuda Post</Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    <li><Link href="/" className="font-medium">Home</Link></li>
                    {token && <li><Link href="/dashboard" className="font-medium">Dashboard</Link></li>}
                </ul>
            </div>

            <div className="navbar-end gap-2">
                {token ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg">
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200">
                            <li className="menu-title px-2 py-1 text-xs">Masuk sebagai <br/><span className="font-bold text-base-content text-sm">{userName}</span></li>
                            <div className="divider my-1"></div>
                            <li>
                                <form action={logoutAction} className="p-0">
                                    <button type="submit" className="w-full text-left text-error font-medium px-4 py-2 hover:bg-error/10">
                                        Logout
                                    </button>
                                </form>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <Link href="/login" className="btn btn-ghost btn-sm sm:btn-md font-semibold">Login</Link>
                        <Link href="/register" className="btn btn-primary btn-sm sm:btn-md">Register</Link>
                    </>
                )}
            </div>
        </div>
    );
}