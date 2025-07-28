"use client";

import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { EventsSection } from "@/components/home/events-section";
import { NewsSection } from "@/components/home/news-section";
import { TeamSection } from "@/components/home/team-section";
import { GallerySection } from "@/components/home/gallery-section";
import { CTASection } from "@/components/home/cta-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";

interface SectionConfig {
  id: string;
  name: string;
  component: string;
  enabled: boolean;
  config: Record<string, any>;
}

interface HomepagePreviewProps {
  sections: SectionConfig[];
}

const COMPONENT_MAP = {
  HeroSection,
  AboutSection,
  EventsSection,
  NewsSection,
  TeamSection,
  GallerySection,
  CTASection,
};

export function HomepagePreview({ sections }: HomepagePreviewProps) {
  const enabledSections = sections.filter((section) => section.enabled);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Live Preview</h2>
        <Badge variant="outline">
          {enabledSections.length} of {sections.length} sections enabled
        </Badge>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 p-4 border-b">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span>Homepage Preview</span>
          </div>
        </div>

        <div className="bg-background">
          {sections.map((section, index) => {
            const Component =
              COMPONENT_MAP[section.component as keyof typeof COMPONENT_MAP];

            if (!Component) {
              return (
                <div key={section.id} className="p-8 bg-muted/20 border-b">
                  <div className="text-center text-muted-foreground">
                    Component {section.component} not found
                  </div>
                </div>
              );
            }

            return (
              <div key={section.id} className="relative group">
                {/* Section overlay for disabled sections */}
                {!section.enabled && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <Card className="bg-card/90 backdrop-blur">
                      <CardContent className="p-4 flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Section Disabled
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Section label */}
                <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge variant="secondary" className="text-xs">
                    {section.name}
                  </Badge>
                </div>

                {/* Render the component */}
                <div className={section.enabled ? "" : "pointer-events-none"}>
                  <Component {...section.config} />
                </div>

                {/* Section border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 transition-colors pointer-events-none" />
              </div>
            );
          })}

          {enabledSections.length === 0 && (
            <div className="p-20 text-center">
              <h3 className="text-lg font-medium mb-2">No sections enabled</h3>
              <p className="text-muted-foreground">
                Enable some sections in the Manage Sections tab to see the
                preview
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Section Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between text-sm"
              >
                <span
                  className={
                    section.enabled ? "" : "text-muted-foreground line-through"
                  }
                >
                  {section.name}
                </span>
                {section.enabled ? (
                  <Eye className="h-3 w-3 text-green-500" />
                ) : (
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Sections:</span>
              <span>{sections.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Enabled:</span>
              <span className="text-green-500">{enabledSections.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Disabled:</span>
              <span className="text-muted-foreground">
                {sections.length - enabledSections.length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Page Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xs text-muted-foreground">Navbar (Fixed)</div>
            {enabledSections.map((section, index) => (
              <div
                key={section.id}
                className="text-xs pl-2 border-l-2 border-muted"
              >
                {index + 1}. {section.name}
              </div>
            ))}
            <div className="text-xs text-muted-foreground">Footer (Fixed)</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
