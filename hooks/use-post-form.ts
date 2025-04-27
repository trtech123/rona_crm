import { useState, useCallback } from "react";
import { PostFormData, PostFormSchema, WritingStyle } from "@/types/post";
import { useToast } from "@/components/ui/use-toast";

const DEFAULT_WRITING_STYLES: Record<WritingStyle, boolean> = {
  professional: false,
  friendly: false,
  storytelling: false,
  persuasive: false,
  other: false,
};

const INITIAL_FORM_STATE: PostFormData = {
  step: 1,
  socialNetwork: "facebook",
  contentGoal: "",
  postType: "property-marketing",
  postProblem: "no-specific-problem",
  customPostProblem: "",
  useTemplate: false,
  selectedTemplate: null,
  targetAudience: "",
  hasSpecificProperty: "no",
  useExternalArticles: "no",
  externalArticleLink: "",
  writingStyles: DEFAULT_WRITING_STYLES,
  customWritingStyle: "",
  includeCTA: "no",
  ctaType: undefined,
  ctaText: "",
  ctaLink: "",
  ctaPhone: "",
  ctaWhatsappMessage: "",
  mediaType: "none",
  images: [],
  videoFile: null,
  videoLink: "",
};

export function usePostForm() {
  const [formData, setFormData] = useState<PostFormData>(INITIAL_FORM_STATE);
  const [progress, setProgress] = useState(25);
  const [activeTab, setActiveTabState] = useState("post-type");
  const { toast } = useToast();

  const updateFormData = useCallback((updates: Partial<PostFormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      return newData;
    });
  }, [setFormData]);

  const setActiveTab = useCallback((tab: string) => {
    setActiveTabState(tab);
  }, [setActiveTabState]);

  const handleNext = useCallback(() => {
    if (formData.step < 4) {
      const nextStep = formData.step + 1;
      updateFormData({ step: nextStep });
      setProgress(nextStep * 25);

      // Update active tab based on step
      switch (nextStep) {
        case 2:
          setActiveTab("content-creation");
          break;
        case 3:
          setActiveTab("media-creation");
          break;
        case 4:
          setActiveTab("final-post");
          break;
      }
    }
  }, [formData.step, updateFormData, setActiveTab]);

  const handlePrevious = useCallback(() => {
    if (formData.step > 1) {
      const prevStep = formData.step - 1;
      updateFormData({ step: prevStep });
      setProgress(prevStep * 25);

      // Update active tab based on step
      switch (prevStep) {
        case 1:
          setActiveTab("post-type");
          break;
        case 2:
          setActiveTab("content-creation");
          break;
        case 3:
          setActiveTab("media-creation");
          break;
      }
    }
  }, [formData.step, updateFormData, setActiveTab]);

  const jumpToStep = useCallback((targetStep: number) => {
    if (targetStep >= 1 && targetStep <= 4) {
      updateFormData({ step: targetStep });
      setProgress(targetStep * 25);

      // Update active tab based on step
      switch (targetStep) {
        case 1:
          setActiveTab("post-type");
          break;
        case 2:
          setActiveTab("content-creation");
          break;
        case 3:
          setActiveTab("media-creation");
          break;
        case 4:
          setActiveTab("final-post");
          break;
      }
    }
  }, [updateFormData, setActiveTab]);

  const handleWritingStyleChange = useCallback((style: WritingStyle) => {
    const newStyles = {
      ...formData.writingStyles,
      [style]: !formData.writingStyles[style],
    };
    updateFormData({ writingStyles: newStyles });
  }, [formData.writingStyles, updateFormData]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setProgress(25);
    setActiveTab("post-type");
  }, [setFormData, setActiveTab]);

  const validateStep = useCallback((step: number): boolean => {
    try {
      switch (step) {
        case 1:
          // Validate questionnaire step
          if (!formData.postType) {
            throw new Error("Please select a post type");
          }
          if (!formData.postProblem) {
            throw new Error("Please select a problem or question");
          }
          if (formData.postProblem === "other" && !formData.customPostProblem) {
            throw new Error("Please specify the custom problem or question");
          }
          break;
        case 2:
          // Validate content creation step
          if (!formData.contentGoal) {
            throw new Error("Please specify a content goal");
          }
          if (!formData.targetAudience) {
            throw new Error("Please specify the target audience");
          }
          break;
        case 3:
          // Media creation step is optional
          break;
        case 4:
          // Validate final post step
          if (formData.includeCTA === "yes") {
            if (!formData.ctaType) {
              throw new Error("Please select a CTA type");
            }
            if (!formData.ctaText) {
              throw new Error("Please provide CTA text");
            }
            if (formData.ctaType === "link" && !formData.ctaLink) {
              throw new Error("Please provide a CTA link");
            }
            if (formData.ctaType === "call" && !formData.ctaPhone) {
              throw new Error("Please provide a phone number");
            }
            if (formData.ctaType === "whatsapp" && !formData.ctaPhone) {
              throw new Error("Please provide a WhatsApp number");
            }
          }
          break;
      }
      return true;
    } catch (error) {
      toast({
        title: "Validation Error",
        description:
          error instanceof Error
            ? error.message
            : "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }
  }, [formData, toast]);

  return {
    formData,
    progress,
    activeTab,
    updateFormData,
    handleNext,
    handlePrevious,
    jumpToStep,
    handleWritingStyleChange,
    resetForm,
    validateStep,
    setActiveTab,
  };
}
