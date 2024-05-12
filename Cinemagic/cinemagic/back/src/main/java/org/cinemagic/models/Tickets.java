package org.cinemagic.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Tickets")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Tickets {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "TicketID")
  private Long ticketID;

  @Column(name = "VorfuehrungsID")
  private Long vorfuehrungsID;

  @Column(name = "SitzplatzID")
  private Long sitzplatzID;

  @Column(name = "KundenID")
  private Long kundenID;

  @Column(name = "Kaufdatum")
  private java.sql.Date kaufdatum;

  @Column(name = "Preis")
  private Float preis;

  @Column(name = "SaalID")
  private Long saalID;

}
