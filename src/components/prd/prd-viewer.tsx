"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PRD } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Download, Edit, Heart, Share } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PRDViewerProps {
  prd: PRD;
}

export function PRDViewer({ prd }: PRDViewerProps) {
  const [isFavorite, setIsFavorite] = useState(prd.is_favorite);

  const handleExport = async (format: "markdown" | "txt") => {
    try {
      let content = "";
      let fileExtension = "";

      if (format === "markdown") {
        content = `# ${prd.title}\n\n## Original Idea\n\n${prd.original_idea}\n\n## Product Requirements Document\n\n${prd.generated_prd}`;
        fileExtension = "md";
      } else {
        content = `${prd.title}\n\nOriginal Idea:\n${prd.original_idea}\n\nProduct Requirements Document:\n${prd.generated_prd}`;
        fileExtension = "txt";
      }

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${prd.title}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `PRD exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PRD. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async () => {
    try {
      const { error } = await supabase
        .from("prds")
        .update({ is_favorite: !isFavorite })
        .eq("id", prd.id);

      if (error) throw error;

      setIsFavorite(!isFavorite);

      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite
          ? "PRD removed from your favorites"
          : "PRD added to your favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/prd/${prd.id}`;
    navigator.clipboard.writeText(url);

    toast({
      title: "Link Copied",
      description: "PRD link copied to clipboard",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{prd.title}</CardTitle>
              <div className="flex items-center space-x-2">
                {prd.category && (
                  <Badge variant="secondary">{prd.category}</Badge>
                )}
                <Badge variant={prd.status === "final" ? "default" : "outline"}>
                  {prd.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  Created {new Date(prd.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFavorite}
                className={isFavorite ? "text-red-500" : ""}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("markdown")}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("txt")}
              >
                <Download className="h-4 w-4" />
                Text
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Original Idea</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">
            {prd.original_idea}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Requirements Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium mt-4 mb-2 text-gray-700">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-gray-600 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 list-decimal space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-600">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
              }}
            >
              {prd.generated_prd}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
