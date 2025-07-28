"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Trash2, Image, Type, Palette } from "lucide-react";

interface SectionConfig {
  id: string;
  name: string;
  component: string;
  enabled: boolean;
  config: Record<string, any>;
}

interface SectionEditorProps {
  section: SectionConfig;
  onSave: (config: Record<string, any>) => void;
  onClose: () => void;
  onConfigChange?: (config: Record<string, any>) => void; // For live preview
}

// Section-specific configuration templates
const SECTION_TEMPLATES = {
  HeroSection: {
    title: {
      type: "text",
      label: "Main Title",
      default: "Vietnam Student Marathon",
    },
    subtitle: {
      type: "text",
      label: "Subtitle",
      default: "Chạy chung kết Việt tương lai 2025",
    },
    backgroundImage: {
      type: "text",
      label: "Background Image URL",
      default: "/img/image1.jpg",
    },
    primaryButtonText: {
      type: "text",
      label: "Primary Button Text",
      default: "Tham gia sự kiện",
    },
    secondaryButtonText: {
      type: "text",
      label: "Secondary Button Text",
      default: "Xem video",
    },
    showAnimations: {
      type: "boolean",
      label: "Show Animations",
      default: true,
    },
  },
  AboutSection: {
    title: { type: "text", label: "Section Title", default: "Về VSM" },
    description: {
      type: "textarea",
      label: "Description",
      default:
        "Vietnam Student Marathon (VSM) là tổ chức phi lợi nhuận hàng đầu trong việc phát triển phong trào chạy bộ trong cộng đồng sinh viên Việt Nam.",
    },
    backgroundColor: {
      type: "text",
      label: "Background Color",
      default: "bg-gradient-to-b from-background to-muted/20",
    },
  },
  EventsSection: {
    title: { type: "text", label: "Section Title", default: "Sự kiện sắp tới" },
    description: {
      type: "textarea",
      label: "Description",
      default:
        "Tham gia các sự kiện chạy bộ hấp dẫn được tổ chức bởi VSM. Cùng nhau tạo nên những kỷ niệm đáng nhớ!",
    },
    backgroundColor: {
      type: "text",
      label: "Background Color",
      default: "bg-muted/20",
    },
    showViewAllButton: {
      type: "boolean",
      label: "Show 'View All' Button",
      default: true,
    },
  },
  NewsSection: {
    title: {
      type: "text",
      label: "Section Title",
      default: "Tin tức mới nhất",
    },
    description: {
      type: "textarea",
      label: "Description",
      default: "Cập nhật kiến thức và hoạt động mới nhất từ cộng đồng VSM.",
    },
    postsPerRow: {
      type: "number",
      label: "Posts Per Row",
      default: 3,
      min: 1,
      max: 4,
    },
    showViewAllButton: {
      type: "boolean",
      label: "Show 'View All' Button",
      default: true,
    },
  },
  TeamSection: {
    title: { type: "text", label: "Section Title", default: "Đội ngũ VSM" },
    description: {
      type: "textarea",
      label: "Description",
      default: "Gặp gỡ những gương mặt tiêu biểu đồng hành cùng chúng tôi.",
    },
    backgroundColor: {
      type: "text",
      label: "Background Color",
      default: "bg-muted/20",
    },
    membersPerRow: {
      type: "number",
      label: "Members Per Row",
      default: 4,
      min: 2,
      max: 6,
    },
  },
  GallerySection: {
    title: {
      type: "text",
      label: "Section Title",
      default: "Khoảnh khắc đáng nhớ",
    },
    autoPlay: { type: "boolean", label: "Auto Play Slideshow", default: false },
    showControls: {
      type: "boolean",
      label: "Show Navigation Controls",
      default: true,
    },
  },
  CTASection: {
    title: {
      type: "text",
      label: "Section Title",
      default: "Sẵn sàng bứt phá?",
    },
    description: {
      type: "textarea",
      label: "Description",
      default:
        "Đăng ký ngay để tham gia sự kiện chạy bộ cùng cộng đồng sinh viên trên toàn quốc!",
    },
    buttonText: { type: "text", label: "Button Text", default: "Đăng ký ngay" },
    backgroundColor: {
      type: "text",
      label: "Background Color",
      default: "bg-gradient-to-r from-primary/20 to-purple-500/20",
    },
  },
};

export function SectionEditor({
  section,
  onSave,
  onClose,
  onConfigChange,
}: SectionEditorProps) {
  const [config, setConfig] = useState(section.config || {});
  const [activeTab, setActiveTab] = useState("content");

  const template =
    SECTION_TEMPLATES[section.component as keyof typeof SECTION_TEMPLATES] ||
    {};

  useEffect(() => {
    // Initialize config with default values if not set
    const initialConfig = { ...config };
    Object.entries(template).forEach(([key, field]) => {
      if (!(key in initialConfig)) {
        initialConfig[key] = field.default;
      }
    });
    setConfig(initialConfig);
  }, [section.component]);

  const handleSave = () => {
    onSave(config);
  };

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    // Trigger live preview update
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  };

  const renderField = (key: string, field: any) => {
    const value = config[key] ?? field.default;

    switch (field.type) {
      case "text":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{field.label}</Label>
            <Input
              id={key}
              value={value || ""}
              onChange={(e) => updateConfig(key, e.target.value)}
              placeholder={field.default}
            />
          </div>
        );

      case "textarea":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{field.label}</Label>
            <Textarea
              id={key}
              value={value || ""}
              onChange={(e) => updateConfig(key, e.target.value)}
              placeholder={field.default}
              rows={3}
            />
          </div>
        );

      case "boolean":
        return (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key}>{field.label}</Label>
            <Switch
              id={key}
              checked={value || false}
              onCheckedChange={(checked) => updateConfig(key, checked)}
            />
          </div>
        );

      case "number":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{field.label}</Label>
            <Input
              id={key}
              type="number"
              value={value || field.default}
              onChange={(e) => updateConfig(key, parseInt(e.target.value))}
              min={field.min}
              max={field.max}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Edit {section.name}</span>
            <Badge variant="outline">{section.component}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="styling" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Styling
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(template)
                  .filter(
                    ([key, field]) =>
                      field.type === "text" ||
                      field.type === "textarea" ||
                      field.type === "boolean"
                  )
                  .map(([key, field]) => renderField(key, field))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="styling" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Styling Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(template)
                  .filter(
                    ([key, field]) =>
                      key.includes("background") ||
                      key.includes("color") ||
                      field.type === "number"
                  )
                  .map(([key, field]) => renderField(key, field))}

                <Separator />

                <div className="space-y-2">
                  <Label>Custom CSS Classes</Label>
                  <Input
                    value={config.customClasses || ""}
                    onChange={(e) =>
                      updateConfig("customClasses", e.target.value)
                    }
                    placeholder="Enter custom CSS classes"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add custom Tailwind CSS classes for additional styling
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Media Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(template)
                  .filter(
                    ([key, field]) =>
                      key.includes("image") ||
                      key.includes("Image") ||
                      key.includes("media")
                  )
                  .map(([key, field]) => renderField(key, field))}

                <Separator />

                <div className="space-y-2">
                  <Label>Additional Images</Label>
                  <div className="space-y-2">
                    {(config.additionalImages || []).map(
                      (image: string, index: number) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={image}
                            onChange={(e) => {
                              const images = [
                                ...(config.additionalImages || []),
                              ];
                              images[index] = e.target.value;
                              updateConfig("additionalImages", images);
                            }}
                            placeholder="Image URL"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const images = [
                                ...(config.additionalImages || []),
                              ];
                              images.splice(index, 1);
                              updateConfig("additionalImages", images);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const images = [...(config.additionalImages || []), ""];
                        updateConfig("additionalImages", images);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
