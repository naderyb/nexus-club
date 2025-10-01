"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState, useCallback, useMemo } from "react";

interface JoinNexusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Move constants outside component to prevent recreation
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const initialFormState = {
  nom: "",
  prenom: "",
  num: "",
  email: "",
  instagram: "",
  discord: "",
  classe: "",
  hobbies: "",
  motivation: "",
  extra: "",
};

const classeOptions = [
  { value: "", label: "Choisir ta classe *" },
  { value: "LAC1", label: "LAC1" },
  { value: "LAC2", label: "LAC2" },
  { value: "LAC3", label: "LAC3" },
  { value: "LMI1", label: "LMI1" },
  { value: "LMI2", label: "LMI2" },
  { value: "LMI3", label: "LMI3" },
  { value: "LCF1", label: "LCF1" },
  { value: "LCF2", label: "LCF2" },
];

export default function JoinNexusModal({
  isOpen,
  onClose,
}: JoinNexusModalProps) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Memoize form validation to prevent unnecessary recalculations
  const isFormValid = useMemo(() => {
    return (
      form.nom.trim() &&
      form.prenom.trim() &&
      form.num.trim() &&
      form.email.trim() &&
      form.instagram.trim() &&
      form.discord.trim() &&
      form.classe &&
      form.motivation.trim()
    );
  }, [form]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleInputChange = useCallback((field: keyof typeof form) => {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }, []);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  // Close modal on Escape key
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  // Reset form and message when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setLoading(false);
    }
  }, [isOpen]);

  // Optimized form submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");

      try {
        const payload = {
          nom: form.nom.trim(),
          prenom: form.prenom.trim(),
          num: form.num.trim(),
          email: form.email.trim(),
          instagram: form.instagram.trim() || null,
          discord: form.discord.trim() || null,
          classe: form.classe,
          hobbies: form.hobbies.trim() || null,
          motivation: form.motivation.trim() || null,
          additional_notes: form.extra.trim() || null,
        };

        const res = await fetch("/api/newbies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({
          error: "Réponse serveur invalide",
        }));

        if (!res.ok) {
          throw new Error(data.error || `Erreur HTTP ${res.status}`);
        }

        setMessage(`✅ ${data.message || "Inscription envoyée avec succès !"}`);
        setForm(initialFormState);

        setTimeout(() => {
          setMessage("");
          onClose();
        }, 2500);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Une erreur inconnue est survenue";
        setMessage(`❌ ${errorMessage}`);

        setTimeout(() => {
          setMessage("");
        }, 5000);
      } finally {
        setLoading(false);
      }
    },
    [form, onClose]
  );

  // Memoized input component to reduce re-renders
  const InputField = useMemo(() => {
    const component = ({
      type,
      placeholder,
      value,
      field,
      required = false,
      rows,
    }: {
      type: string;
      placeholder: string;
      value: string;
      field: keyof typeof form;
      required?: boolean;
      rows?: number;
    }) => {
      const Component = type === "textarea" ? "textarea" : "input";
      const props = {
        placeholder,
        value,
        onChange: handleInputChange(field),
        className:
          "w-full border border-gray-600/50 bg-gray-900/50 backdrop-blur-sm p-3 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/25 focus:outline-none transition-all duration-300" +
          (type === "textarea" ? " resize-none" : ""),
        required,
        disabled: loading,
        ...(type === "textarea" && { rows }),
        ...(type !== "textarea" && { type }),
      };

      return <Component {...props} />;
    };

    component.displayName = "InputField";
    return component;
  }, [handleInputChange, loading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] rounded-2xl border border-fuchsia-500/30 p-8 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "0 0 50px rgba(192, 38, 211, 0.3), 0 0 100px rgba(0, 255, 255, 0.2)",
            }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <motion.div
                className="absolute -top-10 -right-10 w-20 h-20 bg-fuchsia-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/30 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Fermer"
            >
              <FaTimes size={16} />
            </motion.button>

            {/* Content */}
            <div className="relative">
              {/* Title */}
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Rejoindre le Nexus 🚀
              </motion.h2>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <InputField
                  type="text"
                  placeholder="Nom *"
                  value={form.nom}
                  field="nom"
                  required
                />
                <InputField
                  type="text"
                  placeholder="Prénom *"
                  value={form.prenom}
                  field="prenom"
                  required
                />
                <InputField
                  type="text"
                  placeholder="Numéro *"
                  value={form.num}
                  field="num"
                  required
                />
                <InputField
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  field="email"
                  required
                />
                <InputField
                  type="text"
                  placeholder="Instagram *"
                  value={form.instagram}
                  field="instagram"
                  required
                />
                <InputField
                  type="text"
                  placeholder="Discord *"
                  value={form.discord}
                  field="discord"
                  required
                />

                {/* Classe select */}
                <div>
                  <select
                    value={form.classe}
                    onChange={handleInputChange("classe")}
                    className="w-full border border-gray-600/50 bg-gray-900/50 backdrop-blur-sm p-3 rounded-lg text-white focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/25 focus:outline-none transition-all duration-300"
                    required
                    disabled={loading}
                  >
                    {classeOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-gray-900"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <InputField
                  type="textarea"
                  placeholder="Tes hobbies (optionnel)"
                  value={form.hobbies}
                  field="hobbies"
                  rows={2}
                />
                <InputField
                  type="textarea"
                  placeholder="Pourquoi veux-tu nous rejoindre ? *"
                  value={form.motivation}
                  field="motivation"
                  required
                  rows={3}
                />
                <InputField
                  type="textarea"
                  placeholder="Autre chose à ajouter ? (optionnel)"
                  value={form.extra}
                  field="extra"
                  rows={2}
                />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-6 py-3 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Envoi en cours...
                      </span>
                    ) : (
                      "Envoyer ma candidature"
                    )}
                  </button>
                </div>
              </motion.form>

              {/* Message */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={`mt-4 p-4 rounded-lg text-center text-sm font-medium border ${
                      message.includes("succès") ||
                      message.includes("✅") ||
                      !message.includes("❌")
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
