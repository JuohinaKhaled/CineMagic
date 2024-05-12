package org.cinemagic.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Saele")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Saele {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "SaalID")
  private Long saalID;

  @Column(nullable = false, length = 255, name = "Saalname")
  private String saalname;

  @Column(name = "Sitzplatzkapazitaet")
  private int sitzplatzkapazitaet;

  @Column(length = 255, name = "Saaltyp")
  private String saaltyp;
}
