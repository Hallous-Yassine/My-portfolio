import { useState, useEffect } from "react";
import { Calendar, MapPin, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAssetPath } from "@/lib/paths";

interface Post {
  id: number;
  image: string;
  title: string;
  location: string;
  date: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  year: number;
  category: string;
  album: string;
  albumImages: string[];
}

const Journey = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");

  useEffect(() => {
    fetch(getAssetPath("/data/gallery.json"))
      .then((res) => res.json())
      .then((data) => setPosts(data.posts))
      .catch((err) => console.error("Error loading gallery:", err));
  }, []);

  const years = ["All", ...new Set(posts.map((p) => p.year))].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return (b as number) - (a as number);
  }) as (number | "All")[];

  const filteredPosts =
    selectedYear === "All" ? posts : posts.filter((p) => p.year === selectedYear);

  const nextImage = () => {
    if (selectedPost) {
      setCurrentImageIndex((prev) =>
        prev === selectedPost.albumImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedPost) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedPost.albumImages.length - 1 : prev - 1
      );
    }
  };

  return (
    <section id="journey" className="py-20 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-share-tech">
            My <span className="text-primary text-glow">Journey</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-fira-code">
            Documenting my experiences, achievements, and growth through hackathons, competitions, and events.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              onClick={() => setSelectedYear(year)}
              className={
                selectedYear === year
                  ? "bg-primary text-primary-foreground"
                  : "border-border/50 hover:border-primary/50"
              }
            >
              {year}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 hover:card-glow transition-all duration-300 group cursor-pointer overflow-hidden"
              onClick={() => {
                setSelectedPost(post);
                setCurrentImageIndex(0);
              }}
            >
              <div className="relative h-64 overflow-hidden bg-muted/30">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge
                  className="absolute top-4 right-4 bg-primary/90 text-primary-foreground font-fira-code"
                >
                  {post.category}
                </Badge>
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{post.location}</span>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {post.caption}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    <span>{post.shares}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {post.hashtags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-primary/70 hover:text-primary transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-cyber">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedPost?.title}</DialogTitle>
            </DialogHeader>

            {selectedPost && (
              <div className="space-y-6">
                <div className="relative">
                  <div className="relative w-full aspect-video bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedPost.albumImages[currentImageIndex]}
                      alt={`${selectedPost.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-background/80 backdrop-blur rounded-full text-sm font-mono">
                      {currentImageIndex + 1}/{selectedPost.albumImages.length}
                    </div>
                  </div>

                  {selectedPost.albumImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedPost.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedPost.date}</span>
                    </div>
                    <Badge variant="secondary">{selectedPost.category}</Badge>
                  </div>

                  <p className="text-foreground">{selectedPost.caption}</p>

                  <div className="flex flex-wrap gap-2">
                    {selectedPost.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-muted/50 border border-border/50 rounded-full text-sm text-primary/70"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{selectedPost.likes}</span>
                      <span className="text-muted-foreground">likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{selectedPost.comments}</span>
                      <span className="text-muted-foreground">comments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{selectedPost.shares}</span>
                      <span className="text-muted-foreground">shares</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Journey;
