import numpy as np
import scipy.io.wavfile


class BeepGenerator:
    def __init__(self):
        # Audio will contain a long list of samples (i.e. floating point numbers describing the
        # waveform).  If you were working with a very long sound you'd want to stream this to
        # disk instead of buffering it all in memory list this.  But most sounds will fit in 
        # memory.
        self.audio = []
        self.sample_rate = 44100.0  # CD quality for better click sounds

    def append_silence(self, duration_milliseconds=500):
        """
        Adding silence is easy - we add zeros to the end of our array
        """
        num_samples = duration_milliseconds * (self.sample_rate / 1000.0)

        for x in range(int(num_samples)):
            self.audio.append(0.0)

        return

    def append_sinewave(
            self,
            freq=440.0,
            duration_milliseconds=500,
            volume=1.0):
        """
        The sine wave generated here is the standard beep.  If you want something
        more aggressive you could try a square or saw tooth waveform.   Though there
        are some rather complicated issues with making high quality square and
        sawtooth waves... which we won't address here :)
        """

        num_samples = duration_milliseconds * (self.sample_rate / 1000.0)

        x = np.array([i for i in range(int(num_samples))])

        sine_wave = volume * np.sin(2 * np.pi * freq * (x / self.sample_rate))

        self.audio.extend(list(sine_wave))
        return

    def append_click(self, duration_milliseconds=30, volume=1.0, is_accent=False):
        """
        Generates a realistic mechanical metronome click sound.
        Uses a combination of:
        - Sharp attack with exponential decay
        - Multiple frequency components for wooden/mechanical character
        - Filtered noise for the percussive "knock" quality
        """
        num_samples = int(duration_milliseconds * (self.sample_rate / 1000.0))
        t = np.arange(num_samples) / self.sample_rate

        # Exponential decay envelope (fast attack, quick decay)
        decay_rate = 150 if is_accent else 200
        envelope = np.exp(-decay_rate * t)

        # Primary click frequencies (wood-like resonance)
        if is_accent:
            # Higher, brighter accent click
            freqs = [1800, 2400, 3200, 4000]
            weights = [1.0, 0.6, 0.3, 0.15]
        else:
            # Lower, softer regular click
            freqs = [1200, 1800, 2400, 3000]
            weights = [1.0, 0.5, 0.25, 0.1]

        # Generate tonal components
        click = np.zeros(num_samples)
        for freq, weight in zip(freqs, weights):
            click += weight * np.sin(2 * np.pi * freq * t)

        # Add subtle noise burst for realistic attack
        noise = np.random.uniform(-0.3, 0.3, num_samples)
        noise_envelope = np.exp(-300 * t)  # Very fast decay for noise
        click += noise * noise_envelope

        # Apply main envelope
        click = click * envelope

        # Normalize and apply volume
        click = click / np.max(np.abs(click)) * volume

        self.audio.extend(list(click))
        return

    def append_sinewaves(
            self,
            freqs=[440.0],
            duration_milliseconds=500,
            volumes=[1.0]):
        """
        The sine wave generated here is the standard beep.  If you want something
        more aggressive you could try a square or saw tooth waveform.   Though there
        are some rather complicated issues with making high quality square and
        sawtooth waves... which we won't address here :)
        len(freqs) must be the same as len(volumes)
        """

        volumes = list(np.array(volumes)/sum(volumes))
        num_samples = duration_milliseconds * (self.sample_rate / 1000.0)
        x = np.array([i for i in range(int(num_samples))])

        first_it = True
        for volume, freq in zip(volumes, freqs):
            print(freq)
            if first_it:
                sine_wave = volume * np.sin(2 * np.pi * freq * (x / self.sample_rate))
                first_it = False
            else:
                sine_wave += volume * np.sin(2 * np.pi * freq * (x / self.sample_rate))

        self.audio.extend(list(sine_wave))
        return

    def save_wav(self, file_name):
        # Open up a wav file
        # wav params

        # 44100 is the industry standard sample rate - CD quality.  If you need to
        # save on file size you can adjust it downwards. The standard for low quality
        # is 8000 or 8kHz.

        # WAV files here are using short, 16 bit, signed integers for the 
        # sample size.  So we multiply the floating point data we have by 32767, the
        # maximum value for a short integer.  NOTE: It is theoretically possible to
        # use the floating point -1.0 to 1.0 data directly in a WAV file but not
        # obvious how to do that using the wave module in python.
        self.audio = np.array(self.audio).astype(np.float32)
        scipy.io.wavfile.write(file_name, int(self.sample_rate), np.array(self.audio))

        return
    
    def generate_beep(self, ms, beats):
        click_duration = 30  # Short, percussive click
        for i in range(beats):
            is_accent = (i == 0)  # First beat is accented
            vol = 1.0 if is_accent else 0.8
            self.append_click(duration_milliseconds=click_duration, volume=vol, is_accent=is_accent)
            self.append_silence(duration_milliseconds=ms - click_duration)
        self.save_wav("./tmp/output.wav")

        return



if __name__ == "__main__":
    bg = BeepGenerator()
    bg.append_sinewave(volume=1, duration_milliseconds=100)
    bg.append_silence()
    bg.append_sinewave(volume=0.5, duration_milliseconds=700)
    bg.append_silence()
    bg.append_sinewaves(volumes=[1, 1], duration_milliseconds=700, freqs=[880, 660])
    bg.append_silence()
    bg.save_wav("output.wav")