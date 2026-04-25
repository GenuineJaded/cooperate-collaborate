import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";

type Door = "writing" | "music" | "art";

interface Props {
  door: Door;
  onClose: () => void;
  onCreated: () => void;
}

export default function NewArtifactForm({ door, onClose, onCreated }: Props) {
  const [nama, setNama] = useState("");
  const [body, setBody] = useState("");
  const [artifactLabel, setArtifactLabel] = useState("Artifact");
  const [editingLabel, setEditingLabel] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showUploadPause, setShowUploadPause] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = trpc.artifact.uploadFile.useMutation();
  const createArtifact = trpc.artifact.create.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPendingFile(f);
    setShowUploadPause(true);
  };

  const confirmUpload = () => {
    if (!pendingFile) return;
    setShowUploadPause(false);
    setFile(pendingFile);
    setFilePreview(URL.createObjectURL(pendingFile));
    setPendingFile(null);
  };

  const declineUpload = () => {
    setShowUploadPause(false);
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!body.trim() && !file) return;
    setSubmitting(true);
    try {
      let fileUrl: string | undefined;
      let fileKey: string | undefined;

      if (file) {
        const base64 = await fileToBase64(file);
        const result = await uploadFile.mutateAsync({
          filename: file.name,
          contentType: file.type,
          base64,
        });
        fileUrl = result.url;
        fileKey = result.key;
      }

      await createArtifact.mutateAsync({
        nama: nama.trim() || undefined,
        body: body.trim() || undefined,
        type: door,
        fileUrl,
        fileKey,
      });

      onCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0.04 0.01 280 / 0.88)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-2xl mx-4 animate-fade-in-up"
        style={{
          background: "oklch(0.07 0.01 280)",
          border: "1px solid oklch(0.22 0.06 295 / 0.5)",
          borderRadius: "2px",
          padding: "1.5rem",
        }}
      >
        {/* Blinking rectangle — "Artifact" label, editable feel */}
        <div className="mb-4">
          <div
            className="animate-blink inline-block"
            style={{
              border: "1px solid oklch(0.35 0.10 295 / 0.6)",
              borderRadius: "1px",
              padding: "0.2rem 0.6rem",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "oklch(0.45 0.12 295)",
              cursor: "text",
            }}
            onClick={() => setEditingLabel(true)}
          >
            {editingLabel ? (
              <input
                autoFocus
                value={artifactLabel}
                onChange={(e) => setArtifactLabel(e.target.value)}
                onBlur={() => setEditingLabel(false)}
                onKeyDown={(e) => e.key === "Enter" && setEditingLabel(false)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "oklch(0.45 0.12 295)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  width: `${Math.max(8, artifactLabel.length + 1)}ch`,
                }}
              />
            ) : (
              artifactLabel
            )}
          </div>
        </div>

        {/* Body */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder=""
          rows={6}
          className="w-full resize-none outline-none text-sm leading-relaxed"
          style={{
            background: "none",
            border: "none",
            color: "oklch(0.78 0.04 295)",
            fontWeight: 300,
            caretColor: "oklch(0.55 0.16 295)",
            marginBottom: "1rem",
          }}
        />

        {/* File preview — image, video, or audio */}
        {filePreview && file && (
          <div className="mb-4">
            {file.type.startsWith("image/") ? (
              <img
                src={filePreview}
                alt=""
                className="max-w-full rounded-sm"
                style={{ maxHeight: "260px", objectFit: "contain" }}
              />
            ) : file.type.startsWith("video/") ? (
              <video
                src={filePreview}
                controls
                className="max-w-full rounded-sm"
                style={{ maxHeight: "260px" }}
              />
            ) : file.type.startsWith("audio/") ? (
              <audio
                src={filePreview}
                controls
                className="w-full"
                style={{ filter: "invert(0.85) hue-rotate(220deg)" }}
              />
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  border: "1px solid oklch(0.22 0.06 295 / 0.45)",
                  borderRadius: "2px",
                  padding: "0.3rem 0.6rem",
                  color: "oklch(0.55 0.12 295)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                }}
              >
                <span style={{ opacity: 0.6 }}>⊕</span>
                {file.name}
              </span>
            )}
          </div>
        )}

        {/* Bottom row: Nama + file + submit */}
        <div className="flex items-center gap-3 mt-2">
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nāma"
            maxLength={128}
            className="flex-1 outline-none text-xs tracking-widest"
            style={{
              background: "none",
              border: "none",
              borderBottom: "1px solid oklch(0.20 0.05 295 / 0.5)",
              color: "oklch(0.45 0.10 295)",
              padding: "0.2rem 0",
              letterSpacing: "0.15em",
            }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs"
            style={{
              background: "none",
              border: "none",
              color: "oklch(0.35 0.08 295)",
              padding: "0.2rem",
            }}
            title="attach"
          >
            ⊕
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="*/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting || (!body.trim() && !file)}
            className="text-xs tracking-widest transition-all duration-300"
            style={{
              background: "none",
              border: "1px solid oklch(0.30 0.10 295 / 0.5)",
              color:
                submitting || (!body.trim() && !file)
                  ? "oklch(0.28 0.06 295)"
                  : "oklch(0.55 0.16 295)",
              padding: "0.3rem 0.8rem",
              borderRadius: "1px",
              letterSpacing: "0.15em",
            }}
          >
            {submitting ? "…" : "place"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3"
          style={{
            background: "none",
            border: "none",
            color: "oklch(0.30 0.06 295)",
            fontSize: "1rem",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Upload pause */}
      {showUploadPause && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center"
          style={{ background: "oklch(0.04 0.01 280 / 0.92)" }}
        >
          <div
            className="text-center max-w-sm px-8 animate-fade-in-up"
            style={{ color: "oklch(0.42 0.10 295)" }}
          >
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ fontWeight: 300, lineHeight: 1.9 }}
            >
              Although you are permitted to store and share your work here,
              recognize that you cannot remove it.
              <br />
              <br />
              And containers fill.
              <br />
              <br />
              If there is another viable route for sharing your creation,
              perhaps use that instead.
            </p>
            <div className="flex gap-6 justify-center">
              <button
                onClick={confirmUpload}
                className="text-xs tracking-widest"
                style={{
                  background: "none",
                  border: "none",
                  color: "oklch(0.45 0.12 295)",
                  letterSpacing: "0.2em",
                }}
              >
                continue
              </button>
              <button
                onClick={declineUpload}
                className="text-xs tracking-widest"
                style={{
                  background: "none",
                  border: "none",
                  color: "oklch(0.30 0.06 295)",
                  letterSpacing: "0.2em",
                }}
              >
                release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
