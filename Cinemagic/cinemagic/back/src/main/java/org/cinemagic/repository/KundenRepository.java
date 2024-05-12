package org.cinemagic.repository;

import org.cinemagic.models.Kunden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface KundenRepository  extends JpaRepository<Kunden, Long> {
  @Query("SELECT k FROM Kunden k WHERE k.email = :email")
  Optional<Kunden> findKundenByEmail(@Param("email") String email);

  @Query("SELECT k FROM Kunden k WHERE k.email = :email AND k.passwort = :passwort")
  Optional<Kunden> findKundenByEmailAndPasswort(@Param("email") String email, @Param("passwort") String passwort);
}
