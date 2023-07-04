
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioElement = document.getElementById("audio");
  const audioSource = audioContext.createMediaElementSource(audioElement);
  const gainNode = audioContext.createGain();

  // Connect the audio source to the gain node
  audioSource.connect(gainNode);

  // Connect the gain node to the audio context's destination (speakers)
  gainNode.connect(audioContext.destination);

  // Control the audio playback
  const stopButton = document.querySelector(".stop");
  const playButton = document.querySelector(".play");

  stopButton.addEventListener("click", () => {
    gainNode.gain.value = 0; // Set the gain to 0 to stop the audio
  });

  playButton.addEventListener("click", () => {
    gainNode.gain.value = 1; // Set the gain to 1 to play the audio
  });
