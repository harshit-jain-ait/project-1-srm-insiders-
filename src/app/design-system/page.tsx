"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { SearchInput } from "@/components/ui/search-input";
import { FileUpload } from "@/components/ui/file-upload";
import { FormLabel, FormHelperText, FormErrorMessage } from "@/components/ui/form-field";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Tooltip } from "@/components/ui/tooltip";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DisplayHeading,
  PageHeading,
  SectionHeading,
  CardHeading,
  Text,
  MutedText,
  Caption,
  CodeText,
} from "@/components/ui/typography";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  Trash2,
  Settings,
  FolderCode,
} from "lucide-react";

export default function DesignSystemPage() {
  const [searchValue, setSearchValue] = useState("");
  const [switchChecked, setSwitchChecked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-[#101114] text-[#F7F7F5] selection:bg-blue-600/30 selection:text-white font-sans">
      {/* Top Header */}
      <header className="border-b border-[#303238] bg-[#191B20]/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Portfolify Home
            </Link>
            <div className="h-4 w-px bg-zinc-800" />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Design System Showcase
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="blue">WCAG 2.2 AA</Badge>
            <Badge variant="outline">Strict Zero-Purple</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Title & Introduction */}
        <section className="space-y-4">
          <Breadcrumb
            items={[
              { label: "Portfolify", href: "/" },
              { label: "Engineering Docs", href: "/docs" },
              { label: "Design System Standards" },
            ]}
          />
          <DisplayHeading>Design Tokens & Component Standards</DisplayHeading>
          <Text className="text-zinc-400 max-w-2xl text-base">
            Centralized design system engineered for Portfolify. Built with cohesive semantic tokens, accessible ARIA roles, predictable component sizing, and zero decorative gradients.
          </Text>
        </section>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-6 pt-6 border-t border-[#303238]" id="colors">
          <div>
            <SectionHeading>1. Semantic Color Tokens</SectionHeading>
            <MutedText>Harmonious charcoal, near-black, off-white, and restrained blue accents.</MutedText>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: "Near-Black", hex: "#101114", token: "--background", bg: "bg-[#101114]" },
              { name: "Charcoal", hex: "#191B20", token: "--surface", bg: "bg-[#191B20]" },
              { name: "Elevated", hex: "#22242B", token: "--surface-elevated", bg: "bg-[#22242B]" },
              { name: "Dark Border", hex: "#303238", token: "--border", bg: "bg-[#303238]" },
              { name: "Brand Blue", hex: "#356AE6", token: "--brand-blue", bg: "bg-[#356ae6]" },
              { name: "Off-White", hex: "#F7F7F5", token: "--foreground", bg: "bg-[#F7F7F5] text-zinc-900" },
            ].map((col) => (
              <div key={col.name} className="rounded-lg border border-[#303238] bg-[#191B20]/40 p-3 space-y-2">
                <div className={`h-12 w-full rounded border border-zinc-700/50 ${col.bg} flex items-center justify-center font-mono text-xs`} />
                <div>
                  <p className="text-xs font-semibold text-white">{col.name}</p>
                  <p className="text-[11px] font-mono text-zinc-400">{col.hex}</p>
                  <p className="text-[10px] font-mono text-zinc-500">{col.token}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="space-y-6 pt-6 border-t border-[#303238]" id="typography">
          <div>
            <SectionHeading>2. Typography Scale</SectionHeading>
            <MutedText>Semantic headings, body text, and technical metadata components.</MutedText>
          </div>

          <div className="space-y-4 p-6 rounded-xl border border-[#303238] bg-[#191B20]/30">
            <div className="pb-4 border-b border-zinc-800">
              <Caption className="block mb-1">Display Heading</Caption>
              <DisplayHeading className="text-3xl sm:text-4xl">Executive Portfolio Platform</DisplayHeading>
            </div>
            <div className="pb-4 border-b border-zinc-800">
              <Caption className="block mb-1">Page Heading</Caption>
              <PageHeading>Curated Template Gallery</PageHeading>
            </div>
            <div className="pb-4 border-b border-zinc-800">
              <Caption className="block mb-1">Section Heading</Caption>
              <SectionHeading>Engineered Capabilities & Layout Standards</SectionHeading>
            </div>
            <div className="pb-4 border-b border-zinc-800">
              <Caption className="block mb-1">Card Heading</Caption>
              <CardHeading>Minimal Portfolio Layout</CardHeading>
            </div>
            <div className="pb-4 border-b border-zinc-800">
              <Caption className="block mb-1">Body Text</Caption>
              <Text className="max-w-xl">
                Portfolify transforms verified engineering career histories, architecture case studies, and skills into polished websites without visual clutter.
              </Text>
            </div>
            <div>
              <Caption className="block mb-1">Code & Metadata</Caption>
              <CodeText>export type PortfolioData = z.infer&lt;typeof PortfolioDataSchema&gt;;</CodeText>
            </div>
          </div>
        </section>

        {/* 3. Button Design System */}
        <section className="space-y-6 pt-6 border-t border-[#303238]" id="buttons">
          <div>
            <SectionHeading>3. Button Suite & Interaction States</SectionHeading>
            <MutedText>All variants support default, hover, active, focus-visible, disabled, and loading states.</MutedText>
          </div>

          <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/30 space-y-6">
            <div className="space-y-3">
              <Caption className="block">Variants (Medium Size)</Caption>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="default">Default / Primary</Button>
                <Button variant="brand">Brand Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link Style</Button>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <Caption className="block">Sizes (Small, Default, Large, Icon)</Caption>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="brand" size="sm">Small (32px)</Button>
                <Button variant="brand" size="default">Default / Medium (36px)</Button>
                <Button variant="brand" size="lg">Large (44px)</Button>
                <Button variant="outline" size="icon" aria-label="Settings">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <Caption className="block">States (Disabled & Loading without layout shift)</Caption>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="brand" disabled>Disabled State</Button>
                <Button variant="brand" isLoading>Saving Changes...</Button>
                <Button variant="outline" isLoading>Processing...</Button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Form Primitives */}
        <section className="space-y-6 pt-6 border-t border-[#303238]" id="forms">
          <div>
            <SectionHeading>4. Form Components & Validation</SectionHeading>
            <MutedText>Input fields with focus states, error states, and accessible ARIA attributes.</MutedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl border border-[#303238] bg-[#191B20]/30">
            <div className="space-y-4">
              <div>
                <FormLabel required>Standard Input Field</FormLabel>
                <Input placeholder="Enter your full legal name" />
                <FormHelperText>This name will appear on published portfolio meta tags.</FormHelperText>
              </div>

              <div>
                <FormLabel required>Input with Validation Error</FormLabel>
                <Input defaultValue="invalid-email-address" hasError />
                <FormErrorMessage message="Please enter a valid email address (e.g. name@domain.com)" />
              </div>

              <div>
                <FormLabel>Search Field</FormLabel>
                <SearchInput
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClear={() => setSearchValue("")}
                  placeholder="Search templates, projects, or skills..."
                />
              </div>

              <div>
                <FormLabel>Select Dropdown</FormLabel>
                <Select defaultValue="minimal-portfolio">
                  <option value="minimal-portfolio">Minimal Portfolio (Editorial)</option>
                  <option value="developer-pro">Developer Pro (Technical)</option>
                </Select>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <FormLabel>Textarea Component</FormLabel>
                <Textarea placeholder="Executive summary or professional biography..." rows={3} />
              </div>

              <div className="space-y-3 pt-2">
                <Checkbox
                  label="Publish portfolio immediately"
                  description="Make this portfolio accessible to search engines and public visitors."
                  defaultChecked
                />
                <Checkbox
                  label="Enable case study deep dive"
                  description="Include problem statements, architecture decisions, and measured outcomes."
                />
              </div>

              <div className="pt-2">
                <Switch
                  checked={switchChecked}
                  onCheckedChange={setSwitchChecked}
                  label="Reduced motion mode"
                  description="Disable smooth transitions and animations for enhanced accessibility."
                />
              </div>

              <div>
                <FormLabel>File Upload Zone</FormLabel>
                <FileUpload
                  selectedFile={uploadedFile}
                  onFileSelect={(file) => setUploadedFile(file)}
                  onFileClear={() => setUploadedFile(null)}
                  label="Upload resume or portfolio asset"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Cards & Panels */}
        <section className="space-y-6 pt-6 border-t border-[#303238]" id="cards">
          <div>
            <SectionHeading>5. Cards, Panels & Elevated Surfaces</SectionHeading>
            <MutedText>Reusable surface patterns with subtle borders, background contrast, and clear hierarchy.</MutedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#191B20]/60 border-[#303238]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="blue">Editorial</Badge>
                  <Caption>Template ID: minimal-portfolio</Caption>
                </div>
                <CardTitle className="text-white mt-2">Minimal Portfolio</CardTitle>
                <CardDescription>Typography-focused editorial layout for distinguished practitioners.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Consumes the canonical data model. Omits empty sections gracefully with zero placeholder artifacts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#191B20]/60 border-[#303238]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="success">Engineering</Badge>
                  <Caption>Template ID: developer-pro</Caption>
                </div>
                <CardTitle className="text-white mt-2">Developer Pro</CardTitle>
                <CardDescription>Structured technical portfolio using charcoal surfaces and restrained blue accents.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Includes terminal status badges, repository links, and dedicated architecture case-study grids.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 6. Navigation, Tabs & Menus */}
        <section className="space-y-6 pt-6 border-t border-[#303238]" id="navigation">
          <div>
            <SectionHeading>6. Navigation, Tabs & Dropdowns</SectionHeading>
            <MutedText>WAI-ARIA accessible tab lists, dropdown menus, and breadcrumb trails.</MutedText>
          </div>

          <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/30 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <Tabs defaultValue="editor" className="max-w-md">
                <TabsList>
                  <TabsTrigger value="editor">Studio Editor</TabsTrigger>
                  <TabsTrigger value="preview">Live Preview</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="p-3 bg-zinc-950/40 rounded border border-zinc-800 text-xs text-zinc-300">
                  Studio active: Side-by-side editing canvas enabled.
                </TabsContent>
                <TabsContent value="preview" className="p-3 bg-zinc-950/40 rounded border border-zinc-800 text-xs text-zinc-300">
                  Live preview active: Synchronized with canonical schema.
                </TabsContent>
                <TabsContent value="settings" className="p-3 bg-zinc-950/40 rounded border border-zinc-800 text-xs text-zinc-300">
                  Settings active: Domain, slug, and SEO configurations.
                </TabsContent>
              </Tabs>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    Actions Menu <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => alert("Action: Export Portfolio")}>
                    <Download className="w-3.5 h-3.5" /> Export Portfolio (JSON)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert("Action: Open Settings")}>
                    <Settings className="w-3.5 h-3.5" /> Portfolio Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive onClick={() => alert("Action: Delete Draft")}>
                    <Trash2 className="w-3.5 h-3.5" /> Delete Draft
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>

        {/* 6. Overlays (Dialog, Drawer, Tooltip) */}
        <section className="space-y-6 pt-6 border-t border-[#303238]" id="overlays">
          <div>
            <SectionHeading>6. Overlays (Dialog, Drawer & Tooltip)</SectionHeading>
            <MutedText>Accessible modals with backdrop blur, keyboard traps, and Escape key dismissal.</MutedText>
          </div>

          <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/30 flex flex-wrap items-center gap-4">
            <Button variant="brand" onClick={() => setIsDialogOpen(true)}>
              Open Accessible Dialog
            </Button>

            <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
              Open Side Drawer
            </Button>

            <Tooltip content="Live preview frame resolution: 1440x900">
              <Button variant="outline">Hover for Tooltip</Button>
            </Tooltip>

            {/* Dialog Instance */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogHeader>
                <DialogTitle>Confirm Portfolio Publication</DialogTitle>
                <DialogDescription>
                  Publishing makes your portfolio publicly reachable at your unique slug. You can unpublish or modify the slug at any time.
                </DialogDescription>
              </DialogHeader>
              <div className="py-2 text-xs text-zinc-300 space-y-2">
                <p>Public URL will be generated based on your canonical slug.</p>
                <p className="font-mono text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800">
                  https://portfolify.dev/p/your-slug
                </p>
              </div>
              <DialogFooter>
                <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="brand" size="sm" onClick={() => setIsDialogOpen(false)}>
                  Confirm & Publish
                </Button>
              </DialogFooter>
            </Dialog>

            {/* Drawer Instance */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerHeader>
                <DrawerTitle>Section Configurations</DrawerTitle>
                <DrawerDescription>
                  Toggle and arrange the sections included in your live portfolio.
                </DrawerDescription>
              </DrawerHeader>
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="p-3 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-between">
                  <span>Profile & Biography</span>
                  <Badge variant="blue">Always Visible</Badge>
                </div>
                <div className="p-3 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-between">
                  <span>Projects & Case Studies</span>
                  <Badge variant="success">Visible (2 items)</Badge>
                </div>
                <div className="p-3 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-between">
                  <span>Work Experience</span>
                  <Badge variant="outline">Optional</Badge>
                </div>
              </div>
              <DrawerFooter>
                <Button variant="outline" size="sm" onClick={() => setIsDrawerOpen(false)}>
                  Close
                </Button>
              </DrawerFooter>
            </Drawer>
          </div>
        </section>

        {/* 7. Status Alerts & Skeletons */}
        <section className="space-y-6 pt-6 border-t border-[#303238]" id="status">
          <div>
            <SectionHeading>7. Feedback Alerts, Skeletons & Empty States</SectionHeading>
            <MutedText>Truthful application states without fake metrics or artificial success states.</MutedText>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Alert variant="info" title="Configuration Required">
                Configure your <CodeText>GEMINI_API_KEY</CodeText> in <CodeText>.env.local</CodeText> to activate real server-side AI extraction.
              </Alert>

              <Alert variant="success" title="Persistence Verified">
                Portfolio draft saved to server repository with timestamp and slug reservation.
              </Alert>

              <Alert variant="warning" title="Unpublished Draft">
                This portfolio is currently private. Public visitors will see an honest unpublished screen.
              </Alert>

              <Alert variant="error" title="Validation Failed">
                Slug contains illegal characters. Slugs may only contain lowercase letters, numbers, and hyphens.
              </Alert>
            </div>

            <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/30 space-y-4">
              <Caption className="block">Loading Skeletons (For genuine async pending states)</Caption>
              <div className="space-y-2 max-w-md">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>

            <EmptyState
              icon={FolderCode}
              title="No case studies created"
              description="Add your first architecture or product case study to showcase your engineering decisions."
              actionLabel="Add Case Study"
              onAction={() => alert("Action: Add Case Study")}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
