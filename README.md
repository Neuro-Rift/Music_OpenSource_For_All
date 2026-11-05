# 🎵 Music (Liquid Studio Edition)

> **Next-Generation Audiophile Mobile Music Player & Real-Time DSP Studio**  
> Built with React 19, TypeScript, Capacitor, and an 8-Stage Real-Time DSP Audio Engine.

![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-blue?style=for-the-badge&logo=android)
![Version](https://img.shields.io/badge/Version-1.0.0-purple?style=for-the-badge)
![Author](https://img.shields.io/badge/Author-Neuro--Rift-fuchsia?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

---

## 🌟 Overview

**Music (Liquid Studio Edition)** is an audiophile music player created by **Neuro-Rift**. It combines high-end audio engineering with a glassmorphic aesthetic (`backdrop-filter: blur(36px)`), specular borders, and dynamic ambient lighting.

The application fuses four open-source audio and design repositories into a single mobile portrait experience:

1. **[Audiofy](https://github.com/Zakir-Sheikh/Audiofy)**: Signature Now Playing card design, 33 RPM spinning vinyl disc dynamo, live equalizing wave bars, mini-timeline scrubbing, and an expandable full-screen studio console.
2. **[mucke](https://github.com/mucke-music/mucke)**: Obsidian/violet design language (`#141216`, `#1e1b21`, `#913af1`), curated color gradients (*Sanguine, Oceanblue, Lime, Purplelake, Kashmir*), and non-clipping typography.
3. **[RootlessJamesDSP](https://github.com/thepbone/RootlessJamesDSP)**: Core DSP algorithms, Squig Live AutoEQ curve matching, impulse response room convolver, and Linkwitz-Bauer stereo crossfeed.
4. **[elovaire-music](https://github.com/elovaire/elovaire-music)**: Real-time audio processing pipeline architecture, soft-knee lookahead limiter, dynamic headroom, and low-latency biquad filters.

---

## 🎛️ Master Sound Controller (8-Stage DSP Engine)

A dedicated, real-time audio suite powered by Web Audio API and Media3 DSP architectures:

| # | DSP Module | Algorithm & Functionality |
|---|---|---|
| **1** | **Loudness Correction** | Dynamic Fletcher-Munson & ISO 226 equal-loudness contouring with sub-bass and air-band boost at low listening volumes. |
| **2** | **Voice Isolation** | Mid/Side (M/S) matrix processing for center vocal isolation or vocal attenuation (Karaoke mode). |
| **3** | **Acoustic Measurement** | Room impulse response convolution and Linkwitz-Bauer crossfeed to eliminate headphone listening fatigue. |
| **4** | **Squig Live AutoEQ** | Parametric 5-band biquad filter targeting industry curves: **Harman 2019**, **Diffuse Field**, **IEF Neutral**, **Rtings**, and **Crinacle**. |
| **5** | **Harmonic Expander** | Vacuum tube triode simulation using non-linear `tanh(x)` polynomial waveshaping for 2nd and 3rd order analog warmth. |
| **6** | **NOS R2R Simulator** | Non-oversampling discrete resistor ladder simulation featuring sinc high-frequency droop and zero-interpolation step emulation. |
| **7** | **Smooth Volume** | EBU R128 dynamic leveler paired with a soft-knee lookahead peak limiter to eliminate harsh transients. |
| **8** | **Device Presets** | One-touch calibrated profiles for **Bluetooth Headphones**, **In-Ear Monitors (IEMs)**, **Open-Back Audiophile**, **Phone Speaker**, **USB DAC**, and **Car Audio**. |

---

## ✨ Key Features

- **Liquid Glass Floating Player**:
  - Floats with a deliberate 14px airy glass gap above the bottom navigation bar.
  - Realistic vinyl record with microgrooves, center artwork label, and 33 RPM spin physics.
  - Direct mini-scrubbing on the bottom gradient edge without expanding the console.
  - Touch gestures: swipe left/right to change tracks, swipe up to open the studio console.
- **Full-Screen Audiofy Studio Console**:
  - 40-bar real-time Canvas Spectrum Analyzer driven by Web Audio FFT.
  - 4 inline quick-toggle DSP chips (*Loudness, Voice Iso, Tube Saturation, NOS R2R*).
  - Playback speed controls (0.8x, 1.0x, 1.25x, 1.5x) and shuffle/repeat modes.
- **Customizable Application Icon**:
  - Defaults to `images.jpg`.
  - In-app icon customizer allows selecting any local image (PNG/JPG/SVG) with instant UI and browser favicon synchronization.
- **Curated Music Library**:
  - Mucke *Album of the Day* hero banner.
  - 2-Column responsive album grid with lossless format badges.
  - Numbered song tracks with live equalizer indicator on the active song.
  - Local audio file picker (`.mp3`, `.flac`, `.wav`, `.aac`) with instant playback.

---

## 📱 Mobile Portrait Layout

The app is built to run natively in portrait mode on Android devices while providing a realistic mobile preview shell when run in desktop web browsers:
- Standard Android status bar (5G, battery, Wi-Fi, time).
- Selfie camera punch-hole and speaker earpiece.
- Sleek floating glass navigation capsule (*Library, Songs, Albums, DSP Suite, Settings*).
- Bottom Android gesture bar with 240px (`pb-60`) scroll clearance.

---

## 🛠️ Tech Stack

- **UI / Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Build Tool**: Vite 8.
- **Mobile Engine**: Capacitor 6 (Android native bridge).
- **Audio DSP**: Web Audio API (`AudioContext`, `BiquadFilterNode`, `WaveShaperNode`, `ConvolverNode`, `DynamicsCompressorNode`, `AnalyserNode`).
- **CI / CD**: GitHub Actions (`ubuntu-latest`, Temurin JDK 21, Gradle 8.14, `softprops/action-gh-release`).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [Java Development Kit (JDK) 21](https://adoptium.net/) (for building Android APK)
- [Android SDK / Android Studio](https://developer.android.com/studio) (optional, for device debugging)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Music.git
cd Music
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Web Prototype

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

### 4. Build Production Web Assets

```bash
npm run build
```

---

## 📦 Building the Android APK

The repository includes a configured native Android Gradle project in `./android`.

### Fast Build via Command Line:

```bash
# 1. Compile web assets and sync to native Android container
npm run android:sync

# 2. Compile debug APK using Gradle wrapper
cd android
./gradlew assembleDebug       # Linux / macOS
.\gradlew.bat assembleDebug   # Windows PowerShell
```

The generated APK will be available at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🤖 Automated CI/CD (GitHub Actions)

This repository includes an automated build-and-release pipeline in [`.github/workflows/release.yml`](.github/workflows/release.yml).

To automatically trigger a build and publish a GitHub Release with the APK attached:

```bash
# 1. Commit your changes
git add .
git commit -m "feat: release version 1.0.0"

# 2. Create an annotated release tag matching 'v*'
git tag -a v1.0.0 -m "Release v1.0.0"

# 3. Push to GitHub
git push origin main
git push origin v1.0.0
```

GitHub Actions will check out the code, set up JDK 21 with Gradle caching, build the APK, and publish it under **Releases**.

---

## 👥 Authors & Contributors

- **Lead Author & System Architect**: **Neuro-Rift**
- **Foundational Repositories & Contributors**:
  - **[RootlessJamesDSP](https://github.com/thepbone/RootlessJamesDSP)** – DSP core algorithms, AutoEQ client, and acoustic measurement.
  - **[elovaire-music](https://github.com/elovaire/elovaire-music)** – Media3 realtime AudioProcessor pipeline and dynamic headroom architecture.
  - **[Audiofy](https://github.com/Zakir-Sheikh/Audiofy)** – Now Playing card design, vinyl disc dynamo, and visualizer bars.
  - **[mucke](https://github.com/mucke-music/mucke)** – Obsidian/violet theme, custom color gradients, and typography.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
