import { apiClient } from './api';

export interface HomepageSection {
  id: string;
  name: string;
  component: string;
  enabled: boolean;
  config: Record<string, any>;
  order: number;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateHomepageSectionDto {
  name: string;
  component: string;
  enabled: boolean;
  config: Record<string, any>;
  order: number;
  authorId?: string;
}

export interface UpdateHomepageSectionDto {
  name?: string;
  component?: string;
  enabled?: boolean;
  config?: Record<string, any>;
  order?: number;
}

export interface SectionOrder {
  id: string;
  order: number;
}

export interface SaveHomepageDto {
  content: string;
  filePath?: string;
  enabledSectionIds?: string[];
}

export class HomepageAPI {
  private static baseUrl = '/homepage-sections';

  static async testConnection(): Promise<boolean> {
    try {
      console.log('Testing API connection to:', apiClient.baseURL);
      const response = await apiClient.request('/homepage-sections');
      console.log('Test response:', response);
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  static async getAllSections(enabled?: boolean, orderBy?: 'order' | 'name' | 'createdAt'): Promise<HomepageSection[]> {
    try {
      const params = new URLSearchParams();
      if (enabled !== undefined) params.append('enabled', enabled.toString());
      if (orderBy) params.append('orderBy', orderBy);
      
      const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl;
      console.log('Fetching sections from:', url);
      const response = await apiClient.request(url);
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      throw error;
    }
  }

  static async getEnabledSections(): Promise<HomepageSection[]> {
    return apiClient.request(`${this.baseUrl}/enabled/sections`);
  }

  static async getSectionById(id: string): Promise<HomepageSection> {
    return apiClient.request(`${this.baseUrl}/${id}`);
  }

  static async createSection(section: CreateHomepageSectionDto): Promise<HomepageSection> {
    return apiClient.request(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(section)
    });
  }

  static async updateSection(id: string, section: UpdateHomepageSectionDto): Promise<HomepageSection> {
    return apiClient.request(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(section)
    });
  }

  static async deleteSection(id: string): Promise<HomepageSection> {
    return apiClient.request(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    });
  }

  static async reorderSections(sections: SectionOrder[]): Promise<void> {
    return apiClient.request(`${this.baseUrl}/reorder`, {
      method: 'POST',
      body: JSON.stringify({ sections })
    });
  }

  static async saveHomepage(data: SaveHomepageDto): Promise<{ success: boolean; message: string }> {
    return apiClient.request(`${this.baseUrl}/save-homepage`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async toggleSection(id: string, enabled: boolean): Promise<HomepageSection> {
    return this.updateSection(id, { enabled });
  }

  static async addSectionFromTemplate(template: {
    id: string;
    name: string;
    component: string;
  }): Promise<HomepageSection> {
    const sections = await this.getAllSections();
    const maxOrder = Math.max(...sections.map(s => s.order), -1);
    
    return this.createSection({
      name: template.name,
      component: template.component,
      enabled: true,
      config: {},
      order: maxOrder + 1
    });
  }

  static async resetToDefault(): Promise<void> {
    const sections = await this.getAllSections();
    await Promise.all(sections.map(section => this.deleteSection(section.id)));
    
    const defaultSections = [
      { id: "hero", name: "Hero Section", component: "HeroSection" },
      { id: "about", name: "About Section", component: "AboutSection" },
      { id: "events", name: "Events Section", component: "EventsSection" },
      { id: "news", name: "News Section", component: "NewsSection" },
      { id: "team", name: "Team Section", component: "TeamSection" },
      { id: "gallery", name: "Gallery Section", component: "GallerySection" },
      { id: "cta", name: "CTA Section", component: "CTASection" },
    ];

    for (let i = 0; i < defaultSections.length; i++) {
      const template = defaultSections[i];
      await this.createSection({
        name: template.name,
        component: template.component,
        enabled: true,
        config: {},
        order: i
      });
    }
  }

  static async initializeDefaultSections(): Promise<{ message: string }> {
    return apiClient.request(`${this.baseUrl}/initialize`, {
      method: 'POST'
    });
  }

  static generateHomepageContent(sections: HomepageSection[]): string {
    const enabledSections = sections
      .filter(s => s.enabled)
      .sort((a, b) => a.order - b.order);

    const imports = enabledSections
      .map(section => 
        `import { ${section.component} } from "@/components/home/${section.component
          .toLowerCase()
          .replace("section", "-section")}"`
      )
      .join("\n");

    const sectionComponents = enabledSections
      .map(section => `        <${section.component} />`)
      .join("\n");

    return `import { Navbar } from "@/components/layout/navbar"
${imports}
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
${sectionComponents}
      </main>
      <Footer />
    </div>
  )
}`;
  }
}

export const homepageAPI = HomepageAPI;