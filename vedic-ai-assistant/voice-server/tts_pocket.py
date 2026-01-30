"""Pocket TTS Engine - Voice cloning with Pocket TTS"""
import scipy.io.wavfile
import time
import os
from tts_base import TTSEngineBase

# Try to import pocket_tts, but don't fail if it's not available
try:
    from pocket_tts import TTSModel
    POCKET_TTS_AVAILABLE = True
except ImportError:
    POCKET_TTS_AVAILABLE = False
    print("⚠️ pocket-tts not available - TTS features will be limited")


class PocketTTSEngine(TTSEngineBase):
    """Wrapper for Pocket TTS with voice cloning"""

    def __init__(self, voice_file, hf_token=None):
        """Initialize with your cloned voice (lazy loading)

        Args:
            voice_file: Path to reference voice audio file
            hf_token: Hugging Face authentication token (optional)
        """
        super().__init__(voice_file)

        if not POCKET_TTS_AVAILABLE:
            print("⚠️ Pocket TTS not available - using fallback mode")
            self.model = None
            self.voice_state = None
            self.sample_rate = 24000
            return

        # Lazy loading: Store config but don't load model yet
        # Model will load on first synthesize() call to avoid Lambda init timeout
        self.hf_token = hf_token
        self.model = None
        self.voice_state = None
        self.sample_rate = 24000
        self._model_loaded = False
        print("✅ Pocket TTS engine initialized (lazy loading enabled)")

    def _ensure_model_loaded(self):
        """Load model on first use (lazy loading to avoid Lambda init timeout)"""
        if self._model_loaded:
            return

        if not POCKET_TTS_AVAILABLE:
            return

        # Set cache directories to /tmp for Lambda (read-only filesystem)
        os.environ['HF_HOME'] = '/tmp/huggingface'
        os.environ['TRANSFORMERS_CACHE'] = '/tmp/huggingface/transformers'
        os.environ['HF_DATASETS_CACHE'] = '/tmp/huggingface/datasets'
        os.environ['TORCH_HOME'] = '/tmp/torch'

        # Set Hugging Face token if provided
        if self.hf_token:
            os.environ['HF_TOKEN'] = self.hf_token
            print(f"🔐 Using Hugging Face authentication")

        print(f"🔄 Loading Pocket TTS model (first use)...")
        start = time.time()
        self.model = TTSModel.load_model()
        print(f"✅ Model loaded in {time.time()-start:.1f}s")

        print(f"🔄 Loading your cloned voice from: {self.voice_file}")
        start = time.time()
        self.voice_state = self.model.get_state_for_audio_prompt(self.voice_file)
        print(f"✅ Voice loaded in {time.time()-start:.1f}s")

        self.sample_rate = self.model.sample_rate
        print(f"📊 Sample rate: {self.sample_rate} Hz")
        self._model_loaded = True

    def synthesize(self, text):
        """Generate speech from text

        Args:
            text: Text to convert to speech

        Returns:
            tuple: (audio_numpy, sample_rate)
        """
        # Load model on first use (lazy loading)
        self._ensure_model_loaded()

        if not self.model:
            print("⚠️ Pocket TTS not available - returning empty audio")
            import numpy as np
            # Return 1 second of silence at 24kHz
            return np.zeros(24000, dtype=np.float32), 24000

        audio_tensor = self.model.generate_audio(self.voice_state, text)
        audio_numpy = audio_tensor.numpy()
        return audio_numpy, self.sample_rate

    def synthesize_to_file(self, text, output_path):
        """Generate and save to WAV file

        Args:
            text: Text to convert to speech
            output_path: Path to save WAV file

        Returns:
            str: Path to saved file
        """
        print(f"🔊 Generating (Pocket TTS): {text[:50]}...")
        start = time.time()
        audio, sample_rate = self.synthesize(text)
        scipy.io.wavfile.write(output_path, sample_rate, audio)
        duration = time.time() - start
        print(f"✅ Generated in {duration:.2f}s")
        return output_path
