"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, ImageIcon, PenTool, Save, ArrowLeft, Loader2 } from "lucide-react"
import { FORM_STEPS, TABS } from "@/constants/form"
import { PostTypeSection } from "./post-creation/post-type-section"
import { PostProblemSection } from "./post-creation/post-problem-section"
import { SocialNetworkSection } from "./post-creation/social-network-section"
import { GoalsSection } from "./post-creation/goals-section"
import { AudienceSection } from "./post-creation/audience-section"
import { TemplateSection } from "./post-creation/template-section"
import { PropertySection } from "./post-creation/property-section"
import { CTASection } from "./post-creation/cta-section"
import { ContentCreationSection } from "./post-creation/content-creation-section"
import { MediaCreationSection } from "./post-creation/media-creation-section"
import { PostFormData } from "@/types/post"
import { generatePost } from "@/lib/openai"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { usePostForm } from "@/hooks/use-post-form"

interface GeneratedContent {
  content: string
  hashtags: string[]
  suggestedImagePrompt: string
  cta: string
}

export function PostCreationForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const { toast } = useToast()

  const {
    formData,
    progress,
    activeTab,
    updateFormData,
    handleNext,
    handlePrevious,
    jumpToStep,
    setActiveTab,
  } = usePostForm()

  const handleFinish = async () => {
    try {
      setIsGenerating(true)
      const response = await generatePost(formData)
      const parsedResponse = JSON.parse(response || '{}')
      setGeneratedContent(parsedResponse)
      toast({
        title: "Success",
        description: "Your post has been generated successfully!",
      })
    } catch (error) {
      console.error('Error generating post:', error)
      toast({
        title: "Error",
        description: "Failed to generate post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

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
            variant={formData.step === FORM_STEPS.QUESTIONNAIRE ? "default" : "ghost"}
            className={`rounded-none border-b-2 ${
              formData.step === FORM_STEPS.QUESTIONNAIRE ? "border-purple-500" : "border-transparent"
            } px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(FORM_STEPS.QUESTIONNAIRE)}
          >
            <FileText className="mr-2 h-4 w-4" />
            שאלון
          </Button>
          <Button
            variant={formData.step === FORM_STEPS.CONTENT_CREATION ? "default" : "ghost"}
            className={`rounded-none border-b-2 ${
              formData.step === FORM_STEPS.CONTENT_CREATION ? "border-purple-500" : "border-transparent"
            } px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(FORM_STEPS.CONTENT_CREATION)}
          >
            <PenTool className="mr-2 h-4 w-4" />
            יצירת תוכן
          </Button>
          <Button
            variant={formData.step === FORM_STEPS.MEDIA_CREATION ? "default" : "ghost"}
            className={`rounded-none border-b-2 ${
              formData.step === FORM_STEPS.MEDIA_CREATION ? "border-purple-500" : "border-transparent"
            } px-4 py-3 text-sm font-medium transition-all`}
            onClick={() => jumpToStep(FORM_STEPS.MEDIA_CREATION)}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            מדיה
          </Button>
          <Button
            variant={formData.step === FORM_STEPS.FINAL_POST ? "default" : "ghost"}
            className={`rounded-none border-b-2 ${
              formData.step === FORM_STEPS.FINAL_POST ? "border-purple-500" : "border-transparent"
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
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
            <SocialNetworkSection formData={formData} onUpdate={updateFormData} />
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
          
          {generatedContent && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold">Generated Content</h3>
                  <p className="whitespace-pre-wrap">{generatedContent.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {generatedContent.hashtags.map((tag, index) => (
                      <span key={index} className="text-blue-500">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {generatedContent.suggestedImagePrompt && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold">Suggested Image Prompt:</h4>
                      <p className="text-sm text-gray-600">
                        {generatedContent.suggestedImagePrompt}
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">Suggested CTA:</h4>
                    <p className="text-sm text-gray-600">
                      {generatedContent.cta}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="flex justify-end mt-6">
        {formData.step === FORM_STEPS.FINAL_POST ? (
          <Button 
            onClick={handleFinish}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Post'
            )}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            הבא
          </Button>
        )}
      </div>
    </div>
  )
}

export default PostCreationForm

// ==================================================
// ========= סוף קומפוננטות עזר =========
// ==================================================