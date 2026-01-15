"use client"

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { set } from "react-hook-form";
import { useProfile } from "@/context/ProfileContext";

export default function ProfilePage() {
    const supabase = createClient();
    const userId = useAuth().user?.id;
    const { profile } = useProfile()
    const [data, setData] = useState<any>(null);




    return (
        <div>
            <p>This is test data and this is the user's id: {userId}</p>
            {!profile ? (<div>Loading...</div>) : 
                (<p>Data: {JSON.stringify(profile)}</p>)}
        </div>
    );
}
