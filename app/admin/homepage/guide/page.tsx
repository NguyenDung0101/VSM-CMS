"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MousePointer,
  Edit,
  Eye,
  Save,
  GripVertical,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function HomepageGuide() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Homepage Manager Guide</h1>
              <p className="text-muted-foreground">
                Complete guide to using the VSM Homepage Manager
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/homepage">
                Open Manager
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The VSM Homepage Manager is a powerful visual tool that allows you
              to customize your homepage layout without touching code. It
              provides drag-and-drop functionality, real-time preview, and
              direct file editing capabilities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <GripVertical className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Drag & Drop</h3>
                <p className="text-sm text-muted-foreground">
                  Reorder sections easily
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Live Preview</h3>
                <p className="text-sm text-muted-foreground">
                  See changes instantly
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Save className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Direct Save</h3>
                <p className="text-sm text-muted-foreground">
                  Updates app/page.tsx
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
              Development Mode Only
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              This homepage manager is only available in development mode for
              security reasons. It will automatically be disabled in production
              environments.
            </p>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold">Access the Manager</h4>
                  <p className="text-muted-foreground">
                    Navigate to{" "}
                    <code className="bg-muted px-1 rounded">
                      /admin/homepage
                    </code>{" "}
                    in your browser
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold">Manage Sections</h4>
                  <p className="text-muted-foreground">
                    Use the "Manage Sections" tab to reorder, edit, or remove
                    homepage sections
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold">Preview Changes</h4>
                  <p className="text-muted-foreground">
                    Switch to "Live Preview" tab to see your changes in
                    real-time
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">4</Badge>
                <div>
                  <h4 className="font-semibold">Save Your Work</h4>
                  <p className="text-muted-foreground">
                    Click "Save Changes" to apply your modifications to
                    app/page.tsx
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Section Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Drag sections to reorder them</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Toggle section visibility</span>
              </div>
              <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Edit section content and styling
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Remove sections completely</span>
              </div>
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Add new sections from templates</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                <Badge variant="outline">Hero Section</Badge>
                <Badge variant="outline">About Section</Badge>
                <Badge variant="outline">Events Section</Badge>
                <Badge variant="outline">News Section</Badge>
                <Badge variant="outline">Team Section</Badge>
                <Badge variant="outline">Gallery Section</Badge>
                <Badge variant="outline">CTA Section</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Section Editor Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Content Tab
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Edit titles and descriptions</li>
                  <li>• Configure button text</li>
                  <li>• Toggle features on/off</li>
                  <li>• Modify section content</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="h-4 w-4 bg-primary rounded-sm"></div>
                  Styling Tab
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Change background colors</li>
                  <li>• Adjust layout settings</li>
                  <li>• Add custom CSS classes</li>
                  <li>• Configure display options</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="h-4 w-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-sm"></div>
                  Media Tab
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Update background images</li>
                  <li>• Manage gallery photos</li>
                  <li>• Add additional media</li>
                  <li>• Configure image settings</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold">Preview Before Saving</h4>
                <p className="text-muted-foreground text-sm">
                  Always check the Live Preview tab before saving changes to
                  ensure everything looks correct
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold">Keep Backups</h4>
                <p className="text-muted-foreground text-sm">
                  The system auto-saves to localStorage, but consider keeping
                  manual backups of your page.tsx
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold">Test Responsiveness</h4>
                <p className="text-muted-foreground text-sm">
                  Check how your changes look on different screen sizes in the
                  preview
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold">Use Reset Wisely</h4>
                <p className="text-muted-foreground text-sm">
                  The reset button restores default configuration - use it if
                  you want to start over
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Data */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The homepage manager comes pre-configured with sample data that
              matches your current homepage structure. You can modify any
              section to see how the system works.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Try These Actions:</h4>
              <ul className="text-sm space-y-1">
                <li>1. Drag the "About Section" above the "Hero Section"</li>
                <li>
                  2. Disable the "Gallery Section" and see it disappear from
                  preview
                </li>
                <li>3. Edit the Hero Section title to something custom</li>
                <li>4. Add a new CTA section at the top</li>
                <li>5. Save your changes and check app/page.tsx</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/admin/homepage">
              Start Using Homepage Manager
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
