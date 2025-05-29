import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import { useIdeas } from "@/hooks/use-ideas";
import { Idea } from "@/types";
import { useEffect, useCallback } from "react";

export default function DetailedIdeaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Idea Details</h1>
        </div>
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
