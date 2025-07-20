import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

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