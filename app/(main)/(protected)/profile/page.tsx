"use client"

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function profilePage(){
    const supabase = createClient();

    const [user, setUser] = useState<User| null>(null);
    const [data, setData] = useState< any >(null)
    const userId = user?.id;
    
      useEffect(() => {
        const fetchUser = async () => {
          const { data: { user } } = await supabase.auth.getUser()
          setUser(user)
        }
        fetchUser()
      }, []);

      useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('Profile')
                .select()
                .eq("id", userId)
                .single()
            if (error) {
                toast.error(error.message)
                return
            }
      }})
        

    return(
        <div>
            <p>this is test data</p>
        </div>
    )
}


