import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Send,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "919999999999"; // placeholder — replace with real WhatsApp business number
const EMAIL = "chaitanya100502@gmail.com";

export default function ContactPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  /* ── Send via mailto (emails land at chaitanya100502@gmail.com) ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields." });
      return;
    }
    setIsSending(true);

    // Compose mailto link
    const subject = encodeURIComponent(form.subject || `CityTrail Contact from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`, "_self");

    // Simulate a small delay so user sees progress
    await new Promise(r => setTimeout(r, 800));
    setIsSending(false);
    setSent(true);
    toast({ title: "Message Sent!", description: "We'll get back to you shortly." });
  };

  /* ── Open WhatsApp pre-filled chat ── */
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      form.message
        ? `Hi CityTrail! I'm ${form.name || "a traveler"}.\n\n${form.message}`
        : "Hi CityTrail! I'd love to know more about your services."
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-heritage-sand flex flex-col">
      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-[#1a2530] to-foreground" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMC44IiBmaWxsPSJyZ2JhKDIxMiwxNzUsNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-heritage-sand to-transparent" />

        <div className="relative z-10 pt-16 pb-24 px-8 max-w-xl mx-auto text-center">
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="absolute top-8 left-6 w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <ChevronLeft className="w-5 h-5 text-white/80" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-3">
              Get in Touch
            </p>
            <h1 className="font-serif text-4xl italic text-white mb-3 leading-tight drop-shadow-lg">
              We'd Love to Hear From You
            </h1>
            <p className="text-sm text-white/50 italic font-medium max-w-sm mx-auto">
              Questions about your journey? Feedback on the experience? We're just a message away.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 -mt-12 relative z-10 px-6 pb-20">
        <div className="max-w-xl mx-auto flex flex-col gap-8">

          {/* ── QUICK CONTACT CARDS ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {/* WhatsApp Card */}
            <button
              onClick={handleWhatsApp}
              className="group relative p-6 rounded-[2rem] text-center transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              style={{
                background: "rgba(37,211,102,0.06)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(37,211,102,0.18)",
                boxShadow: "0 4px 24px rgba(37,211,102,0.06), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#25D366]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-[#25D366]" />
                </div>
                <p className="text-[10px] font-black text-[#25D366] uppercase tracking-[0.2em] mb-1">WhatsApp</p>
                <p className="text-[9px] text-muted-foreground font-medium">Chat instantly</p>
              </div>
            </button>

            {/* Email Card */}
            <a
              href={`mailto:${EMAIL}`}
              className="group relative p-6 rounded-[2rem] text-center transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              style={{
                background: "rgba(188,74,60,0.04)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(188,74,60,0.12)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Email</p>
                <p className="text-[9px] text-muted-foreground font-medium truncate">{EMAIL}</p>
              </div>
            </a>

            {/* Office Hours Card */}
            <div
              className="relative p-6 rounded-[2rem] text-center"
              style={{
                background: "rgba(253,251,247,0.65)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(212,175,55,0.12)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Clock className="w-7 h-7 text-accent" />
              </div>
              <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-1">Response Time</p>
              <p className="text-[9px] text-muted-foreground font-medium">Within 24 hrs</p>
            </div>
          </motion.div>

          {/* ── CONTACT FORM ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div
              className="relative rounded-[2.5rem] p-8 sm:p-10 overflow-hidden"
              style={{
                background: "rgba(253,251,247,0.78)",
                backdropFilter: "blur(28px) saturate(1.5)",
                WebkitBackdropFilter: "blur(28px) saturate(1.5)",
                border: "1px solid rgba(255,255,255,0.38)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.10), 0 0 0 1px rgba(212,175,55,0.10), inset 0 1px 0 rgba(255,255,255,0.55)",
              }}
            >
              {/* Gold shimmer top accent */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.35), transparent)" }} />

              {sent ? (
                /* ── Success State ── */
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 flex flex-col items-center text-center gap-4"
                >
                  <div className="w-20 h-20 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-[#25D366]" />
                  </div>
                  <h3 className="font-serif text-2xl italic text-foreground">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground italic max-w-xs">
                    Thank you for reaching out. We'll respond to <strong>{form.email}</strong> shortly.
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all hover:-translate-y-1"
                      style={{ borderColor: "rgba(188,74,60,0.2)", color: "hsl(6 52% 48%)" }}
                    >
                      Send Another
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-1"
                      style={{ background: "#25D366" }}
                    >
                      <span className="flex items-center gap-2"><MessageCircle className="w-3 h-3" /> WhatsApp</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Send a Message</span>
                    <div className="flex-1 h-px bg-primary/10" />
                  </div>

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                        Your Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => update("name", e.target.value)}
                        placeholder="e.g. Arjun"
                        className="w-full px-5 py-4 rounded-2xl text-sm font-medium text-foreground placeholder:text-muted-foreground/40 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30"
                        style={{
                          background: "rgba(253,251,247,0.60)",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                        Email <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => update("email", e.target.value)}
                        placeholder="you@mail.com"
                        className="w-full px-5 py-4 rounded-2xl text-sm font-medium text-foreground placeholder:text-muted-foreground/40 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30"
                        style={{
                          background: "rgba(253,251,247,0.60)",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => update("subject", e.target.value)}
                      placeholder="What's this about?"
                      className="w-full px-5 py-4 rounded-2xl text-sm font-medium text-foreground placeholder:text-muted-foreground/40 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30"
                      style={{
                        background: "rgba(253,251,247,0.60)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                      Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => update("message", e.target.value)}
                      placeholder="Tell us about your travel plans, feedback, or anything else..."
                      rows={5}
                      className="w-full px-5 py-4 rounded-2xl text-sm font-medium text-foreground placeholder:text-muted-foreground/40 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                      style={{
                        background: "rgba(253,251,247,0.60)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                      required
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {/* Send Email */}
                    <motion.button
                      type="submit"
                      disabled={isSending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 relative overflow-hidden rounded-2xl py-5 flex items-center justify-center gap-3 font-black text-[10px] tracking-[0.2em] uppercase text-white disabled:opacity-60 shadow-lg"
                      style={{ background: "linear-gradient(135deg, #BC4A3C, #9B3830)" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-700" />
                      {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send via Email
                        </>
                      )}
                    </motion.button>

                    {/* Send via WhatsApp */}
                    <motion.button
                      type="button"
                      onClick={handleWhatsApp}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 relative overflow-hidden rounded-2xl py-5 flex items-center justify-center gap-3 font-black text-[10px] tracking-[0.2em] uppercase text-white shadow-lg"
                      style={{ background: "#25D366" }}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Send on WhatsApp
                    </motion.button>
                  </div>

                  <p className="text-[9px] text-center text-muted-foreground/50 italic mt-1">
                    Email messages are sent to {EMAIL} · WhatsApp opens a direct chat
                  </p>
                </form>
              )}
            </div>
          </motion.div>

          {/* ── LOCATION & SOCIAL ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-[2rem] p-8 text-center"
            style={{
              background: "rgba(253,251,247,0.60)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(212,175,55,0.10)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary opacity-60" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Based in</p>
            </div>
            <p className="font-serif text-lg italic text-foreground mb-1">Jaipur, Rajasthan, India</p>
            <p className="text-[9px] text-muted-foreground/60 font-medium italic">
              The Pink City — where heritage meets innovation
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
