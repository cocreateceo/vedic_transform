"""TTS Engine Factory - Creates the appropriate TTS engine based on config"""
from config import Config


def create_tts_engine():
    """
    Factory function to create the configured TTS engine

    Returns:
        TTSEngineBase: Instance of the configured TTS engine
    """
    engine_type = Config.TTS_ENGINE.lower()

    if engine_type == 'pocket_tts':
        print(f"🎤 Using: Pocket TTS (100M params, 24kHz)")
        from tts_pocket import PocketTTSEngine
        return PocketTTSEngine(
            voice_file=Config.VOICE_FILE,
            hf_token=Config.HF_TOKEN
        )

    elif engine_type == 'voxcpm':
        print(f"🎤 Using: VoxCPM {Config.VOXCPM_MODEL_VERSION} (800M params, 44.1kHz)")
        from tts_voxcpm import VoxCPMEngine
        return VoxCPMEngine(
            voice_file=Config.VOICE_FILE,
            prompt_text=Config.VOXCPM_PROMPT_TEXT,
            model_version=Config.VOXCPM_MODEL_VERSION
        )

    else:
        raise ValueError(
            f"Unknown TTS engine: {Config.TTS_ENGINE}. "
            f"Valid options: 'pocket_tts', 'voxcpm'"
        )


def get_engine_info():
    """Get information about the current TTS engine

    Returns:
        dict: Engine information
    """
    engine_type = Config.TTS_ENGINE.lower()

    if engine_type == 'pocket_tts':
        return {
            'name': 'Pocket TTS',
            'params': '100M',
            'sample_rate': '24kHz',
            'license': 'Requires HuggingFace Auth',
            'voice_file': Config.VOICE_FILE
        }
    elif engine_type == 'voxcpm':
        sample_rate = '44.1kHz' if Config.VOXCPM_MODEL_VERSION == '1.5' else '16kHz'
        params = '800M' if Config.VOXCPM_MODEL_VERSION == '1.5' else '640M'
        return {
            'name': f'VoxCPM {Config.VOXCPM_MODEL_VERSION}',
            'params': params,
            'sample_rate': sample_rate,
            'license': 'Apache-2.0',
            'voice_file': Config.VOICE_FILE,
            'prompt_text': Config.VOXCPM_PROMPT_TEXT
        }
    else:
        return {'name': 'Unknown', 'error': 'Invalid engine type'}
