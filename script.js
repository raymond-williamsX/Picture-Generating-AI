const BACKEND_URL = "https://picture-generating-ai-9dhk.onrender.com";

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

document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("promptInput").value.trim();
  const loader = document.getElementById("loader");
  const imageEl = document.getElementById("resultImage");

  loader.style.display = "block";
  imageEl.style.display = "none";

  try {
    if (!prompt) {
      alert("Please enter a prompt");
      loader.style.display = "none";
      return;
    }

    const base64 = await generateImage(prompt);
    loader.style.display = "none";

    if (base64) {
      imageEl.src = `data:image/png;base64,${base64}`;
      imageEl.style.display = "block";
    }
  } catch (err) {
    loader.style.display = "none";
    console.error(err);
    alert("Error: " + (err.message || err));
  }
});
