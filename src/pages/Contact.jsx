import { motion } from "framer-motion";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
const Contact = () => {
  const form = useRef();
  const [sent, setSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    // Këtu do vendosësh kodet e tua nga emailjs.com
    emailjs
      .sendForm(
        "service_mivu2ii",
        "template_mchespq",
        form.current,
        "YOUR_PUBLIC_KEY",
      )
      .then(
        () => {
          setSent(true);
          form.current.reset();
        },
        (error) => {
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
        {/* Kolona 1: Të dhënat e kontaktit */}
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

        {/* Kolona 2: Forma e Kontaktit */}
        <div>
          <form ref={form} onSubmit={sendEmail} className="space-y-8">
            <div className="border-b border-gray-200 py-2">
              {/* name="name" përputhet me {{name}} në EmailJS */}
              <input
                type="text"
                name="name"
                placeholder="NAME"
                required
                className="w-full bg-transparent outline-none text-[11px] tracking-widest uppercase"
              />
            </div>
            <div className="border-b border-gray-200 py-2">
              {/* name="email" përputhet me {{email}} në EmailJS */}
              <input
                type="email"
                name="email"
                placeholder="EMAIL"
                required
                className="w-full bg-transparent outline-none text-[11px] tracking-widest uppercase"
              />
            </div>
            <div className="border-b border-gray-200 py-2">
              {/* name="message" përputhet me {{message}} në EmailJS */}
              <textarea
                name="message"
                placeholder="MESSAGE"
                rows="4"
                required
                className="w-full bg-transparent outline-none text-[11px] tracking-widest uppercase resize-none"
              ></textarea>
            </div>

            <button type="submit" className="...">
              {sent ? "MESSAGE SENT" : "SEND MESSAGE"}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
