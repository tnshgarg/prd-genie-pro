import { useState } from "react";
import { useParams } from "react-router-dom";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useIdeas } from "@/hooks/use-ideas";
import { Idea } from "@/types";
import { useEffect, useCallback } from "react";

export default function DetailedIdeaPage() {
  const { id } = useParams<{ id: string }>();
  const { ideas, updateIdea, loading } = useIdeas();
  const idea = ideas.find((idea) => idea.id === id);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (idea) {
      setContent(idea.content || "");
    }
  }, [idea]);

  // Optional: You can still keep a manual save button if needed,
  // but the auto-save handles the primary saving as the user types.
  const handleManualSave = async () => {
    if (id) {
      try {
        await updateIdea(id, { content }); // Save the current content immediately
        console.log("Manual save triggered and completed.");
      } catch (error) {
        console.error("Manual save failed:", error);
        // Consider showing an error toast here as well
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Idea Details</h1>
        <Button onClick={handleManualSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
        {loading && <p>Loading...</p>}
        {!loading && !idea && <p>Idea not found.</p>}
      </div>
      <div className="bg-card rounded-lg shadow-sm">
        {!loading && idea && (
          <RichTextEditor content={content} onChange={setContent} />
        )}
      </div>
    </div>
  );
}
