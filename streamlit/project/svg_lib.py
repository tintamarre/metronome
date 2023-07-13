import svgwrite


def generate_svg(ms, beats, bpm):

    total_duration = ms * beats

    # Ajout des cercles
    circle_spacing = 100  # Espacement horizontal entre les cercles
    circle_radius = 20  # Rayon des cercles

    # Création du dessin SVG avec une taille de 500x200
    dwg = svgwrite.Drawing(filename='./output.svg', size=(str((beats + 1) * circle_spacing) + 'px', '200px'))

    # Définition de la ligne principale
    line = dwg.line((50, 100), (350, 100), stroke='#fff', stroke_width=2)
    dwg.add(line)

    for i in range(beats):
        animation_id = 'line1a' + str(i + 1)
        animation_from = 50 + i * circle_spacing
        antimation_to = 150 + i * circle_spacing
        animation_dur = str(ms) + 'ms'
        if i == 0:
            animation_begin = "0s;" + 'line1a' + str(beats) + '.end'
        else:
            animation_begin = 'line1a' + str(i) + '.end'
        animate = dwg.animate(
                            id=animation_id,
                            attributeName='x2',
                            fill="freeze", 
                            dur=animation_dur,
                            from_=animation_from,
                            to=antimation_to,
                            begin=animation_begin
                            )
        line.add(animate)

    for i in range(beats):
        cx = 50 + i * circle_spacing
        if i == 0:
            circle = dwg.circle(center=(cx, 100),
                    r=circle_radius,
                    fill="#e76f51",
                    stroke="#e76f51",
                    stroke_width=2
                    )
        else:
            circle = dwg.circle(center=(cx, 100),
                    r=circle_radius,
                    fill="#fff",
                    stroke="#2a9d8f",
                    stroke_width=2
                    )

        dwg.add(circle)
        
        text = dwg.text(str(i + 1), insert=(cx - 5, 105), font_size="16px", font_family="monospace", fill="#fff")
        dwg.add(text)

        # if i == 0:
        #     animate1 = dwg.animate(
        #                         id='c' + str(i + 1) + 'f1',
        #                         attributeName='fill',
        #                         dur='1ms',
        #                         to="#fff",
        #                         from_="#e76f51",
        #                         begin='0s'
        #                         )
        #     circle.add(animate1)
            # # <animate id="c1f2" attributeName="fill" begin="c1f1.end" from="#e76f51" to="#e76f51" dur="1499ms" />
            # animate2 = dwg.animate(
            #                     id='c' + str(i + 1) + 'f2',
            #                     attributeName='fill',
            #                     dur=str(total_duration - 1) + 'ms',
            #                     to="#e76f51",
            #                     from_="#e76f51",
            #                     begin='c' + str(i + 1) + 'f1.end'
            #                     )
            # circle.add(animate2)

        if i != 0:
            # <animate id="c2f1" attributeName="fill" begin="line1a1.end" from="#fff" to="#2a9d8f" dur="1ms" />
            animate1 = dwg.animate(
                                id='c' + str(i + 1) + 'f1',
                                attributeName='fill',
                                dur="1ms",
                                to="#2a9d8f",
                                from_="#fff",
                                begin='line1a' + str(i) + '.end'
                                )
            circle.add(animate1)
            # <animate id="c2f2" attributeName="fill" begin="c2f1.end" from="#2a9d8f" to="#2a9d8f" dur="1499ms" />
            animate2 = dwg.animate(
                                id='c' + str(i + 1) + 'f2',
                                attributeName='fill',
                                dur=str((total_duration - (ms * i)) - 1) + 'ms',
                                to="#2a9d8f",
                                from_="#2a9d8f",
                                begin='c' + str(i + 1) + 'f1.end'
                                )
            circle.add(animate2)

    #  <line id="end_line" x1="450" y1="90" x2="450" y2="110" stroke="#ccc" stroke-width="2"></line>
    end_line_x = 50 + beats * circle_spacing
    end_line = dwg.line((end_line_x, 90), (end_line_x, 110), stroke='#fff', stroke_width=2)
    dwg.add(end_line)

    # Enregistrer le dessin SVG dans un fichier
    dwg.save(pretty=True)
    return dwg
