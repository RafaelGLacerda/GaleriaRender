
const videoList = document.getElementById("video-list");
const searchInput = document.getElementById("search");
const uploadForm = document.getElementById("upload-form");

function renderVideos(videos, filter = "") {
  videoList.innerHTML = "";
  videos.forEach(video => {
    if (video.toLowerCase().includes(filter.toLowerCase())) {
      const videoEl = document.createElement("video");
      videoEl.src = `/videos/${video}`;
      videoEl.controls = true;
      videoList.appendChild(videoEl);
    }
  });
}

// Busca vídeos ao digitar
searchInput.addEventListener("input", (e) => {
  fetchVideos(e.target.value);
});

// Faz upload do vídeo
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);
  const res = await fetch('/upload', {
    method: 'POST',
    body: formData
  });
  if (res.ok) {
    alert("Vídeo enviado com sucesso!");
    uploadForm.reset();
    fetchVideos();
  } else {
    alert("Erro ao enviar o vídeo.");
  }
});

// Busca lista de vídeos
async function fetchVideos(filter = "") {
  const res = await fetch('/api/videos');
  const videos = await res.json();
  renderVideos(videos, filter);
}

// Inicializa
fetchVideos();
