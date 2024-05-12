package org.cinemagic.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Sitzplaetze")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Sitzplaetze {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "SitzplatzID")
  private Long sitzplatzID;

  @Column(name = "SaalID")
  private Long saalID;

  @Column(name = "Reihennummer")
  private int reihennummer;

  @Column(name = "Sitznummer")
  private int sitznummer;

  @Column(length = 255, name = "Sitztyp")
  private String sitztyp;
}
