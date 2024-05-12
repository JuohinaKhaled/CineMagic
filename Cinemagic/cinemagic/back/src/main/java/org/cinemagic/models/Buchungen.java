package org.cinemagic.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Buchung")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Buchungen {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "BuchungsID")
  private Long buchungsID;

  @Column(name = "KundenID")
  private Long kundenID;

  @Column(name = "Kaufdatum")
  private java.sql.Date kaufdatum;

  @Column(name = "GesamtPreis")
  private Float gesamtPreis;

  @Column(name = "AnzahlTicketsErwachsene")
  private int anzahlTicketsErwachsene;

  @Column(name = "AnzahlTicketsKinder")
  private int anzahlTicketsKinder;

  @Column(name = "Bezahlt")
  private Boolean bezahlt;
}
