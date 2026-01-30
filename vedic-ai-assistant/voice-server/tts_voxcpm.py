"""VoxCPM Engine - High-quality voice cloning with VoxCPM"""
import scipy.io.wavfile
import numpy as np
import time
from tts_base import TTSEngineBase


class VoxCPMEngine(TTSEngineBase):
    """Wrapper for VoxCPM with voice cloning"""

    def __init__(self, voice_file, prompt_text=None, model_version="1.5"):
        """Initialize with your cloned voice

        Args:
            voice_file: Path to reference voice audio file
            prompt_text: Transcript of the reference audio (required for VoxCPM)
            model_version: "1.5" (800M params, 44.1kHz) or "0.5B" (640M params, 16kHz)
        """
        super().__init__(voice_file)

        try:
            from voxcpm import VoxCPM
        except ImportError:
            raise ImportError(
                "VoxCPM not installed. Install with: pip install voxcpm"
            )

        self.prompt_text = prompt_text
        if not self.prompt_text:
            print("⚠️  WARNING: No prompt_text provided. VoxCPM works best with reference transcript.")
            print("   Using generic placeholder. For better quality, provide the actual transcript.")
            self.prompt_text = "Welcome to CROPION AI assistant"

        # Model selection
        model_name = f"openbmb/VoxCPM{model_version}"
        print(f"🔄 Loading VoxCPM model: {model_name}...")
        start = time.time()
        self.model = VoxCPM.from_pretrained(model_name)
        print(f"✅ Model loaded in {time.time()-start:.1f}s")

        print(f"🔄 Setting voice reference: {voice_file}")
        print(f"📝 Reference text: '{self.prompt_text}'")
        self.sample_rate = 44100 if model_version == "1.5" else 16000
        print(f"📊 Sample rate: {self.sample_rate} Hz")

    def synthesize(self, text):
        """Generate speech from text

        Args:
            text: Text to convert to speech

        Returns:
            tuple: (audio_numpy, sample_rate)
        """
        # VoxCPM returns audio as numpy array
        audio_numpy = self.model.generate(
            text=text,
            prompt_wav_path=self.voice_file,
            prompt_text=self.prompt_text
        )

        # Ensure proper format (float32 or int16)
        if audio_numpy.dtype == np.float32 or audio_numpy.dtype == np.float64:
            # Convert float to int16 for WAV compatibility
            audio_numpy = (audio_numpy * 32767).astype(np.int16)

        return audio_numpy, self.sample_rate

    def synthesize_to_file(self, text, output_path):
        """Generate and save to WAV file

        Args:
            text: Text to convert to speech
            output_path: Path to save WAV file

        Returns:
            str: Path to saved file
        """
        print(f"🔊 Generating (VoxCPM): {text[:50]}...")
        start = time.time()
        audio, sample_rate = self.synthesize(text)
        scipy.io.wavfile.write(output_path, sample_rate, audio)
        duration = time.time() - start
        print(f"✅ Generated in {duration:.2f}s (RTF: {duration/len(text)*100:.2f})")
        return output_path

    def synthesize_streaming(self, text):
        """
        VoxCPM streaming implementation (if supported)
        Falls back to sentence-by-sentence generation
        """
        # Check if VoxCPM has native streaming support
        if hasattr(self.model, 'generate_streaming'):
            # Use native streaming if available
            for chunk in self.model.generate_streaming(
                text=text,
                prompt_wav_path=self.voice_file,
                prompt_text=self.prompt_text
            ):
                yield chunk
        else:
            # Fall back to base class sentence-by-sentence
            yield from super().synthesize_streaming(text)
