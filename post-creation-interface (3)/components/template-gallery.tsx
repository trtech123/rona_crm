"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Copy, Check, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { SimplifiedTemplateCreator } from "@/components/simplified-template-creator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// עדכון תצוגת התבניות בגלריה כדי להציג את הכותרת הקבועה

// עדכן את הדוגמאות לתבניות כדי לכלול את השדות החדשים:
const sampleTemplates = [
  {
    id: "template-1",
    name: "תבנית עסקית",
    primaryColor: "#6D28D9",
    secondaryColor: "#EDE9FE",
    textColor: "#1F2937",
    hasLogo: true,
    hasProfileImage: false,
    hasBackgroundImage: false,
    hasButton: true,
    buttonText: "צור קשר",
    buttonUrl: "",
    logoPosition: "top-right",
    useFixedTitle: true,
    fixedTitle: 'שירותי נדל"ן מקצועיים',
    fixedSubtitle: "ליווי מקצועי בכל תהליך הרכישה",
    hasBorder: false,
    borderColor: "#6D28D9",
    borderWidth: 2,
    borderStyle: "solid",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "template-2",
    name: 'תבנית נדל"ן',
    primaryColor: "#047857",
    secondaryColor: "#ECFDF5",
    textColor: "#1F2937",
    hasLogo: true,
    hasProfileImage: true,
    hasBackgroundImage: true,
    hasButton: true,
    buttonText: "לפרטים נוספים",
    buttonUrl: "",
    logoPosition: "bottom-right",
    useFixedTitle: false,
    fixedTitle: "",
    fixedSubtitle: "",
    hasBorder: true,
    borderColor: "#047857",
    borderWidth: 2,
    borderStyle: "solid",
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
  },
  {
    id: "template-3",
    name: "תבנית מינימליסטית",
    primaryColor: "#1F2937",
    secondaryColor: "#F9FAFB",
    textColor: "#1F2937",
    hasLogo: false,
    hasProfileImage: false,
    hasBackgroundImage: false,
    hasButton: false,
    buttonText: "",
    buttonUrl: "",
    logoPosition: "top-right",
    useFixedTitle: true,
    fixedTitle: 'נדל"ן בגישה אחרת',
    fixedSubtitle: 'פתרונות נדל"ן מותאמים אישית',
    hasBorder: false,
    borderColor: "#1F2937",
    borderWidth: 1,
    borderStyle: "solid",
    createdAt: "2023-01-03T00:00:00.000Z",
    updatedAt: "2023-01-03T00:00:00.000Z",
  },
]

// עדכון הפונקציה TemplateGallery כדי לקבל פרופס נוספים לניווט בשאלון
// הוסף את הפרופס הבאים לחתימת הפונקציה:
export function TemplateGallery({ onSelectTemplate, onBack, onNextQuestion, onPreviousQuestion }) {
  const [templates, setTemplates] = useState(sampleTemplates)
  const [isCreating, setIsCreating] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [isSimplifiedCreating, setIsSimplifiedCreating] = useState(false)
  const [showMaxTemplatesWarning, setShowMaxTemplatesWarning] = useState(false)

  const handleSaveTemplate = (template) => {
    if (editingTemplate) {
      // עדכון תבנית קיימת
      setTemplates(templates.map((t) => (t.id === template.id ? template : t)))
      setEditingTemplate(null)
    } else {
      // יצירת תבנית חדשה
      if (templates.length >= 3) {
        setShowMaxTemplatesWarning(true)
        return
      }

      setTemplates([...templates, template])
      setIsCreating(false)
      setIsSimplifiedCreating(false)
    }
  }

  const handleDeleteTemplate = (templateId) => {
    setTemplates(templates.filter((t) => t.id !== templateId))
    setShowMaxTemplatesWarning(false)
  }

  const handleDuplicateTemplate = (template) => {
    if (templates.length >= 3) {
      setShowMaxTemplatesWarning(true)
      return
    }

    const newTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (עותק)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTemplates([...templates, newTemplate])
  }

  return (
    <div className="space-y-6">
      {/* עדכן את הכפתורים בחלק העליון של הגלריה: */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h3 className="text-xl font-semibold">תבניות פוסטים</h3>
            <p className="text-sm text-gray-500">ניתן ליצור עד 3 תבניות</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            חזרה לשאלון
          </Button>
          <Dialog open={isSimplifiedCreating} onOpenChange={setIsSimplifiedCreating}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  if (templates.length >= 3) {
                    setShowMaxTemplatesWarning(true)
                  } else {
                    setIsSimplifiedCreating(true)
                  }
                }}
              >
                <Plus className="h-4 w-4 ml-2" />
                צור תבנית חדשה
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <SimplifiedTemplateCreator
                onSave={handleSaveTemplate}
                onCancel={() => setIsSimplifiedCreating(false)}
                onBack={() => setIsSimplifiedCreating(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showMaxTemplatesWarning && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>הגעת למגבלת התבניות</AlertTitle>
          <AlertDescription>ניתן לשמור עד 3 תבניות. אנא מחק תבנית קיימת לפני יצירת תבנית חדשה.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div
              className={`aspect-[16/9] relative ${template.hasBorder ? "border" : ""}`}
              style={{
                backgroundColor: template.secondaryColor,
                borderColor: template.hasBorder ? template.borderColor : "transparent",
                borderWidth: template.hasBorder ? `${template.borderWidth}px` : 0,
                borderStyle: template.hasBorder ? template.borderStyle : "none",
              }}
            >
              {template.hasLogo && (
                <div
                  className={`absolute p-4 ${
                    template.logoPosition === "top-right"
                      ? "top-0 right-0"
                      : template.logoPosition === "top-left"
                        ? "top-0 left-0"
                        : template.logoPosition === "bottom-right"
                          ? "bottom-0 right-0"
                          : "bottom-0 left-0"
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">לוגו</span>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {template.hasProfileImage && (
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                    <span className="text-xs text-gray-500">תדמית</span>
                  </div>
                )}

                {/* עדכן את תצוגת התבנית בגלריה כדי להציג את הכותרת הקבועה: */}
                <div className="text-center">
                  <h4 className="font-medium mb-1" style={{ color: template.textColor }}>
                    {template.useFixedTitle ? template.fixedTitle : "כותרת לדוגמה"}
                  </h4>
                  <p className="text-xs" style={{ color: template.textColor }}>
                    {template.useFixedTitle && template.fixedSubtitle ? template.fixedSubtitle : "טקסט לדוגמה"}
                  </p>

                  {template.hasButton && (
                    <button
                      className="mt-2 px-2 py-1 rounded-md text-white text-xs"
                      style={{ backgroundColor: template.primaryColor }}
                    >
                      {template.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{template.name}</h4>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSelectTemplate(template)}
                    title="השתמש בתבנית זו"
                    className="hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTemplate(template)}
                        title="ערוך תבנית"
                        className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <SimplifiedTemplateCreator
                        initialTemplate={editingTemplate}
                        onSave={handleSaveTemplate}
                        onCancel={() => setEditingTemplate(null)}
                        onBack={() => setEditingTemplate(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDuplicateTemplate(template)}
                    title="שכפל תבנית"
                    className="hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTemplate(template.id)}
                    title="מחק תבנית"
                    className="hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* עדכון כפתורי הניווט בתחתית הקומפוננטה */}
      {/* מצא את הקוד הקיים בתחתית הקומפוננטה (בערך בשורה 180-190): */}
      {/* <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          חזרה
        </Button>
        <Button
          onClick={onBack}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
        >
          המשך לשאלון
        </Button>
      </div> */}

      {/* החלף אותו בקוד הבא: */}
      <div className="flex justify-between mt-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            ביטול
          </Button>
          <Button variant="outline" onClick={onPreviousQuestion}>
            <ArrowRight className="h-4 w-4 ml-2" />
            חזרה לשאלה הקודמת
          </Button>
        </div>
        <Button
          onClick={onNextQuestion}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
        >
          המשך לשאלה הבאה
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
      </div>
    </div>
  )
}

