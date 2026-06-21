import { useState } from "react";
import { Mail, MapPin, Send, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAssetPath } from "@/lib/paths";
import { useJsonData } from "@/hooks/use-json-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import { getEmailJsConfig } from "@/lib/emailjs-config";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email is too long"),
  topic: z.string().min(1, "Please select a topic"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
  website: z.string().max(0).optional(),
});

type SiteData = {
  sections?: { hero?: { cvPath?: string; secondaryCtaLabel?: string } };
};

const DEFAULT_CV_PATH = "/CV_Yassine_Hallous.pdf";

const Contact = () => {
  const { data: siteData } = useJsonData<SiteData>("/data/site.json");
  const cvPath = siteData?.sections?.hero?.cvPath?.trim() || DEFAULT_CV_PATH;
  const cvButtonLabel = siteData?.sections?.hero?.secondaryCtaLabel ?? "Download My CV";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.website) return;

    setIsSubmitting(true);

    const emailConfig = getEmailJsConfig();
    if (!emailConfig) {
      toast({
        title: "Configuration Error",
        description: import.meta.env.DEV
          ? "EmailJS is not configured. Add VITE_EMAILJS_* to .env and restart the dev server."
          : "Email service is not configured on the live site. Redeploy after adding GitHub Actions secrets.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const validated = contactSchema.parse(formData);
      const { serviceId, templateId, publicKey } = emailConfig;

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: validated.name,
          from_email: validated.email,
          title: "Contact Form Submission",
          subject: validated.topic,
          message: validated.message,
          reply_to: validated.email,
        },
        { publicKey }
      );

      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. I'll get back to you soon!",
      });

      setFormData({ name: "", email: "", topic: "", message: "", website: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else if (error instanceof EmailJSResponseStatus) {
        const hint =
          error.status === 403
            ? " Check EmailJS → Account → Security → Allowed origins."
            : "";
        toast({
          title: "Error",
          description: `Failed to send message (${error.status}).${hint}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "yassine_hallous@ieee.org",
      link: "mailto:yassine_hallous@ieee.org",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Tunis, Sousse – Tunisia",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "Hallous-Yassine",
      link: "https://github.com/Hallous-Yassine",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "yassine-hallous",
      link: "https://linkedin.com/in/yassine-hallous",
    },
  ];

  return (
    <section id="contact" className="py-20 px-4 relative bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-share-tech">
            Get In <span className="text-primary text-glow">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-fira-code">
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Send Me a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div>
                  <label htmlFor="contact-name" className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    id="contact-name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-topic" className="text-sm font-medium mb-2 block">Topic</label>
                  <Select
                    value={formData.topic}
                    onValueChange={(value) =>
                      setFormData({ ...formData, topic: value })
                    }
                  >
                    <SelectTrigger id="contact-topic" className="bg-background/50 border-border/50 focus:border-primary">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                      <SelectItem value="job">Job Opportunity</SelectItem>
                      <SelectItem value="project">Project Inquiry</SelectItem>
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    id="contact-message"
                    placeholder="Tell me about your project or inquiry..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-background/50 border-border/50 focus:border-primary min-h-32"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">{info.label}</div>
                        {info.link ? (
                          <a
                            href={info.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-muted-foreground">{info.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur border-primary/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-4">Let's Build Something Amazing</h3>
                <p className="text-muted-foreground mb-6">
                  I'm always open to discussing new projects, creative ideas, or opportunities
                  to be part of your visions.
                </p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => window.open(getAssetPath(cvPath), "_blank")}
                >
                  {cvButtonLabel}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
