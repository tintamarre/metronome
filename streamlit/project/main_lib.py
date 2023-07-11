import os
import glob


import svgwrite

# Création du dessin SVG avec une taille de 500x200
dwg = svgwrite.Drawing(filename='output.svg', size=('500px', '200px'))

# Définition de la ligne principale
line = dwg.line((50, 100), (350, 100), stroke='black', stroke_width=2)
dwg.add(line)

# Ajout des cercles
circle_count = 6  # Nombre de cercles à ajouter
circle_spacing = 100  # Espacement horizontal entre les cercles
circle_radius = 20  # Rayon des cercles
circle_fill = 'white'  # Couleur de remplissage des cercles
circle_stroke = 'black'  # Couleur de la bordure des cercles
circle_stroke_width = 2  # Épaisseur de la bordure des cercles

for i in range(circle_count):
    cx = 50 + i * circle_spacing
    circle = dwg.circle(center=(cx, 100), r=circle_radius, fill=circle_fill,
                        stroke=circle_stroke, stroke_width=circle_stroke_width)
    dwg.add(circle)

    # Ajouter une animation de changement de couleur pour chaque cercle
    animation_dur = str(0.5 + i * 0.25) + 's'  # Durée de l'animation en fonction de l'indice du cercle
    animation_begin = str(i * 0.5) + 's'  # Début de l'animation en fonction de l'indice du cercle
    animation_values = ';'.join([circle_fill, 'red', circle_fill])  # Valeurs de couleur pour l'animation

    animate = dwg.animate(attributeName='fill', dur=animation_dur, values=animation_values,
                          begin=animation_begin, repeatCount='indefinite')
    circle.add(animate)

# Enregistrer le dessin SVG dans un fichier
dwg.save()