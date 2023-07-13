import streamlit as st
import time
import base64

import main_lib as lib
import audio_lib as audio

st.set_page_config(page_title="Metronome")
st.title("Metronome")

st.sidebar.title("Settings")

bpm = st.sidebar.slider("BPM", min_value=40, max_value=208, value=120, step=1)

st.sidebar.write(f"Current BPM: {bpm} (**{lib.get_bpm_name(bpm)}**)")

beats = st.sidebar.slider("Beats", min_value=1, max_value=8, value=4, step=1)

start = st.sidebar.button("Démarrer le métronome")

count = 0

def display_metronome(audio_path, svg_path):
    with open(svg_path, "r") as f:
        svg = f.read()

    with open(audio_path, "rb") as f:
        audio_file = f.read()

    b64_audio = base64.b64encode(audio_file).decode()
    b64_svg = base64.b64encode(svg.encode('utf-8')).decode("utf-8")
    
    html = f"""
        <img src="data:image/svg+xml;base64,{b64_svg}"/>
        <audio autoplay="false" loop>
        <source src="data:audio/wav;base64,{b64_audio}" type="audio/wav">
        </audio>
    """

    st.write(
        html,
        unsafe_allow_html=True,
    )

if start:
    ms = lib.get_milliseconds(bpm)
    total_duration = ms * beats / 1000    

    audio.BeepGenerator().generate_beep(ms, beats)
    lib.generate_svg(beats, bpm)
    

    time.sleep(0.5)

    display_metronome("./tmp/output.wav", "./output.svg")
    
    stop = st.sidebar.button("Arrêter")
    if stop:
        st.experimental_rerun()

    counter = st.empty()
    
    while True: 
        count += 1
        time.sleep(total_duration)
        counter.markdown(f"# {count}")
    
        


