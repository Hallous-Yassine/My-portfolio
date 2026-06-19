import {
  Award,
  Briefcase,
  Camera,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FolderKanban,
  Github,
  LayoutDashboard,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/admin/components/AdminLayout";
import AdminImagePreview from "@/admin/components/AdminImagePreview";
import { ItemEditor } from "@/admin/components/DynamicField";
import { useCollectionEditor } from "@/admin/hooks/use-collection-editor";
import { getItemListDisplay } from "@/admin/lib/format-item-display";
import type { CollectionKey } from "@/admin/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getAssetPath } from "@/lib/paths";

const ICONS = {
  FolderKanban,
  Briefcase,
  Award,
  Camera,
};

interface CollectionPageProps {
  collectionKey: CollectionKey;
}

export default function CollectionPage({ collectionKey }: CollectionPageProps) {
  const {
    config,
    filteredItems,
    loading,
    saving,
    error,
    search,
    setSearch,
    editingIndex,
    setEditingIndex,
    isDirty,
    load,
    addItem,
    deleteItem,
    moveItem,
    updateItem,
    save,
    discard,
  } = useCollectionEditor(collectionKey);

  const Icon = ICONS[config.icon as keyof typeof ICONS] ?? FolderKanban;
  const editingItem = editingIndex != null ? filteredItems.find(({ index }) => index === editingIndex)?.item : null;

  return (
    <AdminLayout
      title={config.label}
      description={config.description}
      actions={
        <>
          {isDirty && (
            <Badge variant="outline" className="border-amber-500/50 text-amber-400">
              Unsaved changes
            </Badge>
          )}
          <Button variant="outline" size="sm" disabled={!isDirty || saving} onClick={discard}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Discard
          </Button>
          <Button size="sm" disabled={!isDirty || saving} onClick={() => void save()}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Publishing..." : "Publish"}
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <Card className="border-border/60 bg-card/80 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{config.label}</CardTitle>
                <CardDescription>{filteredItems.length} items</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                placeholder={`Search ${config.itemLabel.toLowerCase()}s...`}
                className="pl-9"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add {config.itemLabel}
            </Button>
            <Separator />
            <ScrollArea className="h-[calc(100vh-22rem)] pr-3">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : filteredItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No items found.</p>
              ) : (
                <div className="space-y-2">
                  {filteredItems.map(({ item, index }) => {
                    const display = getItemListDisplay(item, config, index);

                    return (
                      <button
                        key={`${display.id}-${index}`}
                        type="button"
                        onClick={() => setEditingIndex(index)}
                        className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                          editingIndex === index
                            ? "border-primary/60 bg-primary/10"
                            : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {display.thumbnail && (
                            <AdminImagePreview
                              src={display.thumbnail}
                              alt={display.title}
                              thumbnail
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <Badge
                                variant="outline"
                                className="shrink-0 text-[10px] px-1.5 h-5 font-mono"
                              >
                                #{display.id}
                              </Badge>
                              <p className="font-medium leading-snug break-words line-clamp-2 flex-1">
                                {display.title}
                              </p>
                            </div>
                            {display.details.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {display.details.map(({ label, value }) => (
                                  <p
                                    key={label}
                                    className="text-xs leading-relaxed break-words text-muted-foreground"
                                  >
                                    <span className="text-foreground/70">{label}:</span> {value}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                          <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 backdrop-blur min-h-[520px]">
          <CardHeader>
            <CardTitle>
              {editingItem ? `Edit ${config.itemLabel}` : `Select a ${config.itemLabel.toLowerCase()}`}
            </CardTitle>
            <CardDescription>
              {editingItem
                ? "Update fields below, then publish to save to GitHub."
                : "Choose an item from the list or create a new one."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editingIndex == null ? (
              <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border/60 text-center px-6">
                <LayoutDashboard className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Select an item on the left to edit, or add a new {config.itemLabel.toLowerCase()}.
                </p>
              </div>
            ) : editingItem ? (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => moveItem(editingIndex, -1)}>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Move up
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => moveItem(editingIndex, 1)}>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Move down
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this {config.itemLabel.toLowerCase()}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This removes it from your draft. Publish to apply on the live site.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteItem(editingIndex)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {typeof editingItem.image === "string" && editingItem.image && (
                  <AdminImagePreview src={editingItem.image} alt={String(editingItem.title ?? "Preview")} maxHeight={360} />
                )}

                <ItemEditor
                  fields={config.fields}
                  item={editingItem}
                  onChange={(item) => updateItem(editingIndex, item)}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Could not load the selected item.</p>
                <Button variant="outline" onClick={() => void load()}>
                  Retry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export function AdminOverview() {
  return (
    <AdminLayout
      title="Content Manager"
      description="Manage portfolio content with a modern editor. Changes publish directly to GitHub."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { key: "projects", icon: FolderKanban, color: "text-cyan-400" },
          { key: "experiences", icon: Briefcase, color: "text-violet-400" },
          { key: "certifications", icon: Award, color: "text-amber-400" },
          { key: "gallery", icon: Camera, color: "text-emerald-400" },
        ].map(({ key, icon: Icon, color }) => (
          <Link key={key} to={`/admin/${key}`}>
            <Card className="border-border/60 bg-card/80 backdrop-blur hover:border-primary/40 transition-colors h-full">
              <CardHeader>
                <div className={`rounded-lg bg-muted/40 p-2 w-fit ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="capitalize">{key === "gallery" ? "Journey" : key}</CardTitle>
                <CardDescription>
                  {key === "projects" && "Projects, tech stacks, and GitHub links"}
                  {key === "experiences" && "Jobs, internships, and roles"}
                  {key === "certifications" && "Badges and credentials"}
                  {key === "gallery" && "Event photos and gallery posts"}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6 border-border/60 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Quick tips</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3 text-sm text-muted-foreground">
          <div className="rounded-lg border border-border/50 p-4">
            <p className="font-medium text-foreground mb-1">1. Edit locally</p>
            Make changes in any section. Your draft stays in the browser until you publish.
          </div>
          <div className="rounded-lg border border-border/50 p-4">
            <p className="font-medium text-foreground mb-1">2. Publish to GitHub</p>
            Click Publish to commit JSON and images to the repository.
          </div>
          <div className="rounded-lg border border-border/50 p-4">
            <p className="font-medium text-foreground mb-1">3. Wait for deploy</p>
            GitHub Actions rebuilds the site in about 2 minutes after each publish.
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <a href={getAssetPath("/")} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            View live site
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="https://github.com/Hallous-Yassine/My-portfolio" target="_blank" rel="noreferrer">
            <Github className="h-4 w-4 mr-2" />
            Open repository
          </a>
        </Button>
      </div>
    </AdminLayout>
  );
}
