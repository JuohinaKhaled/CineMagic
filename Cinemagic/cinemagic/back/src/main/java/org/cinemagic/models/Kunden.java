package org.cinemagic.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Kunden")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Kunden {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "KundenID")
  private Long id;

  @Column(nullable = false, name = "Name")
  private String name;

  @Column(nullable = false, unique = true, name = "Email")
  private String email;

  @Column(name = "Telefonnummer")
  private String phoneNumber;

  @Column(nullable = false, name = "Passwort")
  private String passwort;
}


