import os
import glob

named_bpm = {
    'Largo': [40, 58],
    'Larghetto': [58, 63],
    'Adagio': [63, 72],
    'Andante': [72, 104],
    'Moderato': [104, 116],
    'Allegro': [116, 160],
    'Presto': [160, 192],
    'Prestissimo': [192, 216]
}

def get_bpm_name(bpm):
    for key in named_bpm:
        if bpm >= named_bpm[key][0] and bpm <= named_bpm[key][1]:
            return key
    return ""


def get_milliseconds(bpm):
    # 60 seconds in a minute
    # x bpm = x beats per minute
    # 60 / x = 1 beat per x seconds
    # count number of milliseconds between beats
    return 60 / bpm * 1000

