import streamlit as st
import time

import main_lib as lib

st.set_page_config(page_title="Metronome")
st.title("Metronome")

svg_code = """"
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <circle cx="100" cy="100" r="50" fill="black" /> <!-- Rond noir -->
  <line x1="100" y1="100" x2="100" y2="100" id="line" stroke="black" stroke-width="2" /> <!-- Ligne horizontale initiale -->
  <animate xlink:href="#line" attributeName="x2" dur="1s" from="100" to="150" fill="freeze" /> <!-- Animation de la ligne vers la droite -->
  <circle cx="150" cy="100" r="5" fill="black" /> <!-- Cercle d'arrivée -->
</svg>
"""


text = "Welcome to the first day... of the rest... of your life"

st.markdown(svg_code, unsafe_allow_html=True)

t = st.empty()
for i in range(len(text) + 1):
    t.markdown("## %s..." % text[0:i])
    time.sleep(0.1)



