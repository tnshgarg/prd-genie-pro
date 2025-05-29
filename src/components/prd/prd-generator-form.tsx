"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { prdGenerationSchema, PRDGenerationData } from "@/lib/validations";
import { PRODUCT_CATEGORIES } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import { Lightbulb, Rocket, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Idea } from "@/types";

export function PRDGeneratorForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const idea = location.state?.idea as Idea | undefined;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PRDGenerationData>({
    resolver: zodResolver(prdGenerationSchema),
  });

  useEffect(() => {
    if (idea) {
      setValue("idea", idea.description);
      setValue("category", idea.category);
      if (idea.target_audience) {
        setValue("targetAudience", idea.target_audience);
      }
    }
  }, [idea, setValue]);

  const category = watch("category");

  const generatePRDContent = async (data: PRDGenerationData) => {
    const prompt = `Create a comprehensive Product Requirements Document (PRD) for the following product idea:

Product Idea: ${data.idea}
Category: ${data.category}
Target Audience: ${data.targetAudience}

Please structure the PRD with the following sections:
1. Overview
2. Problem Statement
3. Target Audience
4. User Stories
5. Functional Requirements
6. Non-Functional Requirements
7. Technical Specifications
8. Success Metrics

Format the response in Markdown.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
        import.meta.env.VITE_GEMINI_API_KEY
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate PRD content");
    }

    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
  };

  const onSubmit = async (data: PRDGenerationData) => {
    setIsGenerating(true);

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to generate a PRD");

      // Generate PRD content first
      const generatedContent = await generatePRDContent(data);

      // Create a new PRD record
      const { data: prd, error: insertError } = await supabase
        .from("prds")
        .insert({
          user_id: user.id,
          title: data.idea.split("\n")[0].slice(0, 100), // Use first line as title
          original_idea: data.idea,
          generated_prd: generatedContent,
          category: data.category,
          status: "final",
          is_favorite: false,
          idea_id: idea?.id, // Link to the original idea if it exists
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "PRD Generated!",
        description:
          "Your Product Requirements Document has been created successfully.",
      });

      navigate(`/prd/${prd.id}`);
    } catch (error) {
      console.error("Error generating PRD:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate PRD. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Spinner size="lg" />
            <h3 className="text-lg font-semibold">Generating Your PRD</h3>
            <p className="text-gray-600 text-center">
              Our AI is analyzing your idea and creating a comprehensive Product
              Requirements Document. This usually takes 30-60 seconds.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Lightbulb className="h-4 w-4" />
                <span>Analyzing idea</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Defining users</span>
              </div>
              <div className="flex items-center space-x-1">
                <Rocket className="h-4 w-4" />
                <span>Planning features</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate PRD</CardTitle>
        <CardDescription>
          Transform your product idea into a comprehensive Product Requirements
          Document
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="idea">Product Idea *</Label>
            <Textarea
              id="idea"
              placeholder="Describe your product idea in detail. What problem does it solve? Who is it for? What makes it unique?"
              className="min-h-[120px]"
              {...register("idea")}
            />
            {errors.idea && (
              <p className="text-sm text-red-600">{errors.idea.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Product Category *</Label>
            <Select onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience *</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., Small business owners, Students, Developers"
              {...register("targetAudience")}
            />
            {errors.targetAudience && (
              <p className="text-sm text-red-600">
                {errors.targetAudience.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Generate PRD
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
