"use client";

import { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GripVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Bug,
} from "lucide-react";
import { HomepagePreview } from "@/components/admin/homepage-preview";
import { SectionEditor } from "@/components/admin/section-editor";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { homepageAPI, HomepageSection } from "@/lib/homepage-api";

const AVAILABLE_SECTIONS = [
  { id: "hero", name: "Hero Section", component: "HeroSection" },
  { id: "about", name: "About Section", component: "AboutSection" },
  { id: "events", name: "Events Section", component: "EventsSection" },
  { id: "news", name: "News Section", component: "NewsSection" },
  { id: "team", name: "Team Section", component: "TeamSection" },
  { id: "gallery", name: "Gallery Section", component: "GallerySection" },
  { id: "cta", name: "CTA Section", component: "CTASection" },
];

export default function HomepageManagerPage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("manage");
  const [hasChanges, setHasChanges] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewSections, setPreviewSections] = useState<HomepageSection[]>([]);
  const [showCodePreview, setShowCodePreview] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setIsLoading(true);
      const data = await homepageAPI.getAllSections();
      setSections(data);
      setPreviewSections(data); // Initialize preview sections
    } catch (error: any) {
      console.error("Failed to load sections:", error);
      toast.error("Failed to load sections");

      // If no sections found, try to initialize default sections
      if (
        error.message?.includes("404") ||
        error.message?.includes("Failed to fetch")
      ) {
        try {
          await homepageAPI.initializeDefaultSections();
          const data = await homepageAPI.getAllSections();
          setSections(data);
          setPreviewSections(data);
          toast.success("Default sections initialized");
        } catch (initError) {
          console.error("Failed to initialize default sections:", initError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async (newSections: HomepageSection[]) => {
    try {
      const reorderData = newSections.map((section, index) => ({
        id: section.id,
        order: index,
      }));

      await homepageAPI.reorderSections(reorderData);
      setSections(newSections);
      setPreviewSections(newSections);
      setHasChanges(true);
      toast.success("Sections reordered");
    } catch (error) {
      console.error("Failed to reorder sections:", error);
      toast.error("Failed to reorder sections");
    }
  };

  const toggleSection = async (id: string) => {
    try {
      const section = sections.find((s) => s.id === id);
      if (!section) return;

      await homepageAPI.toggleSection(id, !section.enabled);
      const updatedSections = sections.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      );
      setSections(updatedSections);
      setPreviewSections(updatedSections);
      setHasChanges(true);
      toast.success("Section visibility updated");
    } catch (error) {
      console.error("Failed to toggle section:", error);
      toast.error("Failed to update section visibility");
    }
  };

  const addSection = async (sectionType: string) => {
    try {
      const template = AVAILABLE_SECTIONS.find((s) => s.id === sectionType);
      if (!template) return;

      const newSection = await homepageAPI.addSectionFromTemplate(template);
      const updatedSections = [...sections, newSection];
      setSections(updatedSections);
      setPreviewSections(updatedSections);
      setHasChanges(true);
      toast.success("Section added");
    } catch (error) {
      console.error("Failed to add section:", error);
      toast.error("Failed to add section");
    }
  };

  const removeSection = async (id: string) => {
    try {
      await homepageAPI.deleteSection(id);
      const updatedSections = sections.filter((section) => section.id !== id);
      setSections(updatedSections);
      setPreviewSections(updatedSections);
      setHasChanges(true);
      toast.success("Section removed");
    } catch (error) {
      console.error("Failed to remove section:", error);
      toast.error("Failed to remove section");
    }
  };

  const updateSection = async (id: string, config: Record<string, any>) => {
    try {
      // Update local state immediately for live preview
      const updatedSections = sections.map((section) =>
        section.id === id ? { ...section, config } : section
      );
      setSections(updatedSections);
      setPreviewSections(updatedSections);
      setHasChanges(true);
      setEditingSection(null);

      // Save to backend
      await homepageAPI.updateSection(id, { config });
      toast.success("Section updated");
    } catch (error) {
      console.error("Failed to update section:", error);
      toast.error("Failed to update section");
      // Revert local state if save failed
      loadSections();
    }
  };

  const handleConfigChange = (id: string, config: Record<string, any>) => {
    // Update preview sections for live preview while editing
    const updatedSections = sections.map((section) =>
      section.id === id ? { ...section, config } : section
    );
    setPreviewSections(updatedSections);
  };

  const saveToFile = async () => {
    try {
      setIsSaving(true);
      const fileContent = homepageAPI.generateHomepageContent(sections);
      console.log("Generated content:", fileContent);

      const result = await homepageAPI.saveHomepage({
        content: fileContent,
        filePath: "app/page.tsx",
      });

      if (result.success) {
        setHasChanges(false);
        toast.success(result.message, {
          description:
            "The homepage has been updated. The page will reload in 3 seconds to show the changes.",
          duration: 5000,
        });

        // Reload the page to show updated content
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        throw new Error("Failed to save");
      }
    } catch (error: any) {
      console.error("Failed to save homepage:", error);
      toast.error("Failed to save homepage", {
        description: error.message || "Check console for details",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = async () => {
    try {
      await homepageAPI.resetToDefault();
      await loadSections();
      setHasChanges(true);
      toast.success("Reset to default configuration");
    } catch (error) {
      console.error("Failed to reset to default:", error);
      toast.error("Failed to reset to default");
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            isCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <div className="min-h-screen bg-background">
            <div className="border-b bg-card px-[65px]">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Homepage Manager</h1>
                    <p className="text-muted-foreground">
                      Manage your homepage sections with drag-and-drop
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {hasChanges && (
                      <Badge variant="secondary" className="mr-2 animate-pulse">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          {sections.filter((s) => s.enabled).length} sections
                          ready to save
                        </span>
                      </Badge>
                    )}
                    <Button variant="outline" onClick={resetToDefault}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCodePreview(!showCodePreview)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Code
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          const result = await homepageAPI.testSave();
                          if (result.success) {
                            toast.success(`Test file saved: ${result.path}`);
                          }
                        } catch (error) {
                          toast.error("Test save failed");
                          console.error("Test save error:", error);
                        }
                      }}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Test Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          const debug = await homepageAPI.debugPaths();
                          console.log("Debug paths:", debug);
                          toast.success("Debug info logged to console");
                        } catch (error) {
                          toast.error("Debug failed");
                          console.error("Debug error:", error);
                        }
                      }}
                    >
                      <Bug className="h-4 w-4 mr-2" />
                      Debug Paths
                    </Button>
                    <Button
                      onClick={saveToFile}
                      disabled={!hasChanges || isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="container mx-auto pl-20 pr-4 py-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manage">Manage Sections</TabsTrigger>
                  <TabsTrigger value="preview">
                    Live Preview
                    {hasChanges && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Live
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manage" className="space-y-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading sections...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-semibold">
                            Current Sections
                          </h2>
                          <div className="text-sm text-muted-foreground">
                            Drag to reorder • Click to edit
                          </div>
                        </div>

                        <Reorder.Group
                          axis="y"
                          values={sections}
                          onReorder={handleReorder}
                          className="space-y-3"
                        >
                          {sections.map((section) => (
                            <Reorder.Item
                              key={section.id}
                              value={section}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <Card
                                className={`${
                                  section.enabled ? "bg-card" : "bg-muted/50"
                                } hover:shadow-md transition-shadow`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-medium">
                                          {section.name}
                                        </h3>
                                        <Badge
                                          variant={
                                            section.enabled
                                              ? "default"
                                              : "secondary"
                                          }
                                        >
                                          {section.enabled
                                            ? "Enabled"
                                            : "Disabled"}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {section.component}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          toggleSection(section.id)
                                        }
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          setEditingSection(section)
                                        }
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          removeSection(section.id)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Add Section</h2>
                        <div className="space-y-2">
                          {AVAILABLE_SECTIONS.map((section) => (
                            <Button
                              key={section.id}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => addSection(section.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              {section.name}
                            </Button>
                          ))}
                        </div>

                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                          <h3 className="font-medium mb-2">Usage Guide</h3>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Drag sections to reorder</li>
                            <li>• Toggle visibility with eye icon</li>
                            <li>• Edit content with edit icon</li>
                            <li>• Remove sections with trash icon</li>
                            <li>• Preview changes in Live Preview tab</li>
                            <li>• Save changes to update app/page.tsx</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="preview">
                  <HomepagePreview sections={previewSections} />

                  {showCodePreview && (
                    <div className="mt-8 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Sections to be saved:
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {sections
                            .filter((s) => s.enabled)
                            .sort((a, b) => a.order - b.order)
                            .map((section) => (
                              <Card key={section.id} className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">
                                    {section.order + 1}
                                  </Badge>
                                  <h4 className="font-medium">
                                    {section.name}
                                  </h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {section.component}
                                </p>
                                {Object.keys(section.config || {}).length >
                                  0 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-muted-foreground">
                                      Config:{" "}
                                      {Object.keys(section.config || {}).join(
                                        ", "
                                      )}
                                    </p>
                                  </div>
                                )}
                              </Card>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Generated Code Preview:
                        </h3>
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="text-sm overflow-x-auto">
                            <code>
                              {homepageAPI.generateHomepageContent(sections)}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {editingSection && (
              <SectionEditor
                section={editingSection}
                onSave={(config) => updateSection(editingSection.id, config)}
                onClose={() => setEditingSection(null)}
                onConfigChange={(config) =>
                  handleConfigChange(editingSection.id, config)
                }
              />
            )}
            <Toaster richColors position="top-right" />
          </div>
        </main>
      </div>
    </div>
  );
}
