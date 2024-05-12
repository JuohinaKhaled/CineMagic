package org.cinemagic.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Bewertung")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Bewertungen {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "BewertungsID")
  private Long bewertungsID;

  @Column(name = "KundenID")
  private Long kundenID;

  @Column(name = "FilmID")
  private Long filmID;

  @Column(name = "Bewertung", columnDefinition = "MEDIUMTEXT")
  private String bewertung;
}
