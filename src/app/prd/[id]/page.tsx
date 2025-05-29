"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PRD } from "@/types";
import { PRDViewer } from "@/components/prd/prd-viewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Navbar } from "@/components/layout/navbar";

export default function PRDPage() {
  const [prd, setPrd] = useState<PRD | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        navigate("/login");
        return;
      }

      setUser(user);
      fetchPRD();
    };

    checkAuth();
  }, [navigate, id]);

  const fetchPRD = async () => {
    try {
      const response = await fetch(`/api/prds/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          navigate("/dashboard");
          return;
        }
        throw new Error("Failed to fetch PRD");
      }

      const data = await response.json();
      setPrd(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load PRD",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground">Loading PRD...</p>
        </div>
      </div>
    );
  }

  if (!prd) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            PRD Not Found
          </h1>
          <p className="text-muted-foreground mb-4">
            The PRD you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <PRDViewer prd={prd} />
      </main>
    </div>
  );
}
