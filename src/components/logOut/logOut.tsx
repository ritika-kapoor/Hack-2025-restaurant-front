import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("store_token")
        router.push("/login")
    } 

    return (
           <a onClick={handleLogout}>
               ログアウト
           </a>
            
    )
}