package org.cinemagic.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Filme")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Filme {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "FilmID")
  private Long filmID;

  @Column(nullable = false, name = "Titel")
  private String titel;

  @Column(name = "Beschreibung")
  private String beschreibung;

  @Column(nullable = false, name = "Dauer")
  private int dauer;

  @Column(name = "Altersfreigabe")
  private int altersfreigabe;

  @Column(nullable = false, name = "Genre")
  private String genre;

  @Column(nullable = false, name = "Regisseur")
  private String regisseur;

  @Column(name = "Erscheinungsdatum")
  private String erscheinungsdatum;

  @Column(name = "Bild_Poster")
  private String bildPoster;
}
