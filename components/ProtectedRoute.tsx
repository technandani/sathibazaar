"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode; role: string }> = ({ children, role }) => {
//   const { user, isLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoading && (!user || (role && user.role !== role))) {
//       router.push(`/${role || "vendor"}/login`);
//     }
//   }, [user, isLoading, router, role]);

//   if (isLoading || !user || (role && user.role !== role)) {
//     return <div>Loading...</div>;
//   }

  return <>{children}</>;
};

export default ProtectedRoute;