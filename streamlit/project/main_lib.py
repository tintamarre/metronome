import os
import glob

named_bpm = {
    'largo': [40, 58],
    'larghetto': [58, 63],
    'adagio': [63, 72],
    'andante': [72, 104],
    'moderato': [104, 116],
    'allegro': [116, 160],
    'presto': [160, 192],
    'prestissimo': [192, 216]
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

