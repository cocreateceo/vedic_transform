"""Base class for TTS engines - Abstract interface"""
from abc import ABC, abstractmethod
from pathlib import Path
import hashlib


class TTSEngineBase(ABC):
    """Abstract base class for TTS engines"""

    def __init__(self, voice_file: str):
        """Initialize TTS engine with voice reference

        Args:
            voice_file: Path to reference voice audio file
        """
        self.voice_file = voice_file
        self.sample_rate = None

    @abstractmethod
    def synthesize(self, text: str):
        """Generate speech from text

        Args:
            text: Text to convert to speech

        Returns:
            tuple: (audio_numpy, sample_rate)
        """
        pass

    @abstractmethod
    def synthesize_to_file(self, text: str, output_path: str):
        """Generate speech and save to file

        Args:
            text: Text to convert to speech
            output_path: Path to save WAV file

        Returns:
            str: Path to saved file
        """
        pass

    def synthesize_streaming(self, text: str):
        """Generate audio in chunks for streaming (optional)

        Args:
            text: Text to convert to speech (already cleaned, no punctuation)

        Yields:
            dict: Chunk info with audio data
        """
        import re

        # Split by SMALL word count for FAST first audio
        # 8-10 words = ~2-3 second generation time (FAST!)
        words = text.split()
        chunk_size = 8  # Small chunks for speed!
        optimized_chunks = []

        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk.strip():
                optimized_chunks.append(chunk.strip())

        if not optimized_chunks:
            return

        print(f"🎬 Streaming {len(optimized_chunks)} chunks (optimized for speed)...")

        for i, chunk in enumerate(optimized_chunks):
            is_last = (i == len(optimized_chunks) - 1)

            print(f"  [{i+1}/{len(optimized_chunks)}] Generating: {chunk[:50]}...")

            # Generate audio for this chunk (already clean, no punctuation)
            audio, sample_rate = self.synthesize(chunk)

            yield {
                'chunk_index': i,
                'total_chunks': len(optimized_chunks),
                'audio': audio,
                'sample_rate': sample_rate,
                'text': chunk,
                'is_last': is_last
            }

    @staticmethod
    def get_cache_key(text: str) -> str:
        """Generate cache key from text

        Args:
            text: Input text

        Returns:
            str: MD5 hash of text
        """
        return hashlib.md5(text.encode()).hexdigest()


class AudioCache:
    """File-based audio cache (shared by all TTS engines)"""

    def __init__(self, cache_dir='cache'):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        print(f"📦 Cache directory: {self.cache_dir}")

    def get(self, key):
        """Get cached audio file"""
        cache_file = self.cache_dir / f"{key}.wav"
        if cache_file.exists():
            print(f"📦 Cache HIT: {key[:16]}...")
            return str(cache_file)
        return None

    def set(self, key, audio_path):
        """Save audio to cache"""
        cache_file = self.cache_dir / f"{key}.wav"
        import shutil
        shutil.copy(audio_path, cache_file)
        print(f"💾 Cached: {key[:16]}...")
