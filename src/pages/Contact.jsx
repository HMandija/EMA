import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const Contact = () => {
  const form = useRef();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);

  // Fetch contact info from Firestore (set via admin panel)
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "contact"));
        if (snap.exists()) setInfo(snap.data());
      } catch (err) {
        console.error("Could not load contact info:", err);
      }
    };
    fetchInfo();
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(form.current);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    try {
      // 1. Send email via EmailJS
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // 2. Save message to Firestore (for admin panel)
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        read: false,
        createdAt: serverTimestamp(),
      });

      setSent(true);
      form.current.reset();
      setTimeout(() => setSent(false), 5000);
    } catch (error) {
      console.error(error);
      alert("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fallback values if Firestore hasn't loaded yet
  const city = info?.city || "Shkodër";
  const country = info?.country || "AL 4001";
  const phone = info?.phone || "+355 69 465 3880";
  const email = info?.email || "enm.architecture@gmail.com";
  const linkedin = info?.linkedin || "https://www.linkedin.com/in/ersid-mandija-8a6334220/";
  const instagram = info?.instagram || "";
  const facebook = info?.facebook || "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto pt-10 pb-24 px-4"
    >
      <h1 className="text-3xl font-light uppercase tracking-[0.2em] mb-16">
        Contact — EMA
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* Column 1: Info */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
              Location
            </h3>
            <p className="text-sm uppercase tracking-widest">{city}, {country}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
              Phone
            </h3>
            <p className="text-sm tracking-widest">{phone}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
              Digital
            </h3>
            <div className="flex flex-col space-y-2">
              <a
                href={`mailto:${email}`}
                className="text-sm hover:text-gray-400 transition-colors"
              >
                {email}
              </a>
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:text-gray-400 transition-colors"
                >
                  LinkedIn Profile
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:text-gray-400 transition-colors"
                >
                  Instagram
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:text-gray-400 transition-colors"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Form */}
        <div className="relative z-10">
          <form ref={form} onSubmit={sendEmail} className="space-y-8">
            <div className="border-b border-gray-200 py-2">
              <input
                type="text"
                name="name"
                placeholder="NAME"
                required
                className="w-full bg-transparent outline-none text-[11px] tracking-widest normal-case placeholder:uppercase"
              />
            </div>
            <div className="border-b border-gray-200 py-2">
              <input
                type="email"
                name="email"
                placeholder="EMAIL"
                required
                className="w-full bg-transparent outline-none text-[11px] tracking-widest normal-case placeholder:uppercase"
              />
            </div>
            <div className="border-b border-gray-200 py-2">
              <textarea
                name="message"
                placeholder="MESSAGE"
                rows="4"
                required
                className="w-full bg-transparent outline-none text-[11px] tracking-widest normal-case placeholder:uppercase resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || sent}
              className="text-[11px] tracking-[0.3em] uppercase hover:text-gray-500 transition-colors disabled:text-gray-400 cursor-pointer block mt-4"
            >
              {loading ? "SENDING..." : sent ? "MESSAGE SENT ✓" : "SEND MESSAGE"}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
