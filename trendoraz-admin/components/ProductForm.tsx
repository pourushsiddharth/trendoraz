"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductInput } from "@/lib/types";
import { BRAND_CATEGORIES } from "@/lib/brands";

const CATEGORIES = Object.entries(BRAND_CATEGORIES).map(([group, brands]) => ({
  group,
  options: brands.map(brand => ({
    value: brand.toLowerCase().replace(/\s+/g, "-"),
    label: brand
  }))
}));

const STD_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];
const TAG_SUGGESTIONS = ["new-arrival", "bestseller", "streetwear", "premium", "limited-edition", "sale", "oversized", "unisex"];

interface Props { initial?: Product }

export default function ProductForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    category: initial?.category ?? "",
    customCategory: initial?.category && !CATEGORIES.some(g => g.options.some(o => o.value === initial?.category)) ? initial?.category : "",
    gender: initial?.gender ?? "unisex",
    price: initial?.price?.toString() ?? "",
    original_price: initial?.original_price?.toString() ?? "",
    sku: initial?.sku ?? "",
    description: initial?.description ?? "",
    material: initial?.material ?? "",
    fit: initial?.fit ?? "",
    status: initial?.status ?? "active",
    quantity: initial?.quantity?.toString() ?? "0",
    featured: initial?.featured ?? false,
    new_arrival: initial?.new_arrival ?? true,
  });

  const [sizes, setSizes] = useState<string[]>(initial?.sizes ?? []);
  const [customSize, setCustomSize] = useState("");
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(initial?.colors ?? []);
  const [colorHex, setColorHex] = useState("#000000");
  const [colorName, setColorName] = useState("");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Input helpers
  const set = (field: string, val: string | number | boolean | null) =>
    setForm((f) => ({ ...f, [field]: val }));

  // Sizes
  const toggleSize = (s: string) =>
    setSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const addCustomSize = () => {
    if (customSize.trim() && !sizes.includes(customSize.trim())) {
      setSizes((prev) => [...prev, customSize.trim()]);
    }
    setCustomSize("");
  };

  // Colors
  const addColor = () => {
    if (!colorName.trim()) return;
    setColors((prev) => [...prev, { name: colorName.trim(), hex: colorHex }]);
    setColorName("");
    setColorHex("#000000");
  };
  const removeColor = (i: number) => setColors((prev) => prev.filter((_, idx) => idx !== i));

  // Tags
  const addTag = (t?: string) => {
    const tag = (t ?? tagInput).trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
    if (!t) setTagInput("");
  };
  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  // Images
  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 6 - images.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setImages((prev) => [...prev, e.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [images]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  // Save
  const handleSave = async () => {
    const finalCategory = form.customCategory.trim() || form.category;
    if (!form.name || !finalCategory || !form.price) {
      showToast("Please fill in Name, Category, and Price.");
      return;
    }
    setSaving(true);
    const payload: ProductInput = {
      name: form.name,
      category: finalCategory,
      gender: form.gender,
      price: parseInt(form.price),
      original_price: form.original_price ? parseInt(form.original_price) : null,
      sku: form.sku || null,
      description: form.description || null,
      material: form.material || null,
      fit: form.fit || null,
      sizes,
      colors,
      tags,
      images,
      status: parseInt(form.quantity) === 0 ? "out-of-stock" : form.status,
      quantity: parseInt(form.quantity) || 0,
      featured: form.featured,
      new_arrival: form.new_arrival,
    };

    try {
      const url = isEdit ? `/api/products/${initial!.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast(isEdit ? "Product updated!" : "Product saved!");
      setTimeout(() => router.push("/admin/products"), 1000);
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Shared field style
  const field =
    "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4a853]/60 focus:ring-1 focus:ring-[#d4a853]/20 transition-all";

  return (
    <div className="flex gap-6 items-start">
      {/* ── Left column ── */}
      <div className="flex-1 space-y-5 min-w-0">

        {/* Product Info */}
        <Card title="Product Information">
          <div className="space-y-4">
            <Field label="Product Name" required>
              <input className={field} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Apex Crimson Hoodie" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
               <Field label="Category" required>
                 <div className="space-y-3">
                   <select className={field} value={form.category} onChange={e => set("category", e.target.value)}>
                     <option value="">Select Category</option>
                     {CATEGORIES.map(g => (
                       <optgroup key={g.group} label={g.group}>
                         {g.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                       </optgroup>
                     ))}
                   </select>
                   <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">OR</span>
                     <input 
                       className={`${field} pl-10`} 
                       placeholder="Enter custom category..." 
                       value={form.customCategory || ""} 
                       onChange={e => set("customCategory", e.target.value)} 
                     />
                   </div>
                 </div>
               </Field>
               <Field label="Price (₹)" required>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
                  <input className={`${field} pl-7`} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="1999" />
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Original Price (₹)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
                  <input className={`${field} pl-7`} type="number" value={form.original_price} onChange={e => set("original_price", e.target.value)} placeholder="2499" />
                </div>
              </Field>
               <Field label="SKU / Product Code">
                 <input className={field} value={form.sku} onChange={e => set("sku", e.target.value)} placeholder="TRZ-001" />
               </Field>
               <Field label="Stock Quantity" required>
                 <input className={field} type="number" value={form.quantity} onChange={e => set("quantity", e.target.value)} placeholder="0" />
               </Field>
             </div>
            <Field label="Description" required>
              <textarea className={`${field} resize-none`} rows={4} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Fabric, fit, style inspiration, care instructions..." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Material / Fabric">
                <input className={field} value={form.material} onChange={e => set("material", e.target.value)} placeholder="100% Premium Cotton, 180 GSM" />
              </Field>
              <Field label="Fit Type">
                <select className={field} value={form.fit} onChange={e => set("fit", e.target.value)}>
                  <option value="">Select Fit</option>
                  {["Oversized", "Regular", "Slim", "Relaxed", "Skinny"].map(f => (
                    <option key={f} value={f.toLowerCase()}>{f} Fit</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </Card>

        {/* Sizes */}
        <Card title="Available Sizes" subtitle="Select all sizes this product comes in">
          <div className="flex flex-wrap gap-2 mb-4">
            {STD_SIZES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  sizes.includes(s)
                    ? "bg-[#d4a853] border-[#d4a853] text-black"
                    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className={`${field} max-w-[200px]`}
              value={customSize}
              onChange={e => setCustomSize(e.target.value)}
              placeholder="Custom size (e.g. 32)"
              onKeyDown={e => e.key === "Enter" && addCustomSize()}
            />
            <button type="button" onClick={addCustomSize} className="px-4 py-2 bg-white/5 border border-white/10 text-white/70 text-sm rounded-xl hover:bg-white/10 transition-colors">
              + Add
            </button>
          </div>
          {sizes.filter(s => !STD_SIZES.includes(s)).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {sizes.filter(s => !STD_SIZES.includes(s)).map(s => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1 bg-[#d4a853]/10 text-[#d4a853] text-xs rounded-lg">
                  {s}
                  <button onClick={() => setSizes(prev => prev.filter(x => x !== s))} className="text-[#d4a853]/50 hover:text-[#d4a853]">×</button>
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Colors */}
        <Card title="Color Variants" subtitle="Add every color option available">
          <div className="flex flex-wrap gap-2 mb-4">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-sm">
                <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: c.hex }} />
                <span className="text-white/80">{c.name}</span>
                <button onClick={() => removeColor(i)} className="text-white/20 hover:text-red-400 ml-1 transition-colors">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2 p-1 bg-[#1a1a1a] border border-white/10 rounded-xl">
              <input type="color" value={colorHex} onChange={e => setColorHex(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
            </div>
            <input className={`${field} flex-1 min-w-[140px]`} value={colorName} onChange={e => setColorName(e.target.value)} placeholder="Color name (e.g. Jet Black)" onKeyDown={e => e.key === "Enter" && addColor()} />
            <button type="button" onClick={addColor} className="px-4 py-2 bg-white/5 border border-white/10 text-white/70 text-sm rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap">
              + Add Color
            </button>
          </div>
        </Card>

        {/* Tags */}
        <Card title="Tags" subtitle="Help customers discover this product">
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(t => (
              <span key={t} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-white/70 text-xs rounded-lg">
                #{t}
                <button onClick={() => removeTag(t)} className="text-white/20 hover:text-red-400 transition-colors">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <input
              className={`${field} flex-1`}
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="e.g. oversized, streetwear, summer"
              onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
            />
            <button type="button" onClick={() => addTag()} className="px-4 py-2 bg-white/5 border border-white/10 text-white/70 text-sm rounded-xl hover:bg-white/10 transition-colors">
              + Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-white/20 uppercase tracking-wider">Suggestions:</span>
            {TAG_SUGGESTIONS.filter(t => !tags.includes(t)).map(t => (
              <button key={t} type="button" onClick={() => addTag(t)} className="px-2.5 py-1 bg-transparent border border-white/10 text-white/40 text-xs rounded-lg hover:border-[#d4a853]/40 hover:text-[#d4a853] transition-all">
                {t}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Right column ── */}
      <div className="w-[300px] shrink-0 space-y-5">
        {/* Images */}
        <Card title="Product Images" subtitle="Upload up to 6 images. First is cover.">
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging ? "border-[#d4a853] bg-[#d4a853]/5" : "border-white/10 hover:border-white/20"
            }`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <input ref={fileRef} type="file" multiple accept="image/*" hidden onChange={e => processFiles(e.target.files)} />
            <svg className="w-10 h-10 text-white/15 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <p className="text-sm text-white/40">Drag & drop or <span className="text-[#d4a853]">browse</span></p>
            <p className="text-xs text-white/20 mt-1">PNG, JPG, WEBP — max 5MB</p>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover rounded-lg" />
                  {i === 0 && <span className="absolute top-1 left-1 bg-[#d4a853] text-black text-[9px] font-bold px-1.5 py-0.5 rounded">COVER</span>}
                  <button
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white/70 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Status */}
        <Card title="Status & Visibility">
          <div className="space-y-4">
            <Field label="Visibility">
              <select className={field} value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </Field>
            <Field label="Gender">
              <select className={field} value={form.gender} onChange={e => set("gender", e.target.value)}>
                <option value="unisex">Unisex</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </Field>
            <Toggle label="Featured Product" value={form.featured} onChange={v => set("featured", v)} />
            <Toggle label="New Arrival Badge" value={form.new_arrival} onChange={v => set("new_arrival", v)} />
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#d4a853] text-black font-semibold text-sm rounded-xl hover:bg-[#e0b96a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
            )}
            {saving ? "Saving…" : isEdit ? "Update Product" : "Save Product"}
          </button>
          <button
            onClick={() => router.push("/admin/products")}
            className="w-full py-2.5 border border-white/10 text-white/50 text-sm rounded-xl hover:bg-white/5 hover:text-white transition-all"
          >
            Discard
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1e1e1e] border border-white/10 text-white text-sm px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-[#d4a853] shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}

// Sub-components
function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-white mb-1">{title}</h2>
      {subtitle && <p className="text-xs text-white/30 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-white/40 font-medium mb-1.5 uppercase tracking-wider">
        {label} {required && <span className="text-[#d4a853]">*</span>}
      </label>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/40 font-medium uppercase tracking-wider">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-[#d4a853]" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
