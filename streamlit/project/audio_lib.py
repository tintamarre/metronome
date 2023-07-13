import numpy as np
import scipy.io.wavfile


class BeepGenerator:
    def __init__(self):
        # Audio will contain a long list of samples (i.e. floating point numbers describing the
        # waveform).  If you were working with a very long sound you'd want to stream this to
        # disk instead of buffering it all in memory list this.  But most sounds will fit in 
        # memory.
        self.audio = []
        self.sample_rate = 44100.0

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
        for i in range(beats):
            if i == 0:
                vol = 1
                freq = 880.0
            else:
                vol = 0.7
                freq = 440.0
            self.append_sinewave(volume=vol, duration_milliseconds=50, freq=freq)
            self.append_silence(duration_milliseconds=ms - 50)
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