const BACKEND_URL = "https://picture-generating-ai.onrender.com"; // update with your actual Render URL

async function generateImage(prompt) {
  const res = await fetch(`${BACKEND_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const { image } = await res.json();
  return image;
}

document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("promptInput").value.trim();
  const loader = document.getElementById("loader");
  const imageEl = document.getElementById("resultImage");

  loader.style.display = "block";
  imageEl.style.display = "none";

  const base64 = await generateImage(prompt);

  loader.style.display = "none";
  if (base64) {
    imageEl.src = `data:image/png;base64,${base64}`;
    imageEl.style.display = "block";
  }
});
