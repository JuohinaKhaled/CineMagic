package org.cinemagic.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Vorfuehrungen")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Vorfuehrungen {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "VorfuehrungsID")
  private Long vorfuehrungsID;

  @Column(name = "FilmID")
  private Long filmID;

  @Column(name = "SaalID")
  private Long saalID;

  @Column(name = "Vorfuehrungsdatum")
  private java.sql.Date vorfuehrungsdatum;

  @Column(name = "Vorfuehrungszeit")
  private java.sql.Time vorfuehrungszeit;

  @Column(name = "Verkaufte_Tickets")
  private int verkaufteTickets;
}
