import streamlit as st
import time

import main_lib as lib

st.set_page_config(page_title="Metronome")
st.title("Metronome")

text = "Welcome to the first day... of the rest... of your life"

t = st.empty()
for i in range(len(text) + 1):
    t.markdown("## %s..." % text[0:i])
    time.sleep(0.1)