// ここではログインしているかしていないか判定する処理を行う
"use client"

import {useEffect} from "react"
import {useRouter} from "next/navigation"

export default function IsLoginOrNot() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("store_token")
        if(!token) {
            router.push("/login")
        }
    }, [router])

    return null;
} 
