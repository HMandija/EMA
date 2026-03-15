import { motion } from "framer-motion";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID, // Thërret Service ID nga .env
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // Thërret Template ID nga .env
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY, // Thërret Public Key nga .env
      )
      .then(
        () => {
          setSent(true);
          setLoading(false);
          form.current.reset();
          setTimeout(() => setSent(false), 5000);
        },
        (error) => {
          setLoading(false);
          alert("Something went wrong, please try again.");
          console.log(error.text);
        },
      );
  };
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
        {/* Kolona 1: Info */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
              Location
            </h3>
            <p className="text-sm uppercase tracking-widest">
              Shkodër, AL 4001
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
              Phone
            </h3>
            <p className="text-sm tracking-widest">+355 69 465 3880</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
              Digital
            </h3>
            <div className="flex flex-col space-y-2">
              <a
                href="mailto:enm.architecture@gmail.com"
                className="text-sm hover:text-gray-400 transition-colors"
              >
                enm.architecture@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/ersid-mandija-8a6334220/"
                target="_blank"
                rel="noreferrer"
                className="text-sm hover:text-gray-400 transition-colors"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>

        {/* Kolona 2: Forma */}
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
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading || sent}
              className="text-[11px] tracking-[0.3em] uppercase hover:text-gray-500 transition-colors disabled:text-gray-400 cursor-pointer block mt-4"
            >
              {loading ? "SENDING..." : sent ? "MESSAGE SENT" : "SEND MESSAGE"}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
