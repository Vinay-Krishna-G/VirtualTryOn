/**
 * components/tryon/TryOnModal.jsx
 * Premium Virtual Try-On experience — luxury fashion grade
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import getCroppedImg from "../../utils/cropUtils";
import { apiEnhanceImage } from "../../services/tryonService";
import PhotoGuidelines from "./PhotoGuidelines";

const STEPS = [
  { id: "upload", label: "Upload Photo" },
  { id: "crop", label: "Crop Photo" },
  { id: "review", label: "Review & Generate" },
];

export default function TryOnModal({ product, onClose, onGenerate, isGenerating }) {
  const [step, setStep] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showGuidelines, setShowGuidelines] = useState(false);
  const fileInputRef = useRef(null);

  // Cropping State
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [enhanceImage, setEnhanceImage] = useState(false);
  const imgRef = useRef(null);

  const processFile = useCallback((file) => {
    setErrorMessage("");
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file — JPG, PNG or WEBP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File too large. Maximum size is 10 MB.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStep("crop"); // go to crop instead of review
  }, []);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) processFile(file);
  }

  function handleDragOver(e) { e.preventDefault(); setIsDragging(true); }
  function handleDragLeave() { setIsDragging(false); }
  function handleDrop(e) {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleReset() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setStep("upload");
    setErrorMessage("");
    setCrop(undefined);
    setCompletedCrop(null);
    setIsExpanded(false);
    setEnhanceImage(false);
  }

  const handleCropConfirm = async () => {
    if (!completedCrop || !completedCrop.width || !completedCrop.height) {
      setErrorMessage("Please make a selection to crop.");
      return;
    }
    try {
      setIsCropping(true);
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop, false);
      let croppedFile = new File([croppedImageBlob], selectedFile.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
      
      if (enhanceImage) {
        try {
          const enhancedUrl = await apiEnhanceImage(croppedFile);
          const enhancedBlob = await (await fetch(enhancedUrl)).blob();
          croppedFile = new File([enhancedBlob], selectedFile.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
        } catch (enhanceErr) {
          let errorText = "";
          if (enhanceErr.response?.data instanceof Blob) {
            try {
              const text = await enhanceErr.response.data.text();
              const json = JSON.parse(text);
              errorText = json.error || "";
            } catch (e) {
              // ignore
            }
          } else if (enhanceErr.response?.data?.error) {
            errorText = enhanceErr.response.data.error;
          }

          if (errorText.includes("QUALITY_REJECTED")) {
            setErrorMessage(errorText.replace("QUALITY_REJECTED: ", ""));
            setShowGuidelines(true);
            setIsCropping(false);
            return;
          }
          setErrorMessage("Failed to enhance image. Using standard crop.");
        }
      }
      
      setSelectedFile(croppedFile);
      setPreviewUrl(URL.createObjectURL(croppedFile));
      setStep("review");
    } catch (e) {
      setErrorMessage("Failed to crop image.");
      console.error(e);
    } finally {
      setIsCropping(false);
    }
  };

  async function handleGenerateClick() {
    if (!selectedFile) { setErrorMessage("Please select a photo first."); return; }
    try {
      await onGenerate(selectedFile);
    } catch (err) {
      if (err.response?.data?.error?.includes("QUALITY_REJECTED")) {
        setErrorMessage(err.response.data.error.replace("QUALITY_REJECTED: ", ""));
        setShowGuidelines(true);
      }
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleBackdropClick(e) { if (e.target === e.currentTarget) onClose(); }

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Virtual Try-On — ${product.name}`}
    >
      <div
        className="modal-panel"
        style={{ maxWidth: "640px", display: "flex", flexDirection: "column" }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "0.85rem", flexShrink: 0 }}>
          <div style={{
            width: "32px", height: "2.5px",
            background: "var(--color-border-hover)",
            borderRadius: "2px",
          }} />
        </div>

        {/* Header — fixed */}
        <div style={{
          padding: "0.85rem 1.5rem 0",
          flexShrink: 0,
        }}>
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <p style={{
                fontSize: "0.56rem", fontWeight: "700", color: "var(--color-brand)",
                textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: "0.3rem",
              }}>
                Virtual Dressing Room
              </p>
              <h2 style={{
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontSize: "1.3rem", fontWeight: "600", color: "var(--color-text)", lineHeight: 1.2,
              }}>
                {step === "upload" ? "Upload Your Photo" : step === "crop" ? "Crop Photo" : "Review & Generate"}
              </h2>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: "transparent", border: "1px solid var(--color-border)",
                borderRadius: "50%", width: "30px", height: "30px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--color-text-muted)", cursor: "pointer",
                flexShrink: 0, transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-brand)";
                e.currentTarget.style.color = "var(--color-brand)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.color = "var(--color-text-muted)";
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
              </svg>
            </button>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "1.5rem" }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: step === s.id || (step === "review" && i === 0)
                      ? "var(--color-brand)" : "var(--color-surface-2)",
                    border: `1px solid ${step === s.id || (step === "review" && i === 0) ? "var(--color-brand)" : "var(--color-border)"}`,
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}>
                    {step === "review" && i === 0 ? (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
                        <polyline points="2,6 5,9 10,3"/>
                      </svg>
                    ) : (
                      <span style={{
                        fontSize: "0.6rem", fontWeight: "700",
                        color: step === s.id ? "#fff" : "var(--color-text-muted)",
                      }}>{i + 1}</span>
                    )}
                  </div>
                  <span style={{
                    fontSize: "0.62rem", fontWeight: "600", textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: step === s.id ? "var(--color-text)" : "var(--color-text-muted)",
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    flex: 1, height: "1px", margin: "0 0.75rem",
                    background: step === "review" ? "var(--color-brand)" : "var(--color-border)",
                    transition: "background 0.4s ease",
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--color-border)", marginBottom: "1.25rem" }} />
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", flex: 1, padding: "0 1.5rem 1.5rem" }}>

          {/* Product chip — always visible */}
          <div style={{
            display: "flex", gap: "0.85rem", alignItems: "center",
            padding: "0.7rem 0.85rem",
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)", marginBottom: "1.25rem",
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "42px", height: "56px", objectFit: "cover", objectPosition: "top",
                borderRadius: "6px", border: "1px solid var(--color-border)",
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: "0.55rem", fontWeight: "700", color: "var(--color-brand)",
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem",
              }}>
                {product.brand}
              </p>
              <p style={{
                fontSize: "0.82rem", fontWeight: "500", color: "var(--color-text)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {product.name}
              </p>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginBottom: "1px" }}>Garment</p>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "var(--color-brand)", margin: "0 auto",
              }} />
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="tryon-file-input"
          />

          {/* ── STEP 1: Upload ── */}
          {step === "upload" && (
            <>
              {/* Upload zone */}
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                aria-label="Upload your photo"
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current.click()}
                style={{
                  border: `1.5px dashed ${isDragging ? "var(--color-brand)" : "var(--color-border-hover)"}`,
                  borderRadius: "var(--radius-lg)",
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  marginBottom: "1.25rem",
                  background: isDragging
                    ? "var(--color-brand-light)"
                    : "var(--color-surface-2)",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Background pattern */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(184,150,90,${isDragging ? 0.1 : 0.04}) 0%, transparent 70%)`,
                }} />

                <div style={{
                  width: "52px", height: "52px",
                  border: "1px solid var(--color-border-brand)",
                  borderRadius: "var(--radius-md)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1rem",
                  background: "var(--color-brand-light)",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>

                <p style={{
                  fontWeight: "600", color: "var(--color-text)",
                  fontSize: "0.92rem", marginBottom: "0.4rem",
                }}>
                  {isDragging ? "Drop to upload" : "Upload a full-body photo"}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", lineHeight: "1.6" }}>
                  Drag & drop or <span style={{ color: "var(--color-brand)", fontWeight: "600" }}>click to browse</span>
                  <br />JPG, PNG, WEBP · Max 10 MB
                </p>
              </div>

              {/* Photo guidelines — 3 cards */}
              <div style={{ marginBottom: "1rem" }}>
                <p style={{
                  fontSize: "0.6rem", fontWeight: "700", color: "var(--color-text-muted)",
                  textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.85rem",
                }}>
                  Photo Guidelines
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem" }}>
                  {[
                    { icon: "M12 2v20M2 12h20", label: "Stand Straight", desc: "Full body, facing forward" },
                    { icon: "M3 3h18v18H3z", label: "Plain Background", desc: "Solid or neutral colour" },
                    { icon: "M12 3a9 9 0 100 18A9 9 0 0012 3zM12 7v5l3 3", label: "Good Lighting", desc: "Bright, even light" },
                  ].map(({ icon, label, desc }) => (
                    <div key={label} style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      padding: "0.8rem 0.7rem",
                      textAlign: "center",
                    }}>
                      <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "center" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="1.5" strokeLinecap="round">
                          <path d={icon}/>
                        </svg>
                      </div>
                      <p style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--color-text)", marginBottom: "0.2rem" }}>
                        {label}
                      </p>
                      <p style={{ fontSize: "0.58rem", color: "var(--color-text-muted)", lineHeight: "1.4" }}>
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div style={{
                  padding: "0.7rem 0.9rem", marginBottom: "0.75rem",
                  background: "rgba(235,87,87,0.07)",
                  border: "1px solid rgba(235,87,87,0.22)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.75rem", color: "var(--color-danger)",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {errorMessage}
                </div>
              )}

              {/* Privacy note */}
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "0.65rem 0.85rem",
                background: "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <p style={{ fontSize: "0.68rem", color: "var(--color-text-muted)", lineHeight: "1.5" }}>
                  Your photo is processed securely and <strong style={{ color: "var(--color-text-2)" }}>never stored</strong> on our servers.
                </p>
              </div>
            </>
          )}

          {/* ── STEP 1.5: Crop ── */}
          {step === "crop" && (
            <>
              {/* Image Enhancement Checkbox */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", padding: "0.85rem", background: "var(--color-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                <input
                  type="checkbox"
                  id="enhance-image-checkbox"
                  checked={enhanceImage}
                  onChange={(e) => setEnhanceImage(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--color-brand)" }}
                />
                <label htmlFor="enhance-image-checkbox" style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-text)", cursor: "pointer", userSelect: "none" }}>
                  Enhance Image Quality <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", fontWeight: "400" }}>(Optional - Sharpens blurry photos)</span>
                </label>
              </div>

              <div style={{ position: "relative", width: "100%", maxHeight: "400px", background: "#1a1a1a", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: "1.25rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  onComplete={c => setCompletedCrop(c)}
                >
                  <img
                    ref={imgRef}
                    src={previewUrl}
                    style={{ maxHeight: "400px", maxWidth: "100%", objectFit: "contain" }}
                    alt="Crop preview"
                  />
                </ReactCrop>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginBottom: "1rem" }}>
                <button
                  onClick={handleReset}
                  style={{
                    background: "transparent", color: "var(--color-text)",
                    border: "1px solid var(--color-border)", padding: "0.6rem 1.25rem",
                    borderRadius: "var(--radius-md)", cursor: "pointer",
                    fontWeight: "600", fontSize: "0.82rem"
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleCropConfirm}
                  disabled={isCropping}
                  style={{
                    background: "var(--color-brand)", color: "#fff", border: "none",
                    padding: "0.6rem 1.25rem", borderRadius: "var(--radius-md)",
                    cursor: isCropping ? "not-allowed" : "pointer",
                    fontWeight: "600", fontSize: "0.82rem",
                    opacity: isCropping ? 0.7 : 1
                  }}
                >
                  {isCropping ? "Cropping..." : "Confirm Crop"}
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Review ── */}
          {step === "review" && (
            <>
              {/* Side-by-side preview */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem",
                marginBottom: "1.25rem",
              }}>
                {/* User photo */}
                <div>
                  <p style={{
                    fontSize: "0.58rem", fontWeight: "600", color: "var(--color-text-muted)",
                    textTransform: "uppercase", letterSpacing: "0.09em",
                    textAlign: "center", marginBottom: "0.5rem",
                  }}>
                    Your Photo
                  </p>
                  <div style={{ position: "relative" }}>
                    <img
                      src={previewUrl}
                      alt="Uploaded photo"
                      style={{
                        width: "100%", aspectRatio: "3/4", objectFit: "cover",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-surface-2)",
                        cursor: "pointer"
                      }}
                      onClick={() => setIsExpanded(true)}
                    />
                    
                    {/* Expand Button */}
                    <button
                      onClick={() => setIsExpanded(true)}
                      title="Expand cropped image"
                      style={{
                        position: "absolute", top: "8px", right: "8px",
                        background: "rgba(0,0,0,0.5)", color: "#fff",
                        border: "none", borderRadius: "var(--radius-xs)",
                        padding: "0.3rem", display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", backdropFilter: "blur(4px)",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                    </button>

                    <button
                      onClick={handleReset}
                      title="Choose a different photo"
                      style={{
                        position: "absolute", bottom: "8px", left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(0,0,0,0.7)", color: "#fff",
                        border: "none", borderRadius: "var(--radius-xs)",
                        padding: "0.3rem 0.65rem",
                        fontSize: "0.62rem", fontWeight: "600",
                        cursor: "pointer", backdropFilter: "blur(8px)",
                        letterSpacing: "0.04em", whiteSpace: "nowrap",
                      }}
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Garment */}
                <div>
                  <p style={{
                    fontSize: "0.58rem", fontWeight: "600", color: "var(--color-brand)",
                    textTransform: "uppercase", letterSpacing: "0.09em",
                    textAlign: "center", marginBottom: "0.5rem",
                  }}>
                    Garment
                  </p>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "top",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border-brand)",
                    }}
                  />
                </div>
              </div>

              {/* Arrow indicator */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "0.75rem", marginBottom: "1.25rem",
              }}>
                <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
                <div style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "0.62rem", color: "var(--color-text-muted)", fontWeight: "500",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="1.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  AI will blend these two
                </div>
                <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
              </div>

              {/* What happens box */}
              <div style={{
                padding: "1rem 1.1rem",
                background: "linear-gradient(135deg, rgba(184,150,90,0.07), rgba(184,150,90,0.02))",
                border: "1px solid var(--color-border-brand)",
                borderRadius: "var(--radius-md)", marginBottom: "1.25rem",
              }}>
                <p style={{
                  fontSize: "0.65rem", fontWeight: "700", color: "var(--color-brand)",
                  textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.65rem",
                }}>
                  What will be generated
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {[
                    "Your body proportions are preserved exactly",
                    "The garment is draped realistically on your figure",
                    "Lighting & shadows adapt to your photo",
                  ].map((line) => (
                    <div key={line} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ marginTop: "1px", flexShrink: 0 }}>
                        <circle cx="7" cy="7" r="6.5" stroke="var(--color-brand)" strokeWidth="1"/>
                        <polyline points="4.5,7 6.5,9.5 9.5,4.5" stroke="var(--color-brand)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                      </svg>
                      <span style={{ fontSize: "0.73rem", color: "var(--color-text-muted)", lineHeight: "1.5" }}>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time estimate */}
              {!isGenerating && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  marginBottom: "1rem",
                  padding: "0.6rem 0.85rem",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                    Estimated generation time: <strong style={{ color: "var(--color-text-2)" }}>15–45 seconds</strong>
                  </span>
                </div>
              )}

              {errorMessage && (
                <div style={{
                  padding: "0.7rem 0.9rem", marginBottom: "0.75rem",
                  background: "rgba(235,87,87,0.07)",
                  border: "1px solid rgba(235,87,87,0.22)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.75rem", color: "var(--color-danger)",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {errorMessage}
                </div>
              )}

              {isGenerating ? (
                <div style={{
                  textAlign: "center", padding: "1.75rem 1rem",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                }}>
                  {/* Animated rings */}
                  <div style={{ position: "relative", width: "52px", height: "52px", margin: "0 auto 1.25rem" }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      border: "2px solid var(--color-border)",
                      borderRadius: "50%",
                    }} />
                    <div style={{
                      position: "absolute", inset: 0,
                      border: "2px solid transparent",
                      borderTopColor: "var(--color-brand)",
                      borderRadius: "50%",
                      animation: "spin 0.85s linear infinite",
                    }} />
                    <div style={{
                      position: "absolute", inset: "8px",
                      border: "1.5px solid transparent",
                      borderTopColor: "rgba(184,150,90,0.4)",
                      borderRadius: "50%",
                      animation: "spin 1.2s linear infinite reverse",
                    }} />
                  </div>
                  <p style={{
                    fontFamily: "var(--font-serif)", fontStyle: "italic",
                    fontSize: "1rem", fontWeight: "600", color: "var(--color-text)", marginBottom: "0.4rem",
                  }}>
                    Creating your look...
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", lineHeight: "1.6" }}>
                    Our AI is draping the garment on your photo.<br />
                    This takes 15–45 seconds.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleGenerateClick}
                  className="btn-tryon"
                  id="generate-btn"
                  style={{ width: "100%", padding: "1rem", fontSize: "0.82rem" }}
                >
                  Generate Virtual Try-On
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Full Screen Image Viewer */}
      {isExpanded && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.9)", zIndex: 100000,
          display: "flex", justifyContent: "center", alignItems: "center",
          flexDirection: "column", padding: "2rem"
        }}>
          <button
            onClick={() => setIsExpanded(false)}
            style={{
              position: "absolute", top: "20px", right: "20px",
              background: "rgba(255,255,255,0.1)", border: "none", color: "white",
              borderRadius: "50%", cursor: "pointer", padding: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <img
            src={previewUrl}
            alt="Expanded crop"
            style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", borderRadius: "var(--radius-md)" }}
          />
        </div>
      )}
      
      {/* Photo Guidelines Modal on Error */}
      {showGuidelines && (
        <PhotoGuidelines 
          onClose={() => setShowGuidelines(false)} 
          errorReason={errorMessage}
        />
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
