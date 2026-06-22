// ==========================================
// CONFIGURAZIONE DEL PROFILO
// ==========================================
const config = {
    profilePicture: "https://cdn.discordapp.com/avatars/341653412242259969/7dfd4e98dd56e6e512650cc978425b01.webp?size=1024", 
    username: "Stuporeh",
    bio: "Staff Manager @ discord.gg/vortic",
    
    // Gestione Sfondo (Video o Immagine)
    background: {
        isVideo: true, // true = usa il video, false = usa l'immagine di fallback
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-27739-large.mp4", 
        imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop"  
    },

    // Musica
    music: {
        title: "Babyface - Shiva",
        coverArt: "cover.png", 
        audioUrl: "canzone.mp3" 
    },

    // Bottoni Social (puoi aggiungere quelli che vuoi usando FontAwesome)
    socials: [
        { icon: "fa-github", url: "https://github.com/gabry7878" },
        { icon: "fa-discord", url: "https://discord.gg/vortic" },
        { icon: "fa-instagram", url: "https://instagram.com/stuporeh" },
        { icon: "fa-paypal", url: "https://paypal.me/stuporeh" }
    ]
};

// ==========================================
// LOGICA APPLICATIVA
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Setup Sfondo Dinamico
    const bgContainer = document.getElementById("bg-container");
    const bgVideo = document.getElementById("bg-video");

    if (config.background.isVideo) {
        bgVideo.src = config.background.videoUrl;
        bgVideo.style.display = "block";
    } else {
        bgVideo.removeAttribute("src");
        bgVideo.style.display = "none";
        bgContainer.style.backgroundImage = `url('${config.background.imageUrl}')`;
        bgContainer.style.backgroundSize = "cover";
        bgContainer.style.backgroundPosition = "center";
    }

    // 2. Setup Dati Profilo e Musica
    document.getElementById("profile-img").src = config.profilePicture;
    document.getElementById("username").textContent = config.username;
    document.getElementById("bio").textContent = config.bio;
    document.getElementById("album-cover").src = config.music.coverArt;
    document.getElementById("song-title").textContent = config.music.title;
    
    const audio = document.getElementById("bg-music");
    audio.src = config.music.audioUrl;

    // 3. Rendering icone social
    const socialContainer = document.getElementById("social-container");
    config.socials.forEach(social => {
        const link = document.createElement("a");
        link.href = social.url;
        link.target = "_blank";
        link.className = "social-btn";
        link.innerHTML = `<i class="fa-brands ${social.icon}"></i>`;
        socialContainer.appendChild(link);
    });

    // 4. Gestione Elementi Interfaccia
    const entryScreen = document.getElementById("entry-screen");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const playIcon = playPauseBtn.querySelector("i");
    const muteBtn = document.getElementById("mute-btn");
    const muteIcon = muteBtn.querySelector("i");
    const volumeSlider = document.getElementById("volume-slider");
    const progressBar = document.getElementById("progress-bar");
    const currentTimeEl = document.getElementById("current-time");
    const totalTimeEl = document.getElementById("total-time");

    let isPlaying = false;
    let savedVolume = 1;

    // 5. Entry Screen + Autoplay Musica
    entryScreen.addEventListener("click", () => {
        entryScreen.classList.add("hidden");
        
        audio.play().then(() => {
            isPlaying = true;
            playIcon.classList.remove("fa-play");
            playIcon.classList.add("fa-pause");
        }).catch(error => {
            console.log("Autoplay non riuscito:", error);
        });
    });

    // Player Play/Pause
    playPauseBtn.addEventListener("click", () => {
        if (isPlaying) {
            audio.pause();
            playIcon.classList.remove("fa-pause");
            playIcon.classList.add("fa-play");
        } else {
            audio.play();
            playIcon.classList.remove("fa-play");
            playIcon.classList.add("fa-pause");
        }
        isPlaying = !isPlaying;
    });

    // Funzione aggiornamento icona volume
    function updateVolumeIcon(isMutedOrZero) {
        if (isMutedOrZero) {
            muteIcon.classList.remove("fa-volume-high");
            muteIcon.classList.add("fa-volume-xmark");
        } else {
            muteIcon.classList.remove("fa-volume-xmark");
            muteIcon.classList.add("fa-volume-high");
        }
    }

    // Tasto Muto generale
    muteBtn.addEventListener("click", () => {
        if (audio.muted || audio.volume === 0) {
            audio.muted = false;
            if (savedVolume === 0) savedVolume = 0.5;
            audio.volume = savedVolume;
            volumeSlider.value = savedVolume;
            updateVolumeIcon(false);
        } else {
            savedVolume = audio.volume;
            audio.muted = true;
            volumeSlider.value = 0;
            updateVolumeIcon(true);
        }
    });

    // Slider Volume
    volumeSlider.addEventListener("input", (e) => {
        const currentVal = parseFloat(e.target.value);
        audio.volume = currentVal;
        
        if (currentVal === 0) {
            audio.muted = true;
            updateVolumeIcon(true);
        } else {
            audio.muted = false;
            savedVolume = currentVal;
            updateVolumeIcon(false);
        }
    });

    // Barra avanzamento traccia (Sincronizzazione e click)
    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progressPercent;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener("loadedmetadata", () => {
        totalTimeEl.textContent = formatTime(audio.duration);
    });

    progressBar.addEventListener("input", (e) => {
        if (audio.duration) {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
    });

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }
});