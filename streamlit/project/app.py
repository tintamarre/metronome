import streamlit as st
import time
import base64

import main_lib as lib
import svg_lib as svg
import audio_lib as audio

st.set_page_config(page_title="Metronome")
st.title("Metronome")

st.sidebar.title("Settings")

bpm = st.sidebar.slider("BPM", min_value=40, max_value=208, value=120, step=1)

beats = st.sidebar.slider("Beats", min_value=1, max_value=8, value=4, step=1)

head_col1, head_col2, head_col3 = st.columns(3)

head_col1.metric(f"{lib.get_bpm_name(bpm)}", f"{bpm}")
head_col2.metric(f"Beats", f"{beats}")
iteration = head_col3.metric(f"Iteration", f"0")

start = st.button(":blue[Démarrer le métronome]")

footer = """
        <style>
          # MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        .footer {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            background-color: #fff;
            color: grey;
            text-align: center;
        }
        </style>
        <div class="footer">
        <p>❤️ Source code available <a href="https://github.com/tintamarre/metronome">here</a></p>
        </div>
    """
st.markdown(footer, unsafe_allow_html=True)


count = 0

def display_metronome(audio_path, svg_path):
    with open(svg_path, "r") as f:
        svg = f.read()

    with open(audio_path, "rb") as f:
        audio_file = f.read()

    b64_audio = base64.b64encode(audio_file).decode("utf-8")
    b64_svg = base64.b64encode(svg.encode('utf-8')).decode("utf-8")
    
    html = f"""
        <img src="data:image/svg+xml;base64,{b64_svg}"/>
        <audio autoplay loop>
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
    svg.generate_svg(ms, beats, bpm)
    
    time.sleep(0.5)

    display_metronome("./tmp/output.wav", "./output.svg")
    
    stop = st.button("Arrêter")
    if stop:
        st.experimental_rerun()
    
    while True: 
        count += 1
        time.sleep(total_duration)
        iteration.metric(f"Iteration", f"{count}")
    
        


