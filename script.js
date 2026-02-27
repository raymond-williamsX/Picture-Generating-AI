const BACKEND_URL = "https://picture-generating-ai-9dhk.onrender.com";
const promptForm = document.getElementById("promptForm");
const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loader = document.getElementById("loader");
const imageEl = document.getElementById("resultImage");

let currentImageSrc = "";

async function generateImage(prompt) {
  if (!prompt) throw new Error("Prompt required");

  const res = await fetch(`${BACKEND_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    timeout: 130000, // 2+ minutes to match server timeout
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  const { image } = await res.json();
  return image;
}

async function handleGenerate() {
  const prompt = promptInput.value.trim();

  loader.style.display = "block";
  imageEl.style.display = "none";
  downloadBtn.style.display = "none";
  downloadBtn.disabled = true;
  generateBtn.disabled = true;

  try {
    if (!prompt) {
      alert("Please enter a prompt");
      loader.style.display = "none";
      generateBtn.disabled = false;
      return false;
    }

    const base64 = await generateImage(prompt);
    loader.style.display = "none";
    generateBtn.disabled = false;

    if (base64) {
      currentImageSrc = `data:image/png;base64,${base64}`;
      imageEl.src = currentImageSrc;
      imageEl.style.display = "block";
      downloadBtn.style.display = "inline-block";
      downloadBtn.disabled = false;
    }
  } catch (err) {
    loader.style.display = "none";
    generateBtn.disabled = false;
    console.error(err);
    alert("Error: " + (err.message || err));
  }
  return false;
}

promptForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleGenerate();
});

downloadBtn.addEventListener("click", () => {
  if (!currentImageSrc) return;

  const link = document.createElement("a");
  link.href = currentImageSrc;
  link.download = `ai-image-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
