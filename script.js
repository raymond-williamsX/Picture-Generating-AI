const API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";
const API_KEY = "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";

async function query(data) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: data })
    });

    if (!response.ok) {
        alert("Error generating image.");
        return null;
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

document.getElementById("generateBtn").addEventListener("click", async () => {
    const prompt = document.getElementById("promptInput").value.trim();
    const loader = document.getElementById("loader");
    const image = document.getElementById("resultImage");

    if (!prompt) {
        alert("Please type a prompt");
        return;
    }

    loader.style.display = "block";
    image.style.display = "none";

    const imageUrl = await query(prompt);

    loader.style.display = "none";

    if (imageUrl) {
        image.src = imageUrl;
        image.style.display = "block";
    }
});
