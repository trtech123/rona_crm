"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  ImageIcon,
  PenTool,
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { FORM_STEPS, TABS } from "@/constants/form";
import { PostTypeSection } from "./post-creation/post-type-section";
import { PostProblemSection } from "./post-creation/post-problem-section";
import { SocialNetworkSection } from "./post-creation/social-network-section";
import { GoalsSection } from "./post-creation/goals-section";
import { AudienceSection } from "./post-creation/audience-section";
import { TemplateSection } from "./post-creation/template-section";
import { PropertySection } from "./post-creation/property-section";
import { CTASection } from "./post-creation/cta-section";
import { ContentCreationSection } from "./post-creation/content-creation-section";
import { MediaCreationSection } from "./post-creation/media-creation-section";
import { PostFormData } from "@/types/post";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { usePostForm } from "@/hooks/use-post-form";
import { createPostAction, saveDirectPostAction } from "@/app/actions/postActions";
import { useRouter } from 'next/navigation';

export function PostCreationForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingDirectly, setIsSavingDirectly] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const {
    formData,
    progress,
    activeTab,
    updateFormData,
    handleNext,
    handlePrevious,
    jumpToStep,
    setActiveTab,
  } = usePostForm();

  const handleFinish = async () => {
    setIsGenerating(true);
    setGeneratedContent(null);
    console.log('[Client] handleFinish: Attempting to call createPostAction...');
    try {
      const response = await createPostAction(formData);
      console.log('[Client] Server action response (AI Generate):', response);

      if (response.success) {
        toast({
          title: "הצלחה",
          description: response.message || "הפוסט נוצר ונשמר בהצלחה!",
        });
        console.log('[Client] Redirecting to /posts...');
        router.push('/posts');
      } else {
        toast({
          title: "שגיאה",
          description: response.message || "נכשל ביצירת הפוסט.",
          variant: "destructive",
        });
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Error calling AI generate action:", error);
      toast({ title: "שגיאה", description: "אירעה שגיאה לא צפויה. נסה שוב.", variant: "destructive" });
      setIsGenerating(false);
    }
  };

  const handleSaveDirectly = async () => {
    setIsSavingDirectly(true);
    console.log('[Client] handleSaveDirectly: Attempting to call saveDirectPostAction...');
    try {
      const response = await saveDirectPostAction(formData);
      console.log('[Client] Server action response (Direct Save):', response);

      if (response.success) {
        toast({
          title: "הצלחה",
          description: response.message || "הפוסט נשמר בהצלחה!",
        });
        console.log('[Client] Redirecting to /posts...');
        router.push('/posts');
      } else {
        toast({
          title: "שגיאה",
          description: response.message || "נכשל בשמירת הפוסט.",
          variant: "destructive",
        });
        setIsSavingDirectly(false);
      }
    } catch (error) {
      console.error("Error calling direct save action:", error);
      toast({ title: "שגיאה", description: "אירעה שגיאה לא צפויה. נסה שוב.", variant: "destructive" });
      setIsSavingDirectly(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={formData.step === FORM_STEPS.QUESTIONNAIRE}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          חזור
        </Button>

        <div className="flex space-x-2 rtl:space-x-reverse">
          <Button
            variant={
              formData.step === FORM_STEPS.QUESTIONNAIRE ? "default" : "ghost"
            }
            className={`rounded-none border-b-2 ${
              formData.step === FORM_STEPS.QUESTIONNAIRE
                ? "border-purple-500"
                : "border-transparent"
            } px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(FORM_STEPS.QUESTIONNAIRE)}
          >
            <FileText className="mr-2 h-4 w-4" />
            שאלון
          </Button>
          <Button
            variant={
              formData.step === FORM_STEPS.CONTENT_CREATION
                ? "default"
                : "ghost"
            }
            className={`rounded-none border-b-2 ${
              formData.step === FORM_STEPS.CONTENT_CREATION
                ? "border-purple-500"
                : "border-transparent"
            } px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(FORM_STEPS.CONTENT_CREATION)}
          >
            <PenTool className="mr-2 h-4 w-4" />
            יצירת תוכן
          </Button>
          <Button
            variant={
              formData.step === FORM_STEPS.MEDIA_CREATION ? "default" : "ghost"
            }
            className={`rounded-none border-b-2 ${
              formData.step === FORM_STEPS.MEDIA_CREATION
                ? "border-purple-500"
                : "border-transparent"
            } px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(FORM_STEPS.MEDIA_CREATION)}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            מדיה
          </Button>
          <Button
            variant={
              formData.step === FORM_STEPS.FINAL_POST ? "default" : "ghost"
            }
            className={`rounded-none border-b-2 ${
              formData.step === FORM_STEPS.FINAL_POST
                ? "border-purple-500"
                : "border-transparent"
            } px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(FORM_STEPS.FINAL_POST)}
          >
            <Save className="mr-2 h-4 w-4" />
            פוסט מוכן
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Progress
          value={progress}
          className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500 transition-all duration-500 ease-out"
        />
        <p className="text-sm text-center mt-2 text-gray-500">
          שלב {formData.step} מתוך 4
        </p>
      </div>

      {formData.step === FORM_STEPS.QUESTIONNAIRE && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          <TabsList className="grid w-full grid-cols-7 gap-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value={TABS.POST_TYPE}>סוג הפוסט</TabsTrigger>
            <TabsTrigger value={TABS.PROBLEM}>בעיה/שאלה</TabsTrigger>
            <TabsTrigger value={TABS.SOCIAL_NETWORK}>רשת חברתית</TabsTrigger>
            <TabsTrigger value={TABS.GOALS}>מטרות</TabsTrigger>
            <TabsTrigger value={TABS.AUDIENCE}>קהל יעד</TabsTrigger>
            <TabsTrigger value={TABS.TEMPLATE}>תבנית עיצוב</TabsTrigger>
            <TabsTrigger value={TABS.PROPERTY}>נכס ספציפי</TabsTrigger>
          </TabsList>

          <TabsContent value={TABS.POST_TYPE}>
            <PostTypeSection formData={formData} onUpdate={updateFormData} />
          </TabsContent>

          <TabsContent value={TABS.PROBLEM}>
            <PostProblemSection formData={formData} onUpdate={updateFormData} />
          </TabsContent>

          <TabsContent value={TABS.SOCIAL_NETWORK}>
            <SocialNetworkSection
              formData={formData}
              onUpdate={updateFormData}
            />
          </TabsContent>

          <TabsContent value={TABS.GOALS}>
            <GoalsSection formData={formData} onUpdate={updateFormData} />
          </TabsContent>

          <TabsContent value={TABS.AUDIENCE}>
            <AudienceSection formData={formData} onUpdate={updateFormData} />
          </TabsContent>

          <TabsContent value={TABS.TEMPLATE}>
            <TemplateSection formData={formData} onUpdate={updateFormData} />
          </TabsContent>

          <TabsContent value={TABS.PROPERTY}>
            <PropertySection formData={formData} onUpdate={updateFormData} />
          </TabsContent>
        </Tabs>
      )}

      {formData.step === FORM_STEPS.CONTENT_CREATION && (
        <ContentCreationSection formData={formData} onUpdate={updateFormData} />
      )}

      {formData.step === FORM_STEPS.MEDIA_CREATION && (
        <MediaCreationSection formData={formData} onUpdate={updateFormData} />
      )}

      {formData.step === FORM_STEPS.FINAL_POST && (
        <div className="space-y-6">
          <CTASection formData={formData} onUpdate={updateFormData} />

          {isGenerating && (
            <Card>
              <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <p className="ml-3 text-lg">Generating your post...</p>
              </CardContent>
            </Card>
          )}

          {!isGenerating && generatedContent && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold">Generated Content</h3>
                  <p className="whitespace-pre-wrap">
                    {generatedContent.content}
                  </p>

                  {generatedContent.hashtags && Array.isArray(generatedContent.hashtags) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {generatedContent.hashtags.map((tag: string, index: number) => (
                        <span key={index} className="text-blue-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {generatedContent.suggestedImagePrompt && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold">
                        Suggested Image Prompt:
                      </h4>
                      <p className="text-sm text-gray-600">
                        {generatedContent.suggestedImagePrompt}
                      </p>
                    </div>
                  )}

                  {generatedContent.cta && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold">Suggested CTA:</h4>
                      <p className="text-sm text-gray-600">
                        {generatedContent.cta}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="flex justify-end mt-6 space-x-2 rtl:space-x-reverse">
        {formData.step === FORM_STEPS.FINAL_POST && (
           <Button
            variant="outline"
            onClick={handleSaveDirectly}
            disabled={isSavingDirectly || isGenerating} 
           >
            {isSavingDirectly ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                שומר...
              </>
            ) : (
              "שמור פוסט ישירות"
            )}
           </Button>
        )}

        {formData.step === FORM_STEPS.FINAL_POST ? (
          <Button
            onClick={handleFinish}
            disabled={isGenerating || isSavingDirectly}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                יוצר עם AI...
              </>
            ) : (
              "צור עם AI"
            )}
          </Button>
        ) : (
          <Button onClick={handleNext}>הבא</Button>
        )}
      </div>
    </div>
  );
}

export default PostCreationForm;

// ==================================================
// ========= סוף קומפוננטות עזר =========
// ==================================================
